# Lessons Learned

## 2026-02-28

### Canvas vs DOM Rendering
- Canvas provides consistent mobile performance
- Use hybrid approach: Canvas for game, DOM for UI
- DPR scaling essential for crisp rendering on mobile

### Input Handling
- Touch and mouse need unified handling
- Rate limiting prevents abuse (50ms tap, 100ms hold)
- Prevent default on touch events to avoid scrolling

### Save System
- Autosave every 30 seconds + on major actions
- Mark dirty flag to avoid unnecessary writes
- Version save data for future migrations

### Offline Gains
- Calculate on app start, not in background
- Cap at configurable max hours (default 4)
- Apply upgrades to offline rate
