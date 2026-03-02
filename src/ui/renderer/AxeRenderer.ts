import { AxeDefinition, AxeAnimationState, AxeVisualConfig } from '../../core/types';

export class AxeRenderer {
  private static readonly REST_X_OFFSET = 80;
  private static readonly REST_Y_OFFSET = -60;
  private static readonly SWING_OFFSET_DISTANCE = 30;
  private static readonly SWING_OFFSET_Y_MULTIPLIER = 0.5;

  render(
    ctx: CanvasRenderingContext2D,
    axeDef: AxeDefinition,
    visual: AxeVisualConfig,
    animState: AxeAnimationState,
    treeX: number,
    treeY: number,
    scale: number
  ): void {
    const swingAngle = this.calculateSwingAngle(animState.swingProgress);
    const restAngle = -Math.PI / 6; // -30 degrees resting
    const totalAngle = restAngle + swingAngle;
    
    // Position: right side of tree
    const restX = treeX + AxeRenderer.REST_X_OFFSET;
    const restY = treeY + AxeRenderer.REST_Y_OFFSET;
    
    // Calculate swing offset (moves toward tree during swing)
    const swingOffset = Math.sin(animState.swingProgress * Math.PI) * AxeRenderer.SWING_OFFSET_DISTANCE;
    const axeX = restX - swingOffset;
    const axeY = restY + swingOffset * AxeRenderer.SWING_OFFSET_Y_MULTIPLIER;
    
    ctx.save();
    ctx.translate(axeX, axeY);
    ctx.rotate(totalAngle);
    ctx.scale(scale, scale);
    
    // Apply tier scale bonus
    const tierScale = 1 + (axeDef.tier - 1) * 0.1;
    ctx.scale(tierScale, tierScale);
    
    const squash = this.calculateSquashStretch(animState.swingProgress);
    ctx.scale(squash.scaleX, squash.scaleY);
    
    // Draw glow effect first (behind blade)
    if (visual.hasGlow && visual.glowColor) {
      this.drawGlow(ctx, visual);
    }
    
    // Draw handle
    this.drawHandle(ctx, visual);
    
    // Draw blade based on shape
    this.drawBlade(ctx, visual);
    
    // Draw shine effect
    if (visual.shineEffect) {
      this.drawShine(ctx);
    }
    
    // Draw crit flash overlay
    if (animState.isCritPending && animState.critFlashTime > 0) {
      this.drawCritFlash(ctx, animState);
    }
    
    ctx.restore();
  }
  
  private calculateSwingAngle(progress: number): number {
    const maxSwing = -Math.PI / 4;
    
    if (progress <= 0.20) {
      const t = progress / 0.20;
      return -maxSwing * 0.3 * this.easeInQuad(t);
    } else if (progress <= 0.55) {
      const t = (progress - 0.20) / 0.35;
      return -maxSwing * 0.3 + maxSwing * 1.3 * this.easeOutQuart(t);
    } else if (progress <= 0.60) {
      return maxSwing;
    } else {
      const t = (progress - 0.60) / 0.40;
      return maxSwing * (1 - this.easeOutBack(t));
    }
  }
  
  private easeInQuad(t: number): number {
    return t * t;
  }

