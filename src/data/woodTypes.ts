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

export const WOOD_CHIP_COLORS: Record<string, string[]> = {
  basic: ['#8B7355', '#9E8466', '#7A6248'],
  oak: ['#6B4423', '#7D5530', '#5A3A1D'],
  maple: ['#D2691E', '#E07B30', '#C45A10'],
  amber: ['#FFBF00', '#FFCC33', '#E5AB00'],
  ancient: ['#9400D3', '#A820E8', '#8000B0']
};

export function getWoodType(id: string): WoodType | undefined {
  return WOOD_TYPES[id];
}

export function getWoodValue(id: string): number {
  return WOOD_TYPES[id]?.valueMultiplier ?? 1.0;
}
