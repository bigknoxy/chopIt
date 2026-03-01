import { FloatingText } from '../core/types';

export class EffectSystem {
  private floatingTexts: Map<string, FloatingText> = new Map();
  private textIdCounter: number = 0;
  private readonly TEXT_DURATION = 1000;
  private readonly TEXT_VELOCITY = -50;

  createDamageText(x: number, y: number, damage: number, isCrit: boolean): FloatingText {
    const id = `dmg_${++this.textIdCounter}`;
    const text: FloatingText = {
      id,
      text: isCrit ? `💥${damage}` : `${damage}`,
      x,
      y,
      startY: y,
      alpha: 1,
      scale: isCrit ? 1.5 : 1,
      color: isCrit ? '#FFD700' : '#FFFFFF',
      createdAt: Date.now(),
      duration: this.TEXT_DURATION,
      velocityY: this.TEXT_VELOCITY
    };
    
    this.floatingTexts.set(id, text);
    return text;
  }

  createWoodText(x: number, y: number, amount: number, _woodType: string): FloatingText {
    const id = `wood_${++this.textIdCounter}`;
    const text: FloatingText = {
      id,
      text: `+${amount} 🪵`,
      x,
      y,
      startY: y,
      alpha: 1,
      scale: 1.2,
      color: '#90EE90',
      createdAt: Date.now(),
      duration: this.TEXT_DURATION * 1.5,
      velocityY: this.TEXT_VELOCITY * 0.5
    };
    
    this.floatingTexts.set(id, text);
    return text;
  }

  update(_deltaTime: number): void {
    const now = Date.now();
    const toRemove: string[] = [];

    this.floatingTexts.forEach((text, id) => {
      const elapsed = now - text.createdAt;
      const progress = elapsed / text.duration;

      if (progress >= 1) {
        toRemove.push(id);
        return;
      }

      text.alpha = 1 - progress;
      text.y = text.startY + text.velocityY * (elapsed / 1000);
      text.scale = text.scale * (1 - progress * 0.3);
    });

    toRemove.forEach(id => this.floatingTexts.delete(id));
  }

  getFloatingTexts(): FloatingText[] {
    return Array.from(this.floatingTexts.values());
  }

  clear(): void {
    this.floatingTexts.clear();
  }
}
