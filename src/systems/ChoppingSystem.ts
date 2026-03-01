import {
  GameState,
  TreeInstance,
  DamageResult,
  BASE_DAMAGE,
  BASE_CRIT_CHANCE,
  BASE_CRIT_DAMAGE,
  HOLD_TICK_RATE_MS,
  MIN_TAP_INTERVAL_MS
} from '../core/types';
import { getTreeDefinition } from '../data/treeTypes';
import { getAxe } from '../data/axes';

export class ChoppingSystem {
  private lastHitTime: number = 0;

  canHit(_state: GameState, isHold: boolean): boolean {
    const now = Date.now();
    const minInterval = isHold ? HOLD_TICK_RATE_MS : MIN_TAP_INTERVAL_MS;
    return now - this.lastHitTime >= minInterval;
  }

  calculateDamage(state: GameState): DamageResult {
    const player = state.player;
    const axe = getAxe(player.equippedAxeId);
    
    const strengthLevel = player.upgrades['strength'] ?? 0;
    const luckLevel = player.upgrades['luck'] ?? 0;
    const critDamageLevel = player.upgrades['crit_damage'] ?? 0;
    
    const strengthMultiplier = 1 + strengthLevel * 0.1;
    const axeMultiplier = axe?.damageMultiplier ?? 1.0;
    
    let damage = BASE_DAMAGE * strengthMultiplier * axeMultiplier;
    
    const critChance = BASE_CRIT_CHANCE + luckLevel * 0.02 + (axe?.critBonus ?? 0);
    const isCrit = Math.random() < critChance;
    
    if (isCrit) {
      const critMultiplier = BASE_CRIT_DAMAGE + critDamageLevel * 0.2;
      damage *= critMultiplier;
    }
    
    const hasDoubleWood = axe?.specialAbility === 'doubleWood';
    const isDoubleWood = hasDoubleWood && Math.random() < 0.15;
    
    return {
      damage: Math.max(1, Math.floor(damage)),
      isCrit,
      isDoubleWood
    };
  }

  applyDamage(tree: TreeInstance, damage: number): TreeInstance {
    return {
      ...tree,
      currentHP: Math.max(0, tree.currentHP - damage),
      isActive: true
    };
  }

  isTreeDead(tree: TreeInstance): boolean {
    return tree.currentHP <= 0;
  }

  calculateWoodReward(tree: TreeInstance, state: GameState, isDoubleWood: boolean): { woodTypeId: string; amount: number } {
    const def = getTreeDefinition(tree.defId);
    if (!def) return { woodTypeId: 'basic', amount: 0 };
    
    const player = state.player;
    const woodGainLevel = player.upgrades['wood_gain'] ?? 0;
    const luckLevel = player.upgrades['luck'] ?? 0;
    
    const woodGainMultiplier = 1 + woodGainLevel * 0.05;
    const rareBonus = luckLevel * 0.01;
    
    let baseAmount = Math.floor(def.baseWoodYield * woodGainMultiplier);
    
    if (isDoubleWood) {
      baseAmount *= 2;
    }
    
    if (Math.random() < rareBonus) {
      baseAmount = Math.floor(baseAmount * 1.5);
    }
    
    return {
      woodTypeId: def.woodTypeId,
      amount: baseAmount
    };
  }

  getAutoChopDPS(state: GameState): number {
    const autoChopLevel = state.player.upgrades['auto_chop'] ?? 0;
    return autoChopLevel;
  }

  update(deltaTime: number, state: GameState): { autoDamage: number } {
    const dps = this.getAutoChopDPS(state);
    const damage = (dps * deltaTime) / 1000;
    
    return { autoDamage: Math.floor(damage) };
  }

  markHit(): void {
    this.lastHitTime = Date.now();
  }
}
