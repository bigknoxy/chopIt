import { WoodType } from '../core/types';

export const WOOD_TYPES: Record<string, WoodType> = {
  basic: {
    id: 'basic',
    name: 'Pine Wood',
    valueMultiplier: 1.0,
    rarity: 'common',
    color: '#8B7355'
  },
  oak: {
    id: 'oak',
    name: 'Oak Wood',
    valueMultiplier: 2.5,
    rarity: 'common',
    color: '#6B4423'
  },
  maple: {
    id: 'maple',
    name: 'Maple Wood',
    valueMultiplier: 5.0,
    rarity: 'rare',
    color: '#D2691E'
  },
  amber: {
    id: 'amber',
    name: 'Amber Heart',
    valueMultiplier: 15.0,
    rarity: 'epic',
    color: '#FFBF00'
  },
  ancient: {
    id: 'ancient',
    name: 'Ancient Core',
    valueMultiplier: 50.0,
    rarity: 'legendary',
    color: '#9400D3'
  }
};

export const WOOD_TYPE_ORDER = ['basic', 'oak', 'maple', 'amber', 'ancient'] as const;

export function getWoodType(id: string): WoodType | undefined {
  return WOOD_TYPES[id];
}

export function getWoodValue(id: string): number {
  return WOOD_TYPES[id]?.valueMultiplier ?? 1.0;
}
