import { GameEvent, GameEventType } from './types';

type EventCallback = (event: GameEvent) => void;

export class EventBus {
  private listeners: Map<GameEventType, Set<EventCallback>> = new Map();

  on(eventType: GameEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  emit(eventType: GameEventType, payload: unknown): void {
    const event: GameEvent = {
      type: eventType,
      payload,
      timestamp: Date.now()
    };

    this.listeners.get(eventType)?.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    });
  }

  clear(): void {
    this.listeners.clear();
  }
}
