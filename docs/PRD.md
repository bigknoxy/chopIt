# Chop it like it's HAWT
## Product Requirements Document (PRD)

**Version:** 1.0.0  
**Last Updated:** 2026-02-28  
**Author:** Game Design Team  
**Status:** Production Ready

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Game Overview](#2-game-overview)
3. [Target Audience](#3-target-audience)
4. [Platforms and Technology](#4-platforms-and-technology)
5. [Core Game Loop](#5-core-game-loop)
6. [Game Systems](#6-game-systems)
7. [Progression and Balancing](#7-progression-and-balancing)
8. [UX and UI Design](#8-ux-and-ui-design)
9. [Audio and Haptics](#9-audio-and-haptics)
10. [Monetization Strategy](#10-monetization-strategy)
11. [Analytics and KPIs](#11-analytics-and-kpis)
12. [Roadmap](#12-roadmap)

---

## 1. Executive Summary

**Chop it like it's HAWT** is a relaxing incremental idle mobile game where players chop trees to collect wood, unlock new tree types, and invest resources into a persistent upgrade tree to become a more powerful lumberjack.

### Key Value Propositions
- **Instant Satisfaction**: First tree falls within 2-5 seconds; first upgrade within 20-40 seconds
- **Deep Progression**: Hours of incremental gameplay through upgrades, new woods, and axes
- **Mobile-First**: Portrait orientation, thumb-friendly, PWA-ready
- **Idle-Friendly**: Offline progress through the Forest system

### Success Metrics
- Day 1 Retention: >40%
- Day 7 Retention: >15%
- Average Session Length: 8-12 minutes
- Sessions per Day: 3-5

---

## 2. Game Overview

### 2.1 Core Concept

Players tap or hold on trees to chop them down, collecting wood as currency. Wood is spent on permanent upgrades, new axes, and unlocking additional content. The Forest system provides idle income, rewarding both active play and return visits.

### 2.2 Game Feel

| Attribute | Description |
|-----------|-------------|
| **Pace** | Fast to understand, satisfying in the first 30 seconds |
| **Depth** | Rich enough to support hours of idle/progression play |
| **Controls** | Single-finger tap/hold - thumb-friendly |
| **Feedback** | Immediate visual and audio response to every action |
| **Tone** | Relaxing yet engaging; casual progression |

### 2.3 Pillars

1. **Accessibility**: Anyone can start playing in under 10 seconds
2. **Progression**: Clear, tangible growth with every action
3. **Collection**: Unlock new trees, woods, and axes
4. **Idle Reward**: Progress continues while away

---

## 3. Target Audience

### Primary Audience
- **Age**: 18-35
- **Gender**: All
- **Behavior**: Casual mobile gamers, incremental game fans
- **Play Context**: Short sessions (2-5 min), multiple times per day
- **Platforms**: Primarily mobile web/PWA users

### Secondary Audience
- Incremental/idle game enthusiasts
- Collection-focused players
- Offline-capable game seekers

### Player Personas

#### Persona 1: "Casual Chris"
- Plays in short bursts during commutes or breaks
- Wants instant gratification
- Prefers simple, satisfying interactions
- Returns for daily rewards and progression

#### Persona 2: "Idle Irene"
- Enjoys setting up passive income systems
- Checks in periodically to collect and upgrade
- Values offline progress
- Optimizes for efficiency

---

## 4. Platforms and Technology

### 4.1 Target Platforms

| Platform | Priority | Notes |
|----------|----------|-------|
| Mobile Web (PWA) | Primary | Portrait, responsive |
| Android (Webview) | Secondary | Via Capacitor |
| iOS (Webview) | Secondary | Via Capacitor |

### 4.2 Technical Requirements

| Requirement | Target |
|-------------|--------|
| Initial Bundle Size | < 3MB |
| Load Time (3G) | < 3 seconds |
| Frame Rate | 60fps on mid-range devices |
| Offline Support | Full gameplay without network |
| Storage | Local storage (~1MB max) |

### 4.3 Orientation
- **Portrait Only**: Locked to vertical orientation
- **Aspect Ratio Support**: 9:16 to 9:19.5 (iPhone to modern tall screens)

---

## 5. Core Game Loop

### 5.1 Primary Loop

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌───────┐ │
│   │   TAP    │───>│  CHOP    │───>│  COLLECT │───>│ SPEND │ │
│   │  TREE    │    │  DAMAGE  │    │   WOOD   │    │ WOOD  │ │
│   └──────────┘    └──────────┘    └──────────┘    └───────┘ │
│        │                                               │     │
│        │                                               │     │
│        │              ┌──────────┐                     │     │
│        └──────────────│ UPGRADE  │<────────────────────┘     │
│                       │  POWER   │                           │
│                       └──────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Loop Timing (Early Game)

| Action | Duration | Feedback |
|--------|----------|----------|
| Tree Death | 2-5 seconds | HP bar drain, shake, fall animation |
| Wood Collection | Instant | Floating text, counter update |
| First Upgrade | 20-40 seconds | Unlock notification, power spike feel |
| New Tree Type | ~2-3 minutes | Visual variety, better rewards |

### 5.3 Secondary Loop (Forest/Idle)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│   │  FOREST  │───>│  GENERATE│───>│  COLLECT │             │
│   │  UNLOCK  │    │   WOOD   │    │  OFFLINE │             │
│   └──────────┘    └──────────┘    └──────────┘             │
│        │                                               │     │
│        │                                               │     │
│        │              ┌──────────┐                     │     │
│        └──────────────│ UPGRADE  │<────────────────────┘     │
│                       │  FOREST  │                           │
│                       └──────────┘                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Game Systems

### 6.1 Trees and Wood Types

#### 6.1.1 Tree Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `maxHP` | number | Maximum health points |
| `baseWoodYield` | number | Base wood dropped on death |
| `woodTypeId` | string | Type of wood dropped |
| `spawnWeight` | number | Relative spawn probability |
| `specialMechanic` | string? | Optional special behavior |

#### 6.1.2 Wood Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `valueMultiplier` | number | Value relative to basic wood |
| `rarity` | enum | common, rare, epic, legendary |
| `color` | string | Hex color for UI |

#### 6.1.3 Initial Content

**Wood Types:**

| ID | Name | Value | Rarity | Color |
|----|------|-------|--------|-------|
| `basic` | Pine Wood | 1.0x | Common | #8B7355 |
| `oak` | Oak Wood | 2.5x | Common | #6B4423 |
| `maple` | Maple Wood | 5.0x | Rare | #D2691E |
| `amber` | Amber Heart | 15.0x | Epic | #FFBF00 |
| `ancient` | Ancient Core | 50.0x | Legendary | #9400D3 |

**Tree Types:**

| ID | Name | HP | Yield | Wood | Weight | Unlock |
|----|------|-----|-------|------|--------|--------|
| `pine_sapling` | Pine Sapling | 50 | 5 | basic | 100 | Default |
| `pine_mature` | Mature Pine | 150 | 12 | basic | 80 | 100 wood |
| `oak_young` | Young Oak | 300 | 15 | oak | 60 | 500 wood |
| `oak_ancient` | Ancient Oak | 800 | 40 | oak | 40 | 2,000 wood |
| `maple_golden` | Golden Maple | 500 | 25 | maple | 30 | 5,000 wood |
| `amber_tree` | Amber Tree | 1500 | 30 | amber | 15 | 20,000 wood |
| `world_tree` | World Tree | 5000 | 100 | ancient | 5 | 100,000 wood |

### 6.2 Chopping Mechanics

#### 6.2.1 Input Model

| Input | Behavior |
|-------|----------|
| **Tap** | Single damage hit |
| **Hold** | Continuous damage ticks (100ms interval) |

#### 6.2.2 Damage Formula

```
damage = baseDamage × strengthMultiplier × axePowerModifier × critMultiplier
```

| Component | Source |
|-----------|--------|
| `baseDamage` | Constant (1.0) |
| `strengthMultiplier` | Upgrades (1.0 + 0.1 × strengthLevel) |
| `axePowerModifier` | Equipped axe (1.0 to 5.0+) |
| `critMultiplier` | Random roll against critChance (1.0 or 2.0+) |

#### 6.2.3 Crit System

```
critChance = baseCritChance + luckBonus + axeCritBonus
critDamage = baseCritDamage + critDamageBonus
```

| Stat | Base | Max |
|------|------|-----|
| Crit Chance | 5% | 75% |
| Crit Damage | 2.0x | 10.0x |

#### 6.2.4 Rate Limiting

| Limit | Value | Purpose |
|-------|-------|---------|
| Min Tap Interval | 50ms | Prevent rapid-fire abuse |
| Max DPS Cap | 1000 (early) | Maintain progression pacing |
| Hold Tick Rate | 100ms | Smooth hold feedback |

#### 6.2.5 Reward Calculation

```
woodGain = floor(baseWoodYield × (1 + woodGainBonus) × woodType.valueMultiplier)
```

### 6.3 Upgrade System

#### 6.3.1 Upgrade Structure

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `description` | string | Player-facing description |
| `effectType` | enum | Type of bonus applied |
| `effectPerLevel` | number | Bonus gained per level |
| `level` | number | Current level |
| `maxLevel` | number | Maximum level (0 = unlimited) |
| `baseCost` | number | Initial upgrade cost |
| `costGrowthFactor` | number | Cost multiplier per level |
| `prerequisites` | array | Required upgrades |

#### 6.3.2 Effect Types

| Type | Effect | Stack Type |
|------|--------|------------|
| `strength` | +10% damage per level | Additive |
| `axeSize` | +5% hitbox size | Additive |
| `luck` | +2% crit chance, +1% rare wood | Additive |
| `autoChop` | +1 passive DPS | Additive |
| `idleGain` | +5% forest income | Multiplicative |
| `critDamage` | +0.2x crit multiplier | Additive |
| `woodGain` | +5% wood yield | Additive |
| `offlineCap` | +30 min max offline time | Additive |

#### 6.3.3 Cost Formula

```
cost = floor(baseCost × costGrowthFactor ^ level)
```

#### 6.3.4 Initial Upgrades

| ID | Name | Effect | Per Level | Base Cost | Growth | Max |
|----|------|--------|-----------|-----------|--------|-----|
| `strength` | Lumberjack Strength | +10% damage | 0.1 | 50 | 1.5 | 50 |
| `axe_size` | Bigger Axe | +5% hitbox | 0.05 | 100 | 1.4 | 20 |
| `luck` | Lucky Chops | +2% crit, +1% rare | 0.02/0.01 | 200 | 1.6 | 30 |
| `crit_damage` | Crushing Blows | +0.2x crit dmg | 0.2 | 300 | 1.7 | 25 |
| `wood_gain` | Efficient Logging | +5% wood | 0.05 | 150 | 1.5 | 40 |
| `auto_chop` | Auto Chopper | +1 DPS | 1.0 | 1000 | 1.8 | 100 |
| `idle_gain` | Forest Growth | +5% idle | 0.05 | 2000 | 1.6 | 50 |
| `offline_cap` | Extended Harvest | +30min offline | 30 | 5000 | 2.0 | 10 |

### 6.4 Axes and Equipment

#### 6.4.1 Axe Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | string | Unique identifier |
| `name` | string | Display name |
| `tier` | number | Power tier (1-5) |
| `damageMultiplier` | number | Damage multiplier |
| `critBonus` | number? | Additional crit chance |
| `specialAbility` | string? | Unique ability |
| `unlockCost` | array | Cost per wood type |

#### 6.4.2 Special Abilities

| Ability | Effect |
|---------|--------|
| `doubleWood` | 15% chance for 2x wood |
| `splashDamage` | 25% damage to next tree |
| `fastTick` | 80ms hold tick rate |
| `luckyStrike` | +10% crit damage on crit |
| `forestSpirit` | +20% forest income while equipped |

#### 6.4.3 Initial Axes

| ID | Name | Tier | Damage | Crit | Special | Cost |
|----|------|------|--------|------|---------|------|
| `rusty_axe` | Rusty Axe | 1 | 1.0x | - | - | Free |
| `iron_axe` | Iron Axe | 2 | 1.5x | +3% | - | 500 basic |
| `steel_axe` | Steel Axe | 3 | 2.5x | +5% | - | 2000 basic, 50 oak |
| `gilded_axe` | Gilded Axe | 4 | 4.0x | +8% | doubleWood | 5000 basic, 200 oak, 30 maple |
| `ancient_axe` | Ancient Heart | 5 | 6.0x | +12% | forestSpirit | 10000 oak, 100 maple, 20 amber |

### 6.5 Forest / Idle System

#### 6.5.1 Unlock Requirements

| Requirement | Value |
|-------------|-------|
| Total Wood Earned | 5,000 |
| OR Upgrades Purchased | 10 |
| OR Play Time | 15 minutes |

#### 6.5.2 Forest Mechanics

```
woodPerSecond = baseWoodPerSecond × (1 + idleGainMultiplier) × (1 + axeForestBonus)
```

| Parameter | Base | Max |
|-----------|------|-----|
| Base WPS | 0.5 | - |
| Max Offline Duration | 4 hours | 12 hours (upgrades) |
| Max Offline Gain | 4hr × WPS | Cap × WPS |

#### 6.5.3 Offline Calculation

```typescript
function calculateOfflineGains(forest: ForestState, now: number): number {
  const elapsed = Math.min(
    now - forest.lastTickTimestamp,
    forest.maxOfflineDuration * 1000
  );
  const seconds = elapsed / 1000;
  return Math.floor(seconds * forest.effectiveWoodPerSecond);
}
```

---

## 7. Progression and Balancing

### 7.1 Early Game Targets (0-5 minutes)

| Milestone | Target | Reward |
|-----------|--------|--------|
| First Tree Death | 2-5 seconds | First wood, satisfaction |
| First Upgrade | 20-40 seconds | Power spike feel |
| Third Tree | 60-90 seconds | Pattern recognition |
| Oak Unlock | 2-3 minutes | New wood type |
| Fifth Upgrade | 3-4 minutes | Clear progression |
| Forest Unlock | 10-15 minutes | Idle system access |

### 7.2 Mid Game Targets (5-30 minutes)

| Milestone | Target | Reward |
|-----------|--------|--------|
| Maple Trees | 10 minutes | Rare wood |
| First Special Axe | 15-20 minutes | Gameplay variety |
| Auto-Chop Online | 20-25 minutes | Passive chopping |
| Amber Trees | 25-30 minutes | Epic wood |

### 7.3 Late Game Targets (30+ minutes)

| Milestone | Target | Reward |
|-----------|--------|--------|
| World Tree | 1+ hour | Legendary wood |
| Ancient Axe | 2+ hours | Max power |
| All Upgrades Maxed | 5+ hours | Completion |

### 7.4 Economy Balance

#### 7.4.1 Upgrade Cost Curve

```
totalCostForLevel(n) = baseCost × (growthFactor^n - 1) / (growthFactor - 1)
```

#### 7.4.2 Wood Value Scale

```
effectiveValue = woodAmount × valueMultiplier
```

All costs calculated in "effective basic wood" for comparison.

#### 7.4.3 Power Curve

| Stage | Total Wood | DPS | Trees Unlocked |
|-------|------------|-----|----------------|
| Start | 0 | 10 | 1 |
| Early | 1,000 | 50 | 3 |
| Mid | 50,000 | 500 | 5 |
| Late | 500,000 | 5,000 | 7 |

---

## 8. UX and UI Design

### 8.1 Layout Structure (Portrait)

```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────────┐│
│  │  TOP BAR (HUD)                  ││
│  │  Wood Counter | Axe Info        ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │                                 ││
│  │      MAIN CHOPPING AREA         ││
│  │      (Tree Display + Effects)   ││
│  │                                 ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  BOTTOM NAVIGATION              ││
│  │  [Chop] [Upgrade] [Axes] [Forest]││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### 8.2 Screen Specifications

#### 8.2.1 Chop Screen (Main)

**Top Bar:**
- Total basic wood count (large, center)
- Special wood indicators (smaller, right)
- Equipped axe name + damage stat (left)

**Main Area:**
- Active tree (center, 60% height)
- HP bar above tree
- Floating damage numbers on hit
- Tree shake animation on chop
- Fall animation on death

**Bottom Nav:**
- 4 icon tabs with labels
- Active tab highlighted
- Safe area padding (for gesture navigation)

#### 8.2.2 Upgrades Screen

**Layout:**
- Scrollable list of upgrade cards
- Each card: name, description, current effect, cost
- Buy button (disabled if insufficient wood)
- Progress bar for max level upgrades
- Prerequisite indicators

**Filtering:**
- All / Available / Maxed tabs

#### 8.2.3 Axes Screen

**Layout:**
- Grid of axe cards (2 columns)
- Each card: icon, name, stats, special ability
- Equipped indicator
- Cost display for locked axes
- Buy/Equip button

**Details Modal:**
- Full stats breakdown
- Special ability description
- Material requirements

#### 8.2.4 Forest Screen

**Layout:**
- Current WPS display (large)
- Offline gains collector (when applicable)
- Forest upgrade cards
- Time until max capacity indicator
- Collect all button

**Offline Collection Modal:**
- "While you were away..."
- Total wood earned
- Time elapsed
- Collect button

### 8.3 Responsive Design

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Small | < 360px | Smaller fonts, compact cards |
| Medium | 360-414px | Standard layout |
| Large | > 414px | Larger tap targets, more spacing |

### 8.4 Accessibility

| Feature | Implementation |
|---------|---------------|
| High Contrast Mode | Toggle in settings |
| Large Tap Targets | Minimum 48x48px |
| Reduced Motion | Disable animations toggle |
| Screen Reader | ARIA labels on all interactive elements |
| Color Blindness | Use patterns/icons beyond color |

---

## 9. Audio and Haptics

### 9.1 Sound Effects

| Event | Sound | Volume |
|-------|-------|--------|
| Chop Hit | Short thud | 60% |
| Crit Chop | Emphasized thud | 80% |
| Tree Fall | Crash/rustle | 70% |
| Wood Collect | Coin chime | 50% |
| Upgrade Purchase | Success chime | 60% |
| Axe Equip | Metal ring | 50% |
| Button Tap | Soft click | 30% |

### 9.2 Music

- Optional ambient forest sounds
- Volume slider independent of SFX
- Default: Off (for mobile-friendly defaults)

### 9.3 Haptics

| Event | Pattern | Toggle |
|-------|---------|--------|
| Chop Hit | Light tap | Optional |
| Crit Chop | Medium double-tap | Optional |
| Tree Fall | Medium rumble | Optional |
| Upgrade Purchase | Success pulse | Optional |

---

## 10. Monetization Strategy

### 10.1 Monetization Model

**Free-to-Play with Optional Ads**

| Type | Reward | Frequency |
|------|--------|-----------|
| Rewarded Video | 2x offline gains (one-time) | Per offline collection |
| Rewarded Video | 2x wood for 5 minutes | Cooldown: 30 minutes |
| Interstitial | None | Never (F2P friendly) |

### 10.2 Premium Features (Future)

| Feature | Price | Benefit |
|---------|-------|---------|
| Ad-Free Pass | $2.99 | Remove all ads |
| Golden Axe Pack | $4.99 | Exclusive cosmetic axe |
| Wood Doubler | $1.99 | Permanent 1.5x wood |

### 10.3 Design Principles

- No pay-to-win mechanics
- All content unlockable through play
- Ads always optional (rewarded only)
- No energy systems or timers

---

## 11. Analytics and KPIs

### 11.1 Key Performance Indicators

| KPI | Target | Measurement |
|-----|--------|-------------|
| DAU/MAU | > 20% | Daily active / Monthly active |
| Day 1 Retention | > 40% | Return within 24 hours |
| Day 7 Retention | > 15% | Return within 7 days |
| Day 30 Retention | > 5% | Return within 30 days |
| Avg Session Length | 8-12 min | Time per session |
| Sessions per User/Day | 3-5 | Frequency |
| ARPU | $0.10+ | Average revenue per user |
| Conversion Rate | > 2% | Ad watch rate |

### 11.2 Events to Track

| Event | Parameters |
|-------|------------|
| `tree_chopped` | treeId, woodGained, timeToChop |
| `upgrade_purchased` | upgradeId, level, cost |
| `axe_unlocked` | axeId, totalWood |
| `forest_unlocked` | totalWood, playTime |
| `offline_collected` | woodGained, timeAway |
| `ad_watched` | adType, reward |
| `session_start` | newVsReturning |
| `session_end` | sessionLength, screensVisited |

---

## 12. Roadmap

### Phase 1: MVP (Week 1-2)
- [ ] Core game loop
- [ ] Basic chopping
- [ ] 3 tree types, 3 wood types
- [ ] 5 upgrades
- [ ] 2 axes
- [ ] Basic UI

### Phase 2: Core Features (Week 3-4)
- [ ] Forest/idle system
- [ ] All initial content
- [ ] Persistence
- [ ] Polish and juice

### Phase 3: Launch Prep (Week 5-6)
- [ ] Audio system
- [ ] Haptics
- [ ] Analytics
- [ ] PWA optimization
- [ ] Testing and balance

### Phase 4: Post-Launch (Week 7+)
- [ ] New tree types
- [ ] Special abilities
- [ ] Achievements
- [ ] Leaderboards
- [ ] Cloud save

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Chop** | Primary action of tapping/holding a tree |
| **HP** | Health Points - tree durability |
| **DPS** | Damage Per Second |
| **WPS** | Wood Per Second (Forest income) |
| **Crit** | Critical hit - bonus damage |
| **Idle** | Passive income system |
| **PWA** | Progressive Web App |
| **Juice** | Satisfying visual/audio feedback |

---

## Appendix B: References

- Vite Documentation: https://vitejs.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Capacitor: https://capacitorjs.com/
- PWA Best Practices: https://web.dev/pwa/

---

**Document End**
