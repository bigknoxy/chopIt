import { GameState, PlayerState } from '../core/types';
import { AXES, getAxe, canAffordAxe, deductAxeCost, AxeDefinition } from '../data/axes';

export class AxeSystem {
  canUnlock(axeId: string, state: GameState): { canUnlock: boolean; reason: string } {
    const axe = getAxe(axeId);
    if (!axe) {
      return { canUnlock: false, reason: 'Axe not found' };
    }

    if (state.player.ownedAxes.includes(axeId)) {
      return { canUnlock: false, reason: 'Already owned' };
    }

    if (!canAffordAxe(axe, state.player.wood)) {
      return { canUnlock: false, reason: 'Not enough materials' };
    }

    return { canUnlock: true, reason: '' };
  }

  unlock(axeId: string, state: GameState): PlayerState | null {
    const result = this.canUnlock(axeId, state);
    if (!result.canUnlock) return null;

    const axe = getAxe(axeId)!;
    const newWood = deductAxeCost(state.player.wood, axe);

    return {
      ...state.player,
      wood: newWood,
      ownedAxes: [...state.player.ownedAxes, axeId]
    };
  }

  canEquip(axeId: string, state: GameState): boolean {
    return state.player.ownedAxes.includes(axeId);
  }

  equip(axeId: string, state: GameState): PlayerState | null {
    if (!this.canEquip(axeId, state)) return null;

    return {
      ...state.player,
      equippedAxeId: axeId
    };
  }

  getEquippedAxe(state: GameState): AxeDefinition | undefined {
    return getAxe(state.player.equippedAxeId);
  }

  getAxeStats(axeId: string): { damage: number; crit: number; special?: string } | null {
    const axe = getAxe(axeId);
    if (!axe) return null;

    return {
      damage: axe.damageMultiplier,
      crit: axe.critBonus * 100,
      special: axe.specialAbilityDescription
    };
  }

  hasDoubleWood(state: GameState): boolean {
    const axe = this.getEquippedAxe(state);
    return axe?.specialAbility === 'doubleWood';
  }

  hasForestSpirit(state: GameState): boolean {
    const axe = this.getEquippedAxe(state);
    return axe?.specialAbility === 'forestSpirit';
  }

  getForestBonus(state: GameState): number {
    if (this.hasForestSpirit(state)) {
      return 0.2;
    }
    return 0;
  }

  getAllAxes(): AxeDefinition[] {
    return Object.values(AXES);
  }
}
