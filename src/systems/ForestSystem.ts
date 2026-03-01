import { GameState, PlayerState } from '../core/types';
import {
  FOREST_UNLOCK_WOOD,
  FOREST_UNLOCK_UPGRADES,
  FOREST_UNLOCK_PLAYTIME_MS
} from '../core/types';
import { UpgradeSystem } from './UpgradeSystem';

export class ForestSystem {
  private upgradeSystem: UpgradeSystem;

  constructor(upgradeSystem: UpgradeSystem) {
    this.upgradeSystem = upgradeSystem;
  }

  checkUnlock(state: GameState): boolean {
    if (state.player.forest.isUnlocked) return false;

    const player = state.player;
    const totalWood = player.totalWoodEarned;
    const totalUpgrades = Object.keys(player.upgrades).length;
    const playTime = Date.now() - player.createdAt;

    return (
      totalWood >= FOREST_UNLOCK_WOOD ||
      totalUpgrades >= FOREST_UNLOCK_UPGRADES ||
      playTime >= FOREST_UNLOCK_PLAYTIME_MS
    );
  }

  unlock(state: GameState): PlayerState {
    return {
      ...state.player,
      forest: {
        ...state.player.forest,
        isUnlocked: true
      }
    };
  }

  calculateWPS(state: GameState): number {
    if (!state.player.forest.isUnlocked) return 0;

    const baseWPS = state.player.forest.baseWoodPerSecond;
    const idleMultiplier = this.upgradeSystem.getIdleGainMultiplier(state);
    
    const axeBonus = this.getAxeForestBonus(state);
    
    return baseWPS * idleMultiplier * (1 + axeBonus);
  }

  calculateOfflineGains(state: GameState, elapsedMs: number): number {
    if (!state.player.forest.isUnlocked) return 0;

    const maxOfflineMs = this.upgradeSystem.getMaxOfflineHours(state) * 60 * 60 * 1000;
    const cappedElapsed = Math.min(elapsedMs, maxOfflineMs);
    
    const wps = this.calculateWPS(state);
    const seconds = cappedElapsed / 1000;
    
    return Math.floor(seconds * wps);
  }

  collectOfflineGains(state: GameState): PlayerState {
    const now = Date.now();
    const elapsed = now - state.player.forest.lastTickTimestamp;
    const gains = this.calculateOfflineGains(state, elapsed);

    return {
      ...state.player,
      wood: {
        ...state.player.wood,
        basic: state.player.wood['basic'] + gains
      },
      totalWoodEarned: state.player.totalWoodEarned + gains,
      forest: {
        ...state.player.forest,
        lastTickTimestamp: now,
        accumulatedWood: 0
      }
    };
  }

  update(deltaTime: number, state: GameState): PlayerState {
    if (!state.player.forest.isUnlocked) return state.player;

    const wps = this.calculateWPS(state);
    const gain = (wps * deltaTime) / 1000;

    return {
      ...state.player,
      wood: {
        ...state.player.wood,
        basic: state.player.wood['basic'] + gain
      },
      totalWoodEarned: state.player.totalWoodEarned + gain,
      forest: {
        ...state.player.forest,
        lastTickTimestamp: Date.now()
      }
    };
  }

  getMaxOfflineHours(state: GameState): number {
    return this.upgradeSystem.getMaxOfflineHours(state);
  }

  getTimeUntilMax(state: GameState): number {
    const wps = this.calculateWPS(state);
    if (wps === 0) return Infinity;

    const maxOfflineMs = this.upgradeSystem.getMaxOfflineHours(state) * 60 * 60 * 1000;
    const elapsed = Date.now() - state.player.forest.lastTickTimestamp;
    const remaining = maxOfflineMs - elapsed;

    return Math.max(0, remaining);
  }

  private getAxeForestBonus(state: GameState): number {
    const equippedAxe = state.player.equippedAxeId;
    if (equippedAxe === 'ancient_axe') {
      return 0.2;
    }
    return 0;
  }
}
