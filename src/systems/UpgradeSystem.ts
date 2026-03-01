import { GameState, PlayerState, UpgradeDefinition } from '../core/types';
import { UPGRADES, getUpgrade, getUpgradeCost, meetsPrerequisites } from '../data/upgrades';

export class UpgradeSystem {
  getUpgradeCost(upgradeId: string, currentLevel: number): number {
    const upgrade = getUpgrade(upgradeId);
    if (!upgrade) return Infinity;
    return getUpgradeCost(upgrade, currentLevel);
  }

  canPurchase(upgradeId: string, state: GameState): { canBuy: boolean; reason: string } {
    const upgrade = getUpgrade(upgradeId);
    if (!upgrade) {
      return { canBuy: false, reason: 'Upgrade not found' };
    }

    const currentLevel = state.player.upgrades[upgradeId] ?? 0;
    
    if (currentLevel >= upgrade.maxLevel) {
      return { canBuy: false, reason: 'Max level reached' };
    }

    if (!meetsPrerequisites(upgrade, state.player.upgrades)) {
      return { canBuy: false, reason: 'Prerequisites not met' };
    }

    const cost = this.getUpgradeCost(upgradeId, currentLevel);
    if ((state.player.wood['basic'] ?? 0) < cost) {
      return { canBuy: false, reason: 'Not enough wood' };
    }

    return { canBuy: true, reason: '' };
  }

  purchase(upgradeId: string, state: GameState): PlayerState | null {
    const result = this.canPurchase(upgradeId, state);
    if (!result.canBuy) return null;

    const currentLevel = state.player.upgrades[upgradeId] ?? 0;
    const cost = this.getUpgradeCost(upgradeId, currentLevel);

    return {
      ...state.player,
      wood: {
        ...state.player.wood,
        basic: state.player.wood['basic'] - cost
      },
      upgrades: {
        ...state.player.upgrades,
        [upgradeId]: currentLevel + 1
      }
    };
  }

  getEffectValue(effectType: string, state: GameState): number {
    let total = 0;
    
    for (const [id, level] of Object.entries(state.player.upgrades)) {
      const upgrade = getUpgrade(id);
      if (upgrade && upgrade.effectType === effectType) {
        total += upgrade.effectPerLevel * level;
      }
    }
    
    return total;
  }

  getStrengthMultiplier(state: GameState): number {
    return 1 + this.getEffectValue('strength', state);
  }

  getCritChance(state: GameState): number {
    const base = 0.05;
    const luckBonus = this.getEffectValue('luck', state);
    return Math.min(0.75, base + luckBonus);
  }

  getCritDamage(state: GameState): number {
    const base = 2.0;
    const bonus = this.getEffectValue('critDamage', state);
    return base + bonus;
  }

  getWoodGainMultiplier(state: GameState): number {
    return 1 + this.getEffectValue('woodGain', state);
  }

  getAutoChopDPS(state: GameState): number {
    return this.getEffectValue('autoChop', state);
  }

  getIdleGainMultiplier(state: GameState): number {
    return 1 + this.getEffectValue('idleGain', state);
  }

  getMaxOfflineHours(state: GameState): number {
    const base = 4;
    const bonus = this.getEffectValue('offlineCap', state) / 60;
    return base + bonus;
  }

  getAllUpgrades(): UpgradeDefinition[] {
    return Object.values(UPGRADES);
  }
}
