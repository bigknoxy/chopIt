# Chop it like it's HAWT

A relaxing incremental idle mobile game where you chop trees to collect wood, unlock new tree types, and invest resources into a persistent upgrade tree. Features procedural axe rendering with 5 unique axe tiers, each with distinct visual styles and effects.

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── core/           # Game loop, state, events, persistence
├── data/           # Static config for trees, wood, upgrades, axes
├── systems/        # Game logic systems
├── ui/             # Rendering and screens
├── platform/       # Storage, audio, haptics adapters
└── utils/          # Helper functions
```

## Documentation

- [PRD](docs/PRD.md) - Product requirements
- [Technical Spec](docs/TECHNICAL_SPEC.md) - Implementation details

## License

MIT
