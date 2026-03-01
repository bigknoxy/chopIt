import { UpgradeDefinition } from '../core/types';

export const UPGRADES: Record<string, UpgradeDefinition> = {
  strength: {
    id: 'strength',
    name: 'Lumberjack Strength',
    description: 'Increase chop damage by 10% per level.',
    effectType: 'strength',
    effectPerLevel: 0.1,
    maxLevel: 50,
    baseCost: 50,
    costGrowthFactor: 1.5,
    prerequisites: [],
    icon: '💪'
  },
  axe_size: {
    id: 'axe_size',
    name: 'Bigger Axe',
    description: 'Increase hitbox size by 5% per level.',
    effectType: 'axeSize',
    effectPerLevel: 0.05,
    maxLevel: 20,
    baseCost: 100,
    costGrowthFactor: 1.4,
    prerequisites: [],
    icon: '🪓'
  },
  luck: {
    id: 'luck',
    name: 'Lucky Chops',
    description: '+2% crit chance, +1% rare wood per level.',
    effectType: 'luck',
    effectPerLevel: 0.02,
    maxLevel: 30,
    baseCost: 200,
    costGrowthFactor: 1.6,
    prerequisites: [],
    icon: '🍀'
  },
  crit_damage: {
    id: 'crit_damage',
    name: 'Crushing Blows',
    description: 'Increase crit damage by 0.2x per level.',
    effectType: 'critDamage',
    effectPerLevel: 0.2,
    maxLevel: 25,
    baseCost: 300,
    costGrowthFactor: 1.7,
    prerequisites: [{ upgradeId: 'luck', minLevel: 5 }],
    icon: '💥'
  },
  wood_gain: {
    id: 'wood_gain',
    name: 'Efficient Logging',
    description: 'Increase wood yield by 5% per level.',
    effectType: 'woodGain',
    effectPerLevel: 0.05,
    maxLevel: 40,
    baseCost: 150,
    costGrowthFactor: 1.5,
    prerequisites: [],
    icon: '🪵'
  },
  auto_chop: {
    id: 'auto_chop',
    name: 'Auto Chopper',
    description: '+1 damage per second automatically.',
    effectType: 'autoChop',
    effectPerLevel: 1.0,
    maxLevel: 100,
    baseCost: 1000,
    costGrowthFactor: 1.8,
    prerequisites: [{ upgradeId: 'strength', minLevel: 10 }],
    icon: '🤖'
  },
  idle_gain: {
    id: 'idle_gain',
    name: 'Forest Growth',
    description: '+5% forest income per level.',
    effectType: 'idleGain',
    effectPerLevel: 0.05,
    maxLevel: 50,
    baseCost: 2000,
    costGrowthFactor: 1.6,
    prerequisites: [],
    icon: '🌲'
  },
  offline_cap: {
    id: 'offline_cap',
    name: 'Extended Harvest',
    description: '+30 minutes max offline time per level.',
    effectType: 'offlineCap',
    effectPerLevel: 30,
    maxLevel: 10,
    baseCost: 5000,
    costGrowthFactor: 2.0,
    prerequisites: [{ upgradeId: 'idle_gain', minLevel: 5 }],
    icon: '⏰'
  }
};

export const UPGRADE_ORDER = [
  'strength',
  'axe_size',
  'luck',
  'crit_damage',
  'wood_gain',
  'auto_chop',
  'idle_gain',
  'offline_cap'
] as const;

export function getUpgrade(id: string): UpgradeDefinition | undefined {
  return UPGRADES[id];
}

export function getUpgradeCost(upgrade: UpgradeDefinition, currentLevel: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costGrowthFactor, currentLevel));
}

export function canAffordUpgrade(
  upgrade: UpgradeDefinition,
  currentLevel: number,
  wood: Record<string, number>
): boolean {
  if (currentLevel >= upgrade.maxLevel) return false;
  const cost = getUpgradeCost(upgrade, currentLevel);
  return (wood['basic'] ?? 0) >= cost;
}

export function meetsPrerequisites(
  upgrade: UpgradeDefinition,
  playerUpgrades: Record<string, number>
): boolean {
  return upgrade.prerequisites.every(pre => 
    (playerUpgrades[pre.upgradeId] ?? 0) >= pre.minLevel
  );
}
