import { 
  FloatingText, 
  WoodChip, 
  ImpactRing, 
  ScreenShakeState,
  ParticleConfig,
  MAX_PARTICLES,
  PARTICLE_GRAVITY,
  SCREEN_SHAKE_DECAY
} from '../core/types';
import { WOOD_CHIP_COLORS } from '../data/woodTypes';

export class EffectSystem {
  private floatingTexts: Map<string, FloatingText> = new Map();
  private textIdCounter: number = 0;
  private readonly TEXT_DURATION = 1000;
  private readonly TEXT_VELOCITY = -50;

  private woodChips: WoodChip[] = [];
  private impactRings: ImpactRing[] = [];
  private screenShake: ScreenShakeState = { intensity: 0, offsetX: 0, offsetY: 0 };
  private hitPauseRemaining: number = 0;

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

  triggerHitEffects(
    x: number,
    y: number,
    config: ParticleConfig | undefined,
    isCrit: boolean,
    woodTypeId: string,
    reducedMotion: boolean
  ): void {
    if (!config) return;

    const multiplier = reducedMotion ? 0.5 : 1;
    const critMultiplier = isCrit ? 2 : 1;

    const chipCount = Math.floor(config.chipCount * critMultiplier * multiplier);
    const colors = config.specialColors ?? WOOD_CHIP_COLORS[woodTypeId] ?? WOOD_CHIP_COLORS.basic;
    
    this.spawnWoodChips(x, y, chipCount, config.chipSizeRange, colors, reducedMotion);
    
    if (!reducedMotion) {
      this.spawnImpactRing(
        x, 
        y, 
        isCrit ? config.impactRadius * 1.5 : config.impactRadius,
        isCrit ? '#FFD700' : '#FFFFFF'
      );
    }

    const shakeIntensity = config.shakeIntensity * (isCrit ? 1.5 : 1) * (reducedMotion ? 0.5 : 1);
    this.triggerScreenShake(shakeIntensity);

    const hitPauseMs = config.hitPauseMs * (isCrit ? 1.5 : 1) * (reducedMotion ? 0.5 : 1);
    this.triggerHitPause(hitPauseMs);
  }

  private spawnWoodChips(
    x: number,
    y: number,
    count: number,
    sizeRange: [number, number],
    colors: string[],
    reducedMotion: boolean
  ): void {
    const maxChips = reducedMotion ? MAX_PARTICLES / 2 : MAX_PARTICLES;
    const activeCount = this.woodChips.filter(c => c.life > 0).length;
    const availableSlots = Math.max(0, maxChips - activeCount);
    const toSpawn = Math.min(count, availableSlots);

    for (let i = 0; i < toSpawn; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = 100 + Math.random() * 150;
      
      const chip: WoodChip = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 15,
        life: 1,
        maxLife: 0.4 + Math.random() * 0.3
      };
      
      this.woodChips.push(chip);
    }
  }

  private spawnImpactRing(x: number, y: number, radius: number, color: string): void {
    this.impactRings.push({
      x,
      y,
      radius: 5,
      maxRadius: radius,
      alpha: 0.8,
      color
    });
  }

  private triggerScreenShake(intensity: number): void {
    this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
  }

  private triggerHitPause(durationMs: number): void {
    this.hitPauseRemaining = Math.max(this.hitPauseRemaining, durationMs);
  }

  update(deltaTime: number): boolean {
    if (this.hitPauseRemaining > 0) {
      this.hitPauseRemaining -= deltaTime;
      return false;
    }

    if (this.screenShake.intensity > 0.5) {
      this.screenShake.offsetX = (Math.random() - 0.5) * this.screenShake.intensity;
      this.screenShake.offsetY = (Math.random() - 0.5) * this.screenShake.intensity;
      this.screenShake.intensity *= SCREEN_SHAKE_DECAY;
    } else {
      this.screenShake.offsetX = 0;
      this.screenShake.offsetY = 0;
      this.screenShake.intensity = 0;
    }

    const dt = deltaTime / 1000;
    
    for (const chip of this.woodChips) {
      if (chip.life > 0) {
        chip.vy += PARTICLE_GRAVITY * dt;
        chip.vx *= 0.98;
        chip.vy *= 0.98;
        chip.x += chip.vx * dt;
        chip.y += chip.vy * dt;
        chip.rotation += chip.rotationSpeed * dt;
        chip.life -= dt / chip.maxLife;
      }
    }

    this.woodChips = this.woodChips.filter(c => c.life > 0);

    for (const ring of this.impactRings) {
      ring.radius += (ring.maxRadius - ring.radius) * 8 * dt;
      ring.alpha = 0.8 * (1 - ring.radius / ring.maxRadius);
    }

    this.impactRings = this.impactRings.filter(r => r.alpha > 0.01);

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

    return true;
  }

  applyScreenShake(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
  }

  renderParticles(ctx: CanvasRenderingContext2D): void {
    for (const ring of this.impactRings) {
      ctx.save();
      ctx.globalAlpha = ring.alpha;
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    for (const chip of this.woodChips) {
      if (chip.life <= 0) continue;
      
      ctx.save();
      ctx.globalAlpha = chip.life;
      ctx.translate(chip.x, chip.y);
      ctx.rotate(chip.rotation);
      ctx.fillStyle = chip.color;
      ctx.fillRect(-chip.size / 2, -chip.size / 2, chip.size, chip.size);
      ctx.restore();
    }
  }

  getFloatingTexts(): FloatingText[] {
    return Array.from(this.floatingTexts.values());
  }

  isHitPaused(): boolean {
    return this.hitPauseRemaining > 0;
  }

  clear(): void {
    this.floatingTexts.clear();
    this.woodChips = [];
    this.impactRings = [];
    this.screenShake = { intensity: 0, offsetX: 0, offsetY: 0 };
    this.hitPauseRemaining = 0;
  }
}
