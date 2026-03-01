# Chop it like it's HAWT
## Technical Specification

**Version:** 1.0.0  
**Last Updated:** 2026-02-28  
**Status:** Production Ready

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Data Models](#4-data-models)
5. [Core Systems](#5-core-systems)
6. [Game Loop](#6-game-loop)
7. [Rendering Strategy](#7-rendering-strategy)
8. [Input Handling](#8-input-handling)
9. [Persistence Layer](#9-persistence-layer)
10. [Audio System](#10-audio-system)
11. [Performance Optimization](#11-performance-optimization)
12. [Testing Strategy](#12-testing-strategy)
13. [Build and Deployment](#13-build-and-deployment)

---

## 1. Architecture Overview

### 1.1 Design Philosophy

| Principle | Rationale |
|-----------|-----------|
| **Data-Driven** | All game content defined in config files |
| **Modular** | Systems are independent and testable |
| **Type-Safe** | TypeScript strict mode throughout |
| **Performant** | 60fps target, minimal allocations |
| **Offline-First** | Full functionality without network |

### 1.2 High-Level Architecture

```
PRESENTATION LAYER (UI Screens)
    └── Chop / Upgrades / Axes / Forest Screens
              │
              ▼
GAME SYSTEMS LAYER
    └── Chopping / Tree / Wood / Upgrade / Axe / Forest / Effect Systems
              │
              ▼
CORE LAYER
    └── GameLoop / StateManager / EventBus / SaveSystem
              │
              ▼
PLATFORM LAYER
    └── Storage / Audio / Haptics Adapters / Platform Detection
```

---

## 2. Technology Stack

### 2.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Vite | 5.x | Build tool, dev server |
| TypeScript | 5.x | Type safety, developer experience |
| HTML5 Canvas | - | Rendering |
| Web Audio API | - | Sound effects |
| Local Storage | - | Persistence |
| Service Worker | - | PWA, offline support |

### 2.2 Development Dependencies

| Package | Purpose |
|---------|---------|
| vite | Build tooling |
| typescript | Type system |
| @types/node | Node types |
| vite-plugin-pwa | PWA generation |
| workbox-window | Service worker management |

### 2.3 Rendering Choice: HTML5 Canvas

**Decision:** Canvas over DOM + CSS

**Rationale:**

| Factor | Canvas | DOM | Winner |
|--------|--------|-----|--------|
| Animation Performance | Excellent | Good | Canvas |
| Particle Effects | Easy | Difficult | Canvas |
| Bundle Size | Minimal | CSS overhead | Canvas |
| Mobile Performance | Consistent | Variable | Canvas |
| Hit Detection | Manual | Built-in | DOM |
| Text Rendering | Manual | Excellent | DOM |

**Hybrid Approach:** Canvas for game rendering, DOM for UI overlays (modals, menus)

---

## 3. Project Structure

```
chop-it-like-its-hawt/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── assets/
│       ├── sprites/
│       │   ├── trees/
│       │   ├── axes/
│       │   └── effects/
│       └── audio/
│           ├── chop.mp3
│           ├── crit.mp3
│           ├── fall.mp3
│           └── collect.mp3
├── src/
│   ├── main.ts
│   ├── game.ts
│   ├── core/
│   │   ├── GameLoop.ts
│   │   ├── StateManager.ts
│   │   ├── EventBus.ts
│   │   ├── SaveSystem.ts
│   │   └── types.ts
│   ├── data/
│   │   ├── woodTypes.ts
│   │   ├── treeTypes.ts
│   │   ├── upgrades.ts
│   │   ├── axes.ts
│   │   └── index.ts
│   ├── systems/
│   │   ├── ChoppingSystem.ts
│   │   ├── TreeSystem.ts
│   │   ├── WoodSystem.ts
│   │   ├── UpgradeSystem.ts
│   │   ├── AxeSystem.ts
│   │   ├── ForestSystem.ts
│   │   └── EffectSystem.ts
│   ├── ui/
│   │   ├── UIManager.ts
│   │   ├── screens/
│   │   │   ├── ChopScreen.ts
│   │   │   ├── UpgradeScreen.ts
│   │   │   ├── AxesScreen.ts
│   │   │   └── ForestScreen.ts
│   │   ├── components/
│   │   │   ├── TopBar.ts
│   │   │   ├── BottomNav.ts
│   │   │   ├── Modal.ts
│   │   │   └── Toast.ts
│   │   └── renderer/
│   │       ├── CanvasRenderer.ts
│   │       ├── TreeRenderer.ts
│   │       ├── EffectRenderer.ts
│   │       └── UIRenderer.ts
│   ├── platform/
│   │   ├── StorageAdapter.ts
│   │   ├── AudioAdapter.ts
│   │   ├── HapticsAdapter.ts
│   │   └── PlatformDetect.ts
│   └── utils/
│       ├── math.ts
│       ├── random.ts
│       ├── format.ts
│       └── constants.ts
├── docs/
│   ├── PRD.md
│   └── TECHNICAL_SPEC.md
└── tasks/
    ├── todo.md
    └── lessons.md
```

---

## 4. Data Models

### 4.1 Core Type Definitions

See `src/core/types.ts` for complete definitions. Key types:

```typescript
// Identifiers
type WoodTypeId = string;
type TreeDefinitionId = string;
type UpgradeId = string;
type AxeId = string;

// Enums
type WoodRarity = 'common' | 'rare' | 'epic' | 'legendary';
type UpgradeEffectType = 'strength' | 'axeSize' | 'luck' | 'autoChop' | 'idleGain' | 'critDamage' | 'woodGain' | 'offlineCap';
type AxeSpecialAbility = 'doubleWood' | 'splashDamage' | 'fastTick' | 'luckyStrike' | 'forestSpirit';

// Core Interfaces
interface WoodType { id, name, valueMultiplier, rarity, color }
interface TreeDefinition { id, name, maxHP, baseWoodYield, woodTypeId, spawnWeight, unlockCost, specialMechanic? }
interface TreeInstance { defId, currentHP, maxHP, x, y, scale, isActive, fallProgress }
interface UpgradeDefinition { id, name, description, effectType, effectPerLevel, maxLevel, baseCost, costGrowthFactor, prerequisites, icon }
interface AxeDefinition { id, name, tier, damageMultiplier, critBonus, specialAbility?, unlockCost, icon }
interface ForestState { isUnlocked, baseWoodPerSecond, lastTickTimestamp, accumulatedWood, maxOfflineHours }
interface PlayerState { wood, totalWoodEarned, upgrades, ownedAxes, equippedAxeId, unlockedTrees, forest, settings, stats, lastSaveTimestamp, createdAt }
interface GameState { player, activeTree, queuedTrees, currentScreen, isPaused, lastUpdateTimestamp, sessionStartTime }
```

### 4.2 Initial Content

**Wood Types (5):**
| ID | Name | Value | Rarity |
|----|------|-------|--------|
| basic | Pine Wood | 1.0x | Common |
| oak | Oak Wood | 2.5x | Common |
| maple | Maple Wood | 5.0x | Rare |
| amber | Amber Heart | 15.0x | Epic |
| ancient | Ancient Core | 50.0x | Legendary |

**Tree Types (7):**
| ID | Name | HP | Yield | Wood | Unlock |
|----|------|-----|-------|------|--------|
| pine_sapling | Pine Sapling | 50 | 5 | basic | 0 |
| pine_mature | Mature Pine | 150 | 12 | basic | 100 |
| oak_young | Young Oak | 300 | 15 | oak | 500 |
| oak_ancient | Ancient Oak | 800 | 40 | oak | 2000 |
| maple_golden | Golden Maple | 500 | 25 | maple | 5000 |
| amber_tree | Amber Tree | 1500 | 30 | amber | 20000 |
| world_tree | World Tree | 5000 | 100 | ancient | 100000 |

**Upgrades (8):**
| ID | Name | Effect | Base Cost | Growth | Max |
|----|------|--------|-----------|--------|-----|
| strength | Lumberjack Strength | +10% damage | 50 | 1.5 | 50 |
| axe_size | Bigger Axe | +5% hitbox | 100 | 1.4 | 20 |
| luck | Lucky Chops | +2% crit | 200 | 1.6 | 30 |
| crit_damage | Crushing Blows | +0.2x crit dmg | 300 | 1.7 | 25 |
| wood_gain | Efficient Logging | +5% wood | 150 | 1.5 | 40 |
| auto_chop | Auto Chopper | +1 DPS | 1000 | 1.8 | 100 |
| idle_gain | Forest Growth | +5% idle | 2000 | 1.6 | 50 |
| offline_cap | Extended Harvest | +30min offline | 5000 | 2.0 | 10 |

**Axes (5):**
| ID | Name | Tier | Damage | Crit | Special |
|----|------|------|--------|------|---------|
| rusty_axe | Rusty Axe | 1 | 1.0x | 0% | - |
| iron_axe | Iron Axe | 2 | 1.5x | 3% | - |
| steel_axe | Steel Axe | 3 | 2.5x | 5% | - |
| gilded_axe | Gilded Axe | 4 | 4.0x | 8% | doubleWood |
| ancient_axe | Ancient Heart | 5 | 6.0x | 12% | forestSpirit |

---

## 5. Core Systems

### 5.1 ChoppingSystem

Handles damage calculation, crits, and tree hits.

```typescript
class ChoppingSystem {
  calculateDamage(state: GameState, isHold: boolean): DamageResult
  applyDamage(tree: TreeInstance, damage: DamageResult): void
  checkTreeDeath(tree: TreeInstance): boolean
  calculateWoodReward(tree: TreeInstance, state: GameState): number
}
```

**Damage Formula:**
```
damage = baseDamage * (1 + strengthLevel * 0.1) * axeDamageMultiplier * critMultiplier
critChance = 0.05 + luckLevel * 0.02 + axeCritBonus
```

**Rate Limiting:**
- Min tap interval: 50ms
- Hold tick rate: 100ms (or 80ms with fastTick ability)

### 5.2 TreeSystem

Manages tree spawning, state, and transitions.

```typescript
class TreeSystem {
  spawnTree(availableTrees: TreeDefinitionId[]): TreeInstance
  selectTreeType(available: TreeDefinitionId[]): TreeDefinitionId
  updateTree(tree: TreeInstance, deltaTime: number): void
  startFallAnimation(tree: TreeInstance): void
}
```

### 5.3 UpgradeSystem

Handles upgrade purchases, costs, and effect application.

```typescript
class UpgradeSystem {
  getUpgradeCost(upgrade: UpgradeDefinition, currentLevel: number): number
  canPurchase(upgradeId: string, state: GameState): boolean
  purchaseUpgrade(upgradeId: string, state: GameState): GameState
  getEffectValue(effectType: string, state: GameState): number
}
```

**Cost Formula:**
```
cost = floor(baseCost * costGrowthFactor ^ level)
```

### 5.4 AxeSystem

Manages axe unlocking, equipping, and abilities.

```typescript
class AxeSystem {
  canUnlock(axeId: string, state: GameState): boolean
  unlockAxe(axeId: string, state: GameState): GameState
  equipAxe(axeId: string, state: GameState): GameState
  getAxeStats(axeId: string, state: GameState): AxeStats
}
```

### 5.5 ForestSystem

Handles idle income and offline gains.

```typescript
class ForestSystem {
  checkUnlock(state: GameState): boolean
  calculateWPS(state: GameState): number
  calculateOfflineGains(state: GameState, elapsedMs: number): number
  collectOfflineGains(state: GameState): GameState
}
```

**Forest Unlock:**
- Total wood earned >= 5,000 OR
- Total upgrades >= 10 OR
- Play time >= 15 minutes

**Offline Calculation:**
```
maxOfflineMs = (4 + offlineCapLevel * 0.5) * 3600 * 1000
elapsedMs = min(now - lastTickTimestamp, maxOfflineMs)
woodGained = floor(elapsedMs / 1000 * WPS)
```

---

## 6. Game Loop

### 6.1 Update Flow

```
UPDATE (Fixed Timestep - 16.67ms):
1. Process Input
   └── Handle tap/hold state from InputManager

2. Update Systems
   ├── ChoppingSystem.update(deltaTime)
   │   └── Apply damage if holding/auto-chop
   ├── TreeSystem.update(deltaTime)
   │   └── Spawn new trees, update animations
   ├── ForestSystem.update(deltaTime)
   │   └── Accumulate idle wood
   └── EffectSystem.update(deltaTime)
       └── Update floating numbers, particles

3. Check State
   ├── Tree killed? → spawn new, collect wood
   ├── Forest unlock? → check conditions
   └── Autosave? → every 30 seconds
```

### 6.2 Render Flow

```
RENDER (requestAnimationFrame):
1. Clear Canvas

2. Render Game Layer
   ├── Background (gradient or pattern)
   ├── Active Tree (with shake/fall animation)
   ├── Effects (damage numbers, particles)
   └── UI Overlays (HP bar, wood counter)

3. Render DOM Layer (if needed)
   └── Modals, menus, settings
```

---

## 7. Rendering Strategy

### 7.1 Canvas Setup

```typescript
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

// Set canvas size with DPR
canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
```

### 7.2 Layer Order

1. **Background Layer** - Static/animated background
2. **Tree Layer** - Active tree rendering
3. **Effect Layer** - Floating text, particles
4. **UI Layer** - HP bars, counters

### 7.3 Animation System

```typescript
interface Animation {
  id: string;
  type: 'shake' | 'fall' | 'float' | 'particle';
  startTime: number;
  duration: number;
  from: { x, y, rotation, alpha };
  to: { x, y, rotation, alpha };
  easing: (t: number) => number;
}
```

---

## 8. Input Handling

### 8.1 InputManager

```typescript
class InputManager {
  // Events
  onTap: (x: number, y: number) => void
  onHoldStart: (x: number, y: number) => void
  onHoldEnd: () => void
  
  // State
  isPressed: boolean
  holdDuration: number
  lastTapTime: number
}
```

### 8.2 Rate Limiting

| Input | Limit | Purpose |
|-------|-------|---------|
| Tap | 50ms minimum interval | Prevent rapid-fire |
| Hold | 100ms tick rate | Smooth feedback |
| Double-tap | 300ms threshold | Detect quick succession |

### 8.3 Touch vs Mouse

- Touch: touchstart/touchmove/touchend
- Mouse: mousedown/mousemove/mouseup
- Unified: Map to common InputManager callbacks

---

## 9. Persistence Layer

### 9.1 Save Data Structure

```typescript
interface SaveData {
  version: number;
  player: PlayerState;
  savedAt: number;
}
```

### 9.2 Storage Strategy

| Storage | Purpose |
|---------|---------|
| localStorage | Primary persistence |
| IndexedDB | Future: larger saves, cloud sync |

### 9.3 Autosave Triggers

- Upgrade purchase
- Axe unlock/equip
- Tree unlock
- Forest unlock
- Settings change
- Periodic: every 30 seconds
- App blur/hide event

### 9.4 Migration Strategy

```typescript
function migrate(oldData: SaveData, fromVersion: number): SaveData {
  switch (fromVersion) {
    case 1: // Current version
      return oldData;
    default:
      return createDefaultSave();
  }
}
```

---

## 10. Audio System

### 10.1 Sound Effects

| Event | Sound | Volume | Preload |
|-------|-------|--------|---------|
| chop | chop.mp3 | 60% | Yes |
| crit | crit.mp3 | 80% | Yes |
| tree_fall | fall.mp3 | 70% | Yes |
| collect | collect.mp3 | 50% | Yes |
| upgrade | upgrade.mp3 | 60% | Yes |
| equip | equip.mp3 | 50% | Yes |

### 10.2 AudioAdapter

```typescript
class AudioAdapter {
  async load(): Promise<void>
  play(soundId: string, volume?: number): void
  setMasterVolume(volume: number): void
  mute(): void
  unmute(): void
}
```

### 10.3 HapticsAdapter

```typescript
class HapticsAdapter {
  light(): void    // Chop hit
  medium(): void   // Crit, tree fall
  success(): void  // Upgrade purchase
}
```

---

## 11. Performance Optimization

### 11.1 Render Optimization

| Technique | Implementation |
|-----------|----------------|
| Fixed Timestep | Consistent 60fps updates |
| Object Pooling | Reuse damage number objects |
| Dirty Tracking | Only render changed elements |
| Layer Caching | Cache static background |

### 11.2 Memory Management

- Pool floating text objects
- Limit particle count (max 50)
- Clear finished animations
- Debounce autosave writes

### 11.3 Bundle Size Targets

| Asset | Target Size |
|-------|-------------|
| JS (minified) | < 500KB |
| CSS | < 50KB |
| Audio (total) | < 200KB |
| Images | < 1MB |
| **Total** | **< 3MB** |

---

## 12. Testing Strategy

### 12.1 Unit Tests

| System | Test Focus |
|--------|------------|
| ChoppingSystem | Damage calc, crits, rate limiting |
| UpgradeSystem | Costs, prerequisites, effects |
| AxeSystem | Unlock costs, abilities |
| ForestSystem | WPS calc, offline gains |
| SaveSystem | Load, save, migration |

### 12.2 Integration Tests

- Full game loop cycle
- Offline gain calculation
- Upgrade progression path
- Axe unlock and equip flow

### 12.3 E2E Tests (Playwright)

- First tree kill
- First upgrade purchase
- Forest unlock
- Settings persistence
- PWA installation

---

## 13. Build and Deployment

### 13.1 Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run test     # Run tests
npm run lint     # Lint check
```

### 13.2 Vite Configuration

```typescript
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: { /* PWA manifest */ },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}']
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'game-systems': ['src/systems/*.ts'],
          'core': ['src/core/*.ts']
        }
      }
    }
  }
});
```

### 13.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Appendix: Key Constants

```typescript
const BASE_DAMAGE = 1.0;
const BASE_CRIT_CHANCE = 0.05;
const BASE_CRIT_DAMAGE = 2.0;
const HOLD_TICK_RATE_MS = 100;
const MIN_TAP_INTERVAL_MS = 50;
const AUTOSAVE_INTERVAL_MS = 30000;
const MAX_OFFLINE_HOURS = 4;
const FOREST_UNLOCK_WOOD = 5000;
const SAVE_VERSION = 1;
```

---

**Document End**
