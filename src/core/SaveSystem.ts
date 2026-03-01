import {
  SaveData,
  PlayerState,
  SAVE_KEY,
  SAVE_VERSION
} from './types';
import { EventBus } from './EventBus';

const AUTOSAVE_INTERVAL = 30000;

export class SaveSystem {
  private eventBus: EventBus;
  private autosaveTimer: number | null = null;
  private isDirty: boolean = false;
  private getSaveData: () => PlayerState;

  constructor(eventBus: EventBus, getSaveData: () => PlayerState) {
    this.eventBus = eventBus;
    this.getSaveData = getSaveData;
  }

  async load(): Promise<PlayerState | null> {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;

      const data: SaveData = JSON.parse(raw);
      
      if (data.version !== SAVE_VERSION) {
        return this.migrate(data);
      }

      return data.player;
    } catch (error) {
      console.error('Failed to load save:', error);
      return null;
    }
  }

  save(player: PlayerState): void {
    try {
      const saveData: SaveData = {
        version: SAVE_VERSION,
        player: player,
        savedAt: Date.now()
      };
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
      this.eventBus.emit('save:complete', { timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to save:', error);
    }
  }

  markDirty(): void {
    this.isDirty = true;
  }

  startAutosave(): void {
    this.stopAutosave();
    this.autosaveTimer = window.setInterval(() => {
      if (this.isDirty) {
        this.save(this.getSaveData());
        this.isDirty = false;
      }
    }, AUTOSAVE_INTERVAL);
  }

  stopAutosave(): void {
    if (this.autosaveTimer) {
      clearInterval(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }

  reset(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (error) {
      console.error('Failed to reset save:', error);
    }
  }

  private migrate(oldData: SaveData): PlayerState | null {
    switch (oldData.version) {
      case 1:
        return oldData.player;
      default:
        console.warn('Unknown save version, starting fresh');
        return null;
    }
  }
}
