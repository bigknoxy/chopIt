import {
  GameState,
  PlayerState,
  ForestState,
  PlayerSettings,
  PlayerStats,
  TreeInstance
} from './types';
import { EventBus } from './EventBus';

export class StateManager {
  private state: GameState;
  private listeners: Set<(state: GameState) => void> = new Set();

  constructor(_eventBus: EventBus, savedPlayer?: PlayerState) {
    this.state = this.createInitialState(savedPlayer);
  }

  private createInitialState(savedPlayer?: PlayerState): GameState {
    const now = Date.now();
    return {
      player: savedPlayer ?? this.createDefaultPlayerState(),
      activeTree: null,
      queuedTrees: [],
      currentScreen: 'chop',
      isPaused: false,
      lastUpdateTimestamp: now,
      sessionStartTime: now
    };
  }

  private createDefaultPlayerState(): PlayerState {
    const now = Date.now();
    return {
      wood: { basic: 0, oak: 0, maple: 0, amber: 0, ancient: 0 },
      totalWoodEarned: 0,
      upgrades: {},
      ownedAxes: ['rusty_axe'],
      equippedAxeId: 'rusty_axe',
      unlockedTrees: ['pine_sapling'],
      forest: this.createDefaultForestState(now),
      settings: this.createDefaultSettings(),
      stats: this.createDefaultStats(),
      lastSaveTimestamp: now,
      createdAt: now
    };
  }

  private createDefaultForestState(now: number): ForestState {
    return {
      isUnlocked: false,
      baseWoodPerSecond: 0.5,
      lastTickTimestamp: now,
      accumulatedWood: 0,
      maxOfflineHours: 4
    };
  }

  private createDefaultSettings(): PlayerSettings {
    return {
      soundEnabled: true,
      musicEnabled: false,
      hapticsEnabled: true,
      reducedMotion: false,
      highContrast: false
    };
  }

  private createDefaultStats(): PlayerStats {
    return {
      treesChopped: 0,
      totalDamageDealt: 0,
      totalCrits: 0,
      totalPlayTimeMs: 0,
      longestSessionMs: 0,
      highestDPS: 0
    };
  }

  getState(): Readonly<GameState> {
    return this.state;
  }

  getPlayer(): Readonly<PlayerState> {
    return this.state.player;
  }

  setState(updates: Partial<GameState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  updatePlayer(updates: Partial<PlayerState>): void {
    this.state = {
      ...this.state,
      player: { ...this.state.player, ...updates }
    };
    this.notifyListeners();
  }

  setActiveTree(tree: TreeInstance | null): void {
    this.state = { ...this.state, activeTree: tree };
    this.notifyListeners();
  }

  addWood(woodTypeId: string, amount: number): void {
    const currentWood = this.state.player.wood[woodTypeId] ?? 0;
    this.updatePlayer({
      wood: {
        ...this.state.player.wood,
        [woodTypeId]: currentWood + amount
      },
      totalWoodEarned: this.state.player.totalWoodEarned + amount
    });
  }

  deductWood(woodTypeId: string, amount: number): boolean {
    const currentWood = this.state.player.wood[woodTypeId] ?? 0;
    if (currentWood < amount) return false;
    
    this.updatePlayer({
      wood: {
        ...this.state.player.wood,
        [woodTypeId]: currentWood - amount
      }
    });
    return true;
  }

  setScreen(screen: 'chop' | 'upgrades' | 'axes' | 'forest' | 'settings'): void {
    this.state = { ...this.state, currentScreen: screen };
    this.notifyListeners();
  }

  subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  getPlayerStateForSave(): PlayerState {
    return {
      ...this.state.player,
      lastSaveTimestamp: Date.now()
    };
  }
}
