import { TreeDefinition } from '../core/types';

export const TREE_TYPES: Record<string, TreeDefinition> = {
  pine_sapling: {
    id: 'pine_sapling',
    name: 'Pine Sapling',
    maxHP: 50,
    baseWoodYield: 5,
    woodTypeId: 'basic',
    spawnWeight: 100,
    unlockCost: 0
  },
  pine_mature: {
    id: 'pine_mature',
    name: 'Mature Pine',
    maxHP: 150,
    baseWoodYield: 12,
    woodTypeId: 'basic',
    spawnWeight: 80,
    unlockCost: 100
  },
  oak_young: {
    id: 'oak_young',
    name: 'Young Oak',
    maxHP: 300,
    baseWoodYield: 15,
    woodTypeId: 'oak',
    spawnWeight: 60,
    unlockCost: 500
  },
  oak_ancient: {
    id: 'oak_ancient',
    name: 'Ancient Oak',
    maxHP: 800,
    baseWoodYield: 40,
    woodTypeId: 'oak',
    spawnWeight: 40,
    unlockCost: 2000
  },
  maple_golden: {
    id: 'maple_golden',
    name: 'Golden Maple',
    maxHP: 500,
    baseWoodYield: 25,
    woodTypeId: 'maple',
    spawnWeight: 30,
    unlockCost: 5000
  },
  amber_tree: {
    id: 'amber_tree',
    name: 'Amber Tree',
    maxHP: 1500,
    baseWoodYield: 30,
    woodTypeId: 'amber',
    spawnWeight: 15,
    unlockCost: 20000
  },
  world_tree: {
    id: 'world_tree',
    name: 'World Tree',
    maxHP: 5000,
    baseWoodYield: 100,
    woodTypeId: 'ancient',
    spawnWeight: 5,
    unlockCost: 100000
  }
};

export const UNLOCK_ORDER = [
  'pine_sapling',
  'pine_mature',
  'oak_young',
  'oak_ancient',
  'maple_golden',
  'amber_tree',
  'world_tree'
] as const;

export function getTreeDefinition(id: string): TreeDefinition | undefined {
  return TREE_TYPES[id];
}

export function getAvailableTrees(unlockedTrees: string[]): TreeDefinition[] {
  return unlockedTrees
    .map(id => TREE_TYPES[id])
    .filter((t): t is TreeDefinition => t !== undefined);
}

export function selectTreeByWeight(trees: TreeDefinition[]): TreeDefinition {
  const totalWeight = trees.reduce((sum, t) => sum + t.spawnWeight, 0);
  let random = Math.random() * totalWeight;
  
  for (const tree of trees) {
    random -= tree.spawnWeight;
    if (random <= 0) {
      return tree;
    }
  }
  
  return trees[0];
}
