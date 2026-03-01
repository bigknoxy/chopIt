# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-01

### Added

#### Procedural Axe Rendering System

Complete overhaul of axe visuals with a new procedural rendering system that draws axes dynamically on canvas instead of using static sprites. Each axe tier now has unique visual characteristics and special effects.

##### Axe Tiers and Visual Characteristics

| Tier | Axe Name | Blade Shape | Blade Color | Handle Color | Glow | Shine |
|------|----------|-------------|-------------|--------------|------|-------|
| 1 | Rusty Axe | Wedge | Copper (#B87333) | Brown (#8B4513) | No | No |
| 2 | Iron Axe | Wide | Slate (#708090) | Dark Brown (#654321) | No | No |
| 3 | Steel Axe | Jagged | Silver (#C0C0C0) | Dark Brown (#2F1810) | No | Yes |
| 4 | Gilded Axe | Ornate | Gold (#FFD700) | Dark Red (#8B0000) | Gold | Yes |
| 5 | Ancient Heart | Crystal | Purple (#9932CC) | Dark (#1a1a2e) | Purple | Yes |

##### Rendering Features

- **Dynamic Blade Shapes**: Five unique blade geometries (wedge, wide, jagged, ornate, crystal) rendered procedurally
- **Tier Scaling**: Axes scale 10% larger per tier for visual progression
- **Glow Effects**: Animated glow halos behind blades for legendary axes (Tier 4+)
- **Shine Effects**: Metallic shine highlights on refined axes (Tier 3+)
- **Swing Animations**: Smooth eased swing motion with forward arc and return
- **Crit Flash**: Visual feedback overlay for critical hit animations
- **Handle Details**: Procedural grip lines and handle wraps for depth

##### Implementation Details

- New `AxeRenderer` class in `src/ui/renderer/AxeRenderer.ts`
- Extended `AxeVisualConfig` interface with shape, color, and effect properties
- Integrated with existing `AxeAnimationState` for smooth animations
- Performance-optimized with color caching for dynamic color adjustments

## [1.0.0] - Initial Release

### Added

- Core game loop with 60 FPS rendering
- Tree chopping mechanics with tap-to-chop interaction
- Wood collection and resource management
- Tree type progression system
- Persistent upgrade tree
- Save/load system with localStorage
- PWA support for mobile installation
- Basic UI with resource displays
