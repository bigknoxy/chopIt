import { TreeInstance, TreeDefinition, GameState } from '../core/types';
import { TREE_TYPES, getTreeDefinition, selectTreeByWeight, getAvailableTrees } from '../data/treeTypes';
import { WOOD_TYPES } from '../data/woodTypes';

export class TreeSystem {

  createTreeInstance(def: TreeDefinition, x: number, y: number): TreeInstance {
    return {
      defId: def.id,
      currentHP: def.maxHP,
      maxHP: def.maxHP,
      x,
      y,
      scale: this.calculateScale(def),
      isActive: false,
      fallProgress: 0
    };
  }

  spawnTree(state: GameState, canvasWidth: number, canvasHeight: number): TreeInstance {
    const availableTrees = getAvailableTrees(state.player.unlockedTrees);
    const selectedTree = selectTreeByWeight(availableTrees);
    
    const x = canvasWidth / 2;
    const y = canvasHeight * 0.65;
    
    return this.createTreeInstance(selectedTree, x, y);
  }

  updateTree(tree: TreeInstance, deltaTime: number): TreeInstance {
    if (tree.fallProgress > 0) {
      const fallSpeed = 0.003;
      return {
        ...tree,
        fallProgress: Math.min(1, tree.fallProgress + fallSpeed * deltaTime)
      };
    }
    return tree;
  }

  startFallAnimation(tree: TreeInstance): TreeInstance {
    return {
      ...tree,
      fallProgress: 0.01
    };
  }

  isFallComplete(tree: TreeInstance): boolean {
    return tree.fallProgress >= 1;
  }

  getTreeColor(tree: TreeInstance): string {
    const def = getTreeDefinition(tree.defId);
    if (!def) return '#8B7355';
    
    const woodType = WOOD_TYPES[def.woodTypeId];
    return woodType?.color ?? '#8B7355';
  }

  private calculateScale(def: TreeDefinition): number {
    const baseScale = 1.0;
    const hpScale = Math.min(0.5, def.maxHP / 10000);
    return baseScale + hpScale;
  }

  checkTreeUnlock(state: GameState): string | null {
    const player = state.player;
    const totalWood = player.totalWoodEarned;
    
    for (const [id, tree] of Object.entries(TREE_TYPES)) {
      if (player.unlockedTrees.includes(id)) continue;
      if (totalWood >= tree.unlockCost) {
        return id;
      }
    }
    
    return null;
  }
}
