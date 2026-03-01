import {
  GameLoop,
  EventBus,
  StateManager,
  SaveSystem,
  GameState,
  TreeInstance,
  DamageResult
} from './core';
import {
  ChoppingSystem,
  TreeSystem,
  UpgradeSystem,
  AxeSystem,
  ForestSystem,
  EffectSystem
} from './systems';
import { AudioAdapter, HapticsAdapter } from './platform';
import { formatNumber } from './utils';
import { AxeAnimationState, SWING_DURATION_MS, CRIT_FLASH_DURATION_MS } from './core/types';
import { AxeRenderer } from './ui/renderer/AxeRenderer';
import { getAxe } from './data/axes';

export class Game {
  private gameLoop: GameLoop;
  private eventBus: EventBus;
  private stateManager: StateManager;
  private saveSystem: SaveSystem;

  private choppingSystem: ChoppingSystem;
  private treeSystem: TreeSystem;
  private upgradeSystem: UpgradeSystem;
  private axeSystem: AxeSystem;
  private forestSystem: ForestSystem;
  private effectSystem: EffectSystem;

  private audioAdapter: AudioAdapter;
  private hapticsAdapter: HapticsAdapter;

  private axeRenderer: AxeRenderer;
  private axeAnimState: AxeAnimationState = {
    swingProgress: 1,
    isCritPending: false,
    critFlashTime: 0
  };

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private dpr: number = 1;

  private isHolding: boolean = false;
  private lastTapTime: number = 0;
  private holdInterval: number | null = null;
  private readonly TAP_COOLDOWN = 50;
  private readonly HOLD_INTERVAL = 100;

  private static readonly TAP_COOLDOWN_MS = 50;
  private static readonly HOLD_INTERVAL_MS = 100;
  private static readonly RENDER_PADDING = 16;
  private static readonly HP_BAR_WIDTH = 100;
  private static readonly HP_BAR_HEIGHT = 8;
  private static readonly HP_BAR_X_OFFSET = -50;
  private static readonly HP_BAR_Y_OFFSET = -200;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.eventBus = new EventBus();
    this.stateManager = new StateManager(this.eventBus);
    this.saveSystem = new SaveSystem(this.eventBus, () => this.stateManager.getPlayerStateForSave());

    this.choppingSystem = new ChoppingSystem();
    this.treeSystem = new TreeSystem();
    this.upgradeSystem = new UpgradeSystem();
    this.axeSystem = new AxeSystem();
    this.forestSystem = new ForestSystem(this.upgradeSystem);
    this.effectSystem = new EffectSystem();

    this.audioAdapter = new AudioAdapter();
    this.hapticsAdapter = new HapticsAdapter();

    this.axeRenderer = new AxeRenderer();

