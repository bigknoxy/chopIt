export type WoodTypeId = string;
export type TreeDefinitionId = string;
export type UpgradeId = string;
export type AxeId = string;

export type WoodRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type UpgradeEffectType =
  | 'strength'
  | 'axeSize'
  | 'luck'
  | 'autoChop'
  | 'idleGain'
  | 'critDamage'
  | 'woodGain'
  | 'offlineCap';

export type AxeSpecialAbility =
  | 'doubleWood'
  | 'splashDamage'
  | 'fastTick'
  | 'luckyStrike'
  | 'forestSpirit';

export type SpecialMechanic =
  | 'chest'
  | 'timed'
  | 'multiPhase'
  | 'golden';

export type ScreenType = 'chop' | 'upgrades' | 'axes' | 'forest' | 'settings';

export interface WoodType {
  id: WoodTypeId;
  name: string;
  valueMultiplier: number;
  rarity: WoodRarity;
  color: string;
}

export interface TreeDefinition {
  id: TreeDefinitionId;
  name: string;
  maxHP: number;
  baseWoodYield: number;
  woodTypeId: WoodTypeId;
  spawnWeight: number;
  unlockCost: number;
  specialMechanic?: SpecialMechanic;
}

export interface TreeInstance {
  defId: TreeDefinitionId;
  currentHP: number;
  maxHP: number;
  x: number;
  y: number;
  scale: number;
  isActive: boolean;
  fallProgress: number;
}

export interface UpgradePrerequisite {
  upgradeId: UpgradeId;
  minLevel: number;
}

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  description: string;
  effectType: UpgradeEffectType;
  effectPerLevel: number;
  maxLevel: number;
  baseCost: number;
  costGrowthFactor: number;
  prerequisites: UpgradePrerequisite[];
  icon: string;
}

export interface AxeUnlockCost {
  woodTypeId: WoodTypeId;
  amount: number;
}

export interface AxeDefinition {
  id: AxeId;
  name: string;
  tier: number;
  damageMultiplier: number;
  critBonus: number;
  specialAbility?: AxeSpecialAbility;
  specialAbilityDescription?: string;
  unlockCost: AxeUnlockCost[];
  icon: string;
  visual?: AxeVisualConfig;
}

export interface ForestState {
  isUnlocked: boolean;
  baseWoodPerSecond: number;
  lastTickTimestamp: number;
  accumulatedWood: number;
  maxOfflineHours: number;
}

export interface PlayerSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface PlayerStats {
  treesChopped: number;
  totalDamageDealt: number;
  totalCrits: number;
  totalPlayTimeMs: number;
  longestSessionMs: number;
  highestDPS: number;
}

export interface PlayerState {
  wood: Record<WoodTypeId, number>;
  totalWoodEarned: number;
  upgrades: Record<UpgradeId, number>;
  ownedAxes: AxeId[];
  equippedAxeId: AxeId;
  unlockedTrees: TreeDefinitionId[];
  forest: ForestState;
  settings: PlayerSettings;
  stats: PlayerStats;
  lastSaveTimestamp: number;
  createdAt: number;
}

export interface GameState {
  player: PlayerState;
  activeTree: TreeInstance | null;
  queuedTrees: TreeInstance[];
  currentScreen: ScreenType;
  isPaused: boolean;
  lastUpdateTimestamp: number;
  sessionStartTime: number;
}

export type GameEventType =
  | 'tree:hit'
  | 'tree:killed'
  | 'tree:spawned'
  | 'wood:collected'
  | 'upgrade:purchased'
  | 'axe:unlocked'
  | 'axe:equipped'
  | 'forest:unlocked'
  | 'forest:collected'
  | 'settings:changed'
  | 'save:complete'
  | 'offline:gains';

export interface GameEvent {
  type: GameEventType;
  payload: unknown;
  timestamp: number;
}

export interface DamageResult {
  damage: number;
  isCrit: boolean;
  isDoubleWood: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  startY: number;
  alpha: number;
  scale: number;
  color: string;
  createdAt: number;
  duration: number;
  velocityY: number;
}

export interface SaveData {
  version: number;
  player: PlayerState;
  savedAt: number;
}

export interface AxeAnimationState {
  swingProgress: number;      // 0 = resting, 0-0.5 = forward swing, 0.5-1 = return
  isCritPending: boolean;     // Flash/glow on crit
  critFlashTime: number;      // How long crit flash lasts (ms)
}

export interface AxeVisualConfig {
  bladeColor: string;
  handleColor: string;
  bladeWidth: number;         // Multiplier (1.0 = base)
  bladeHeight: number;        // Multiplier (1.0 = base)
  bladeShape: 'wedge' | 'wide' | 'jagged' | 'ornate' | 'crystal';
  hasGlow: boolean;
  glowColor?: string;
  shineEffect: boolean;
}

export const SAVE_KEY = 'chop_it_save';
export const SAVE_VERSION = 1;

export const BASE_DAMAGE = 1.0;
export const BASE_CRIT_CHANCE = 0.05;
export const BASE_CRIT_DAMAGE = 2.0;
export const HOLD_TICK_RATE_MS = 100;
export const MIN_TAP_INTERVAL_MS = 50;
export const AUTOSAVE_INTERVAL_MS = 30000;
export const DEFAULT_MAX_OFFLINE_HOURS = 4;
export const FOREST_UNLOCK_WOOD = 5000;
export const FOREST_UNLOCK_UPGRADES = 10;
export const FOREST_UNLOCK_PLAYTIME_MS = 15 * 60 * 1000;

export const SWING_DURATION_MS = 150;
export const CRIT_FLASH_DURATION_MS = 200;
