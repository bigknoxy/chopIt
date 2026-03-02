import { AxeDefinition } from '../core/types';
export type { AxeDefinition, AxeVisualConfig } from '../core/types';

export const AXES: Record<string, AxeDefinition> = {
  rusty_axe: {
    id: 'rusty_axe',
    name: 'Rusty Axe',
    tier: 1,
    damageMultiplier: 1.0,
    critBonus: 0,
    unlockCost: [],
    icon: '🪓',
    visual: {
      bladeColor: '#B87333',
      handleColor: '#8B4513',
      bladeWidth: 1.0,
      bladeHeight: 1.0,
      bladeShape: 'wedge',
      hasGlow: false,
      shineEffect: false,
      particles: {
        chipCount: 6,
        chipSizeRange: [2, 4],
        shakeIntensity: 3,
        hitPauseMs: 20,
        impactRadius: 25,
        hasTrail: false
      }
    }
  },
  iron_axe: {
    id: 'iron_axe',
    name: 'Iron Axe',
    tier: 2,
    damageMultiplier: 1.5,
    critBonus: 0.03,
    unlockCost: [{ woodTypeId: 'basic', amount: 500 }],
    icon: '⛏️',
    visual: {
      bladeColor: '#708090',
      handleColor: '#654321',
      bladeWidth: 1.2,
      bladeHeight: 1.1,
      bladeShape: 'wide',
      hasGlow: false,
      shineEffect: false,
      particles: {
        chipCount: 8,
        chipSizeRange: [3, 5],
        shakeIntensity: 4,
        hitPauseMs: 25,
        impactRadius: 30,
        hasTrail: false
      }
    }
  },
  steel_axe: {
    id: 'steel_axe',
    name: 'Steel Axe',
    tier: 3,
    damageMultiplier: 2.5,
    critBonus: 0.05,
    unlockCost: [
      { woodTypeId: 'basic', amount: 2000 },
      { woodTypeId: 'oak', amount: 50 }
    ],
    icon: '⚔️',
    visual: {
      bladeColor: '#C0C0C0',
      handleColor: '#2F1810',
      bladeWidth: 1.3,
      bladeHeight: 1.2,
      bladeShape: 'jagged',
      hasGlow: false,
      shineEffect: true,
      particles: {
        chipCount: 10,
        chipSizeRange: [3, 6],
        shakeIntensity: 5,
        hitPauseMs: 30,
        impactRadius: 35,
        hasTrail: false
      }
    }
  },
  gilded_axe: {
    id: 'gilded_axe',
    name: 'Gilded Axe',
    tier: 4,
    damageMultiplier: 4.0,
    critBonus: 0.08,
    specialAbility: 'doubleWood',
    specialAbilityDescription: '15% chance for 2x wood',
    unlockCost: [
      { woodTypeId: 'basic', amount: 5000 },
      { woodTypeId: 'oak', amount: 200 },
      { woodTypeId: 'maple', amount: 30 }
    ],
    icon: '🔱',
    visual: {
      bladeColor: '#FFD700',
      handleColor: '#8B0000',
      bladeWidth: 1.4,
      bladeHeight: 1.3,
      bladeShape: 'ornate',
      hasGlow: true,
      glowColor: '#FFD700',
      shineEffect: true,
      particles: {
        chipCount: 12,
        chipSizeRange: [4, 7],
        shakeIntensity: 7,
        hitPauseMs: 40,
        impactRadius: 45,
        specialColors: ['#FFD700', '#FFA500'],
        hasTrail: true
      }
    }
  },
  ancient_axe: {
    id: 'ancient_axe',
    name: 'Ancient Heart',
    tier: 5,
    damageMultiplier: 6.0,
    critBonus: 0.12,
    specialAbility: 'forestSpirit',
    specialAbilityDescription: '+20% forest income',
    unlockCost: [
      { woodTypeId: 'oak', amount: 10000 },
      { woodTypeId: 'maple', amount: 100 },
      { woodTypeId: 'amber', amount: 20 }
    ],
    icon: '🌟',
    visual: {
      bladeColor: '#9932CC',
      handleColor: '#1a1a2e',
      bladeWidth: 1.5,
      bladeHeight: 1.4,
      bladeShape: 'crystal',
      hasGlow: true,
      glowColor: '#9932CC',
      shineEffect: true,
      particles: {
        chipCount: 15,
        chipSizeRange: [4, 8],
        shakeIntensity: 9,
        hitPauseMs: 50,
        impactRadius: 55,
        specialColors: ['#9932CC', '#DA70D6'],
        hasTrail: true
      }
    }
  }
};

export const AXE_ORDER = [
  'rusty_axe',
  'iron_axe',
  'steel_axe',
  'gilded_axe',
  'ancient_axe'
] as const;

export function getAxe(id: string): AxeDefinition | undefined {
  return AXES[id];
}

export function canAffordAxe(
  axe: AxeDefinition,
  wood: Record<string, number>
): boolean {
  return axe.unlockCost.every(cost => 
    (wood[cost.woodTypeId] ?? 0) >= cost.amount
  );
}

export function deductAxeCost(
  wood: Record<string, number>,
  axe: AxeDefinition
): Record<string, number> {
  const newWood = { ...wood };
  for (const cost of axe.unlockCost) {
    newWood[cost.woodTypeId] = (newWood[cost.woodTypeId] ?? 0) - cost.amount;
  }
  return newWood;
}