    this.gameLoop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );

    this.setupCanvas();
    this.setupInput();
    this.setupEvents();
  }

  async init(): Promise<void> {
    await this.audioAdapter.init();
    await this.hapticsAdapter.init();

    const savedPlayer = await this.saveSystem.load();
    if (savedPlayer) {
      this.stateManager = new StateManager(this.eventBus, savedPlayer);
      await this.processOfflineGains();
    }

    this.spawnNewTree();
    this.saveSystem.startAutosave();
    this.gameLoop.start();
  }

  private async processOfflineGains(): Promise<void> {
    const state = this.stateManager.getState();
    if (state.player.forest.isUnlocked) {
      const gains = this.forestSystem.calculateOfflineGains(
        state,
        Date.now() - state.player.forest.lastTickTimestamp
      );
      if (gains > 0) {
        this.stateManager.updatePlayer({
          wood: {
            ...state.player.wood,
            basic: state.player.wood['basic'] + gains
          },
          totalWoodEarned: state.player.totalWoodEarned + gains
        });
        this.eventBus.emit('offline:gains', { amount: gains });
      }
    }
  }

  private setupCanvas(): void {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.dpr = window.devicePixelRatio || 1;
    this.width = this.canvas.clientWidth;
    this.height = this.canvas.clientHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  private setupInput(): void {
    const handleStart = () => {
      const state = this.stateManager.getState();
      if (state.currentScreen !== 'chop') return;

      this.isHolding = true;
      this.handleTap();
      this.startHoldLoop();
    };

    const handleEnd = () => {
      this.isHolding = false;
      if (this.holdInterval) {
        clearInterval(this.holdInterval);
        this.holdInterval = null;
      }
    };

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleStart();
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleEnd();
    }, { passive: false });

    this.canvas.addEventListener('mousedown', () => {
      handleStart();
    });

    this.canvas.addEventListener('mouseup', handleEnd);
    this.canvas.addEventListener('mouseleave', handleEnd);
  }

  private startHoldLoop(): void {
    if (this.holdInterval) return;
    this.holdInterval = window.setInterval(() => {
      if (this.isHolding) {
        this.handleTap();
      }
    }, this.HOLD_INTERVAL);
  }

  private handleTap(): void {
    const now = Date.now();
    if (now - this.lastTapTime < this.TAP_COOLDOWN) return;
    this.lastTapTime = now;

    const state = this.stateManager.getState();
    const tree = state.activeTree;
    if (!tree || tree.fallProgress > 0) return;

    if (!this.choppingSystem.canHit(state, true)) return;

    const result = this.choppingSystem.calculateDamage(state);
    const newTree = this.choppingSystem.applyDamage(tree, result.damage);
    this.choppingSystem.markHit();

    this.stateManager.setActiveTree(newTree);

    this.effectSystem.createDamageText(
      newTree.x + (Math.random() - 0.5) * 40,
      newTree.y - 100,
      result.damage,
      result.isCrit
    );

    if (result.isCrit) {
      this.hapticsAdapter.medium();
      this.audioAdapter.play('crit');
    } else {
      this.hapticsAdapter.light();
      this.audioAdapter.play('chop');
    }

    // Trigger axe swing animation
    this.axeAnimState.swingProgress = 0;
    if (result.isCrit) {
      this.axeAnimState.isCritPending = true;
      this.axeAnimState.critFlashTime = CRIT_FLASH_DURATION_MS;
    }

    if (this.choppingSystem.isTreeDead(newTree)) {
      this.handleTreeKilled(newTree, result);
    }

    this.saveSystem.markDirty();
  }

  private handleTreeKilled(tree: TreeInstance, result: DamageResult): void {
    const state = this.stateManager.getState();
    const woodReward = this.choppingSystem.calculateWoodReward(
      tree,
      state,
      result.isDoubleWood
    );

    this.stateManager.addWood(woodReward.woodTypeId, woodReward.amount);

    this.effectSystem.createWoodText(
      tree.x,
      tree.y - 50,
      woodReward.amount,
      woodReward.woodTypeId
    );

    const fallingTree = this.treeSystem.startFallAnimation(tree);
    this.stateManager.setActiveTree(fallingTree);

    this.audioAdapter.play('fall');
    this.hapticsAdapter.medium();

    this.stateManager.updatePlayer({
      stats: {
        ...state.player.stats,
        treesChopped: state.player.stats.treesChopped + 1
      }
    });

    this.eventBus.emit('tree:killed', { treeId: tree.defId, wood: woodReward });

    const newUnlock = this.treeSystem.checkTreeUnlock(this.stateManager.getState());
    if (newUnlock) {
      this.stateManager.updatePlayer({
        unlockedTrees: [...state.player.unlockedTrees, newUnlock]
      });
    }

    this.saveSystem.markDirty();
  }

  private spawnNewTree(): void {
    const state = this.stateManager.getState();
    const tree = this.treeSystem.spawnTree(state, this.width, this.height);
    this.stateManager.setActiveTree(tree);
  }

  private setupEvents(): void {
    this.eventBus.on('tree:killed', () => {
      setTimeout(() => this.spawnNewTree(), 500);
    });
  }

  private update(deltaTime: number): void {
    // Update axe animation
    if (this.axeAnimState.swingProgress < 1) {
      this.axeAnimState.swingProgress = Math.min(1, 
        this.axeAnimState.swingProgress + deltaTime / SWING_DURATION_MS
      );
    }
    if (this.axeAnimState.critFlashTime > 0) {
      this.axeAnimState.critFlashTime = Math.max(0, 
        this.axeAnimState.critFlashTime - deltaTime
      );
      if (this.axeAnimState.critFlashTime === 0) {
        this.axeAnimState.isCritPending = false;
      }
    }

    const state = this.stateManager.getState();
    let tree = state.activeTree;

    if (tree) {
      if (tree.fallProgress > 0) {
        tree = this.treeSystem.updateTree(tree, deltaTime);
        this.stateManager.setActiveTree(tree);

        if (this.treeSystem.isFallComplete(tree)) {
          this.spawnNewTree();
        }
      }

      const { autoDamage } = this.choppingSystem.update(deltaTime, state);
      if (autoDamage > 0 && tree.fallProgress === 0) {
        const result: DamageResult = {
          damage: autoDamage,
          isCrit: false,
          isDoubleWood: false
        };
        const newTree = this.choppingSystem.applyDamage(tree, autoDamage);
        this.stateManager.setActiveTree(newTree);

        if (this.choppingSystem.isTreeDead(newTree)) {
          this.handleTreeKilled(newTree, result);
        }
      }
    }

    if (state.player.forest.isUnlocked) {
      const newPlayer = this.forestSystem.update(deltaTime, state);
      this.stateManager.updatePlayer(newPlayer);
    }

    this.effectSystem.update(deltaTime);

    if (this.forestSystem.checkUnlock(this.stateManager.getState())) {
      const newPlayer = this.forestSystem.unlock(this.stateManager.getState());
      this.stateManager.updatePlayer(newPlayer);
      this.eventBus.emit('forest:unlocked', {});
    }
  }

  private render(): void {
    const state = this.stateManager.getState();

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.renderBackground();
    this.renderTree(state.activeTree);
    this.renderAxe(state);
    this.renderEffects();
    this.renderUI(state);
  }

  private renderBackground(): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1B5E20');
    gradient.addColorStop(1, '#2E7D32');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#1B5E20';
    this.ctx.fillRect(0, this.height - 80, this.width, 80);
  }

  private renderTree(tree: TreeInstance | null): void {
    if (!tree) return;

    const ctx = this.ctx;
    ctx.save();

    const shakeX = tree.isActive && tree.fallProgress === 0 ? (Math.random() - 0.5) * 3 : 0;
    const shakeY = tree.isActive && tree.fallProgress === 0 ? (Math.random() - 0.5) * 2 : 0;

    ctx.translate(tree.x + shakeX, tree.y + shakeY);

    if (tree.fallProgress > 0) {
      const rotation = tree.fallProgress * Math.PI / 2;
      ctx.rotate(rotation);
      ctx.globalAlpha = 1 - tree.fallProgress;
    }

    const scale = tree.scale;
    const color = this.treeSystem.getTreeColor(tree);

    const trunkWidth = 30 * scale;
    const trunkHeight = 80 * scale;
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(-trunkWidth / 2, -trunkHeight, trunkWidth, trunkHeight);

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(0, -trunkHeight - 60 * scale);
    ctx.lineTo(-50 * scale, -trunkHeight);
    ctx.lineTo(50 * scale, -trunkHeight);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -trunkHeight - 90 * scale);
    ctx.lineTo(-40 * scale, -trunkHeight - 30 * scale);
    ctx.lineTo(40 * scale, -trunkHeight - 30 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -trunkHeight - 120 * scale);
    ctx.lineTo(-30 * scale, -trunkHeight - 60 * scale);
    ctx.lineTo(30 * scale, -trunkHeight - 60 * scale);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    if (tree.fallProgress === 0) {
      this.renderHPBar(tree);
    }
  }

  private renderAxe(state: GameState): void {
    const tree = state.activeTree;
    if (!tree || tree.fallProgress > 0) return;
    
    const axeDef = getAxe(state.player.equippedAxeId);
    if (!axeDef || !axeDef.visual) return;
    
    const axeSizeLevel = state.player.upgrades['axe_size'] ?? 0;
    const scale = 1 + axeSizeLevel * 0.05;
    
    this.axeRenderer.render(
      this.ctx,
      axeDef,
      axeDef.visual,
      this.axeAnimState,
      tree.x,
      tree.y,
      scale
    );
  }

  private renderHPBar(tree: TreeInstance): void {
    const hpPercent = tree.currentHP / tree.maxHP;
    const barWidth = 100;
    const barHeight = 8;
    const barX = tree.x - barWidth / 2;
    const barY = tree.y - 200 * tree.scale;

    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(barX, barY, barWidth, barHeight);

    let hpColor = '#4CAF50';
    if (hpPercent <= 0.3) hpColor = '#F44336';
    else if (hpPercent <= 0.6) hpColor = '#FFC107';

    this.ctx.fillStyle = hpColor;
    this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  private renderEffects(): void {
    const texts = this.effectSystem.getFloatingTexts();

    for (const text of texts) {
      this.ctx.save();
      this.ctx.globalAlpha = text.alpha;
      this.ctx.font = `bold ${Math.floor(20 * text.scale)}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = text.color;
      this.ctx.fillText(text.text, text.x, text.y);
      this.ctx.restore();
    }
  }

  private renderUI(state: GameState): void {
    const padding = 16;

    this.ctx.font = 'bold 24px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(`🪵 ${formatNumber(state.player.wood['basic'] ?? 0)}`, padding, 40);

    let offsetX = padding;
    const specialWoods = ['oak', 'maple', 'amber', 'ancient'];
    this.ctx.font = '16px sans-serif';
    for (const woodType of specialWoods) {
      const amount = state.player.wood[woodType] ?? 0;
      if (amount > 0) {
        offsetX += 80;
        this.ctx.fillText(`${formatNumber(amount)}`, offsetX, 40);
      }
    }

    const axe = this.axeSystem.getEquippedAxe(state);
    if (axe) {
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`${axe.icon} ${axe.name}`, this.width - padding, 40);
    }
  }

  getUpgradeSystem(): UpgradeSystem {
    return this.upgradeSystem;
  }

  getAxeSystem(): AxeSystem {
    return this.axeSystem;
  }

  getForestSystem(): ForestSystem {
    return this.forestSystem;
  }

  getStateManager(): StateManager {
    return this.stateManager;
  }

  getEventBus(): EventBus {
    return this.eventBus;
  }

  destroy(): void {
    this.gameLoop.stop();
    this.saveSystem.stopAutosave();
    this.saveSystem.save(this.stateManager.getPlayerStateForSave());
  }
}