  private easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }

  private easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  private calculateSquashStretch(progress: number): { scaleX: number; scaleY: number } {
    if (progress <= 0.20) {
      const t = progress / 0.20;
      return { scaleX: 1, scaleY: 1 + 0.1 * t };
    } else if (progress <= 0.55) {
      const t = (progress - 0.20) / 0.35;
      return { scaleX: 1 + 0.15 * t, scaleY: 1 - 0.1 * t };
    } else if (progress <= 0.60) {
      return { scaleX: 1.15, scaleY: 0.9 };
    } else {
      const t = (progress - 0.60) / 0.40;
      return { scaleX: 1.15 - 0.15 * t, scaleY: 0.9 + 0.1 * t };
    }
  }
  
  private drawGlow(ctx: CanvasRenderingContext2D, visual: AxeVisualConfig): void {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = visual.glowColor!;
    ctx.shadowBlur = 20;
    
    // Glow behind blade area
    ctx.fillStyle = visual.glowColor!;
    ctx.beginPath();
    ctx.ellipse(-30, 0, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  private drawHandle(ctx: CanvasRenderingContext2D, visual: AxeVisualConfig): void {
    const handleLength = 60;
    const handleWidth = 8;
    
    // Main handle
    ctx.fillStyle = visual.handleColor;
    ctx.beginPath();
    ctx.roundRect(0, -handleWidth / 2, handleLength, handleWidth, 3);
    ctx.fill();
    
    // Handle grip lines
    ctx.strokeStyle = this.darkenColor(visual.handleColor, 0.2);
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const x = handleLength - 10 - i * 8;
      ctx.beginPath();
      ctx.moveTo(x, -handleWidth / 2);
      ctx.lineTo(x, handleWidth / 2);
      ctx.stroke();
    }
    
    // Handle wrap (near blade)
    ctx.fillStyle = this.lightenColor(visual.handleColor, 0.1);
    ctx.fillRect(5, -handleWidth / 2 - 2, 15, handleWidth + 4);
  }
  
  private drawBlade(ctx: CanvasRenderingContext2D, visual: AxeVisualConfig): void {
    ctx.save();
    ctx.translate(-5, 0); // Start at handle end
    
    const width = 40 * visual.bladeWidth;
    const height = 50 * visual.bladeHeight;
    
    ctx.fillStyle = visual.bladeColor;
    
    switch (visual.bladeShape) {
      case 'wedge':
        this.drawWedgeBlade(ctx, width, height);
        break;
      case 'wide':
        this.drawWideBlade(ctx, width, height);
        break;
      case 'jagged':
        this.drawJaggedBlade(ctx, width, height);
        break;
      case 'ornate':
        this.drawOrnateBlade(ctx, width, height);
        break;
      case 'crystal':
        this.drawCrystalBlade(ctx, width, height);
        break;
    }
    
    // Blade edge highlight
    ctx.strokeStyle = this.lightenColor(visual.bladeColor, 0.3);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width * 0.3, 0);
    ctx.lineTo(-width, 0);
    ctx.stroke();
    
    ctx.restore();
  }
  
  private drawWedgeBlade(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(0, height / 2);
    ctx.lineTo(-width, 0);
    ctx.closePath();
    ctx.fill();
  }
  
  private drawWideBlade(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(-width * 0.3, -height / 2);
    ctx.lineTo(-width, 0);
    ctx.lineTo(-width * 0.3, height / 2);
    ctx.lineTo(0, height / 2);
    ctx.closePath();
    ctx.fill();
  }
  
  private drawJaggedBlade(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(-width * 0.25, -height / 2);
    ctx.lineTo(-width * 0.35, -height / 4);
    ctx.lineTo(-width * 0.5, -height / 3);
    ctx.lineTo(-width * 0.65, -height / 6);
    ctx.lineTo(-width, 0);
    ctx.lineTo(-width * 0.65, height / 6);
    ctx.lineTo(-width * 0.5, height / 3);
    ctx.lineTo(-width * 0.35, height / 4);
    ctx.lineTo(-width * 0.25, height / 2);
    ctx.lineTo(0, height / 2);
    ctx.closePath();
    ctx.fill();
  }
  
  private drawOrnateBlade(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    // Curved top edge
    ctx.quadraticCurveTo(-width * 0.3, -height / 2 - 5, -width * 0.6, -height / 4);
    ctx.quadraticCurveTo(-width * 0.8, -height / 8, -width, 0);
    // Curved bottom edge
    ctx.quadraticCurveTo(-width * 0.8, height / 8, -width * 0.6, height / 4);
    ctx.quadraticCurveTo(-width * 0.3, height / 2 + 5, 0, height / 2);
    ctx.closePath();
    ctx.fill();
    
    // Decorative lines
    ctx.strokeStyle = this.lightenColor(ctx.fillStyle as string, 0.2);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-width * 0.2, -height / 3);
    ctx.quadraticCurveTo(-width * 0.5, 0, -width * 0.2, height / 3);
    ctx.stroke();
  }
  
  private drawCrystalBlade(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Main crystal shape
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(-width * 0.4, -height / 2);
    ctx.lineTo(-width, 0);
    ctx.lineTo(-width * 0.4, height / 2);
    ctx.lineTo(0, height / 2);
    ctx.closePath();
    ctx.fill();
    
    // Facet lines
    ctx.strokeStyle = this.lightenColor(ctx.fillStyle as string, 0.4);
    ctx.lineWidth = 1;
    
    // Top facet
    ctx.beginPath();
    ctx.moveTo(0, -height / 2);
    ctx.lineTo(-width * 0.6, -height / 4);
    ctx.lineTo(-width * 0.4, -height / 2);
    ctx.stroke();
    
    // Middle facet
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(-width * 0.6, height / 4);
    ctx.lineTo(-width * 0.4, height / 2);
    ctx.stroke();
    
    // Inner glow
    const gradient = ctx.createLinearGradient(0, -height / 2, -width, height / 2);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  private drawShine(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    
    // Shine arc on blade
    ctx.beginPath();
    ctx.arc(-25, -10, 15, Math.PI * 0.8, Math.PI * 1.2);
    ctx.stroke();
    
    ctx.restore();
  }
  
  private drawCritFlash(ctx: CanvasRenderingContext2D, animState: AxeAnimationState): void {
    const alpha = animState.critFlashTime / 200; // Fade based on remaining time
    
    ctx.save();
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = '#FFFFFF';
    
    // Flash overlay on blade area
    ctx.beginPath();
    ctx.ellipse(-30, 0, 50, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  private colorCache = new Map<string, string>();
  
  private darkenColor(hex: string, amount: number): string {
    const cacheKey = `${hex}_${amount}_dark`;
    if (this.colorCache.has(cacheKey)) {
      return this.colorCache.get(cacheKey)!;
    }
    
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, ((num >> 16) & 0xFF) - Math.floor(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0xFF) - Math.floor(255 * amount));
    const b = Math.max(0, (num & 0xFF) - Math.floor(255 * amount));
    const result = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    this.colorCache.set(cacheKey, result);
    return result;
  }
  
  private lightenColor(hex: string, amount: number): string {
    const cacheKey = `${hex}_${amount}_light`;
    if (this.colorCache.has(cacheKey)) {
      return this.colorCache.get(cacheKey)!;
    }
    
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((num >> 16) & 0xFF) + Math.floor(255 * amount));
    const g = Math.min(255, ((num >> 8) & 0xFF) + Math.floor(255 * amount));
    const b = Math.min(255, (num & 0xFF) + Math.floor(255 * amount));
    const result = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    this.colorCache.set(cacheKey, result);
    return result;
  }
}
