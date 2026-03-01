export class GameLoop {
  private lastTime: number = 0;
  private accumulatedTime: number = 0;
  private readonly FIXED_TIMESTEP = 1000 / 60;
  private isRunning: boolean = false;
  private frameId: number = 0;

  private updateCallback: (deltaTime: number) => void;
  private renderCallback: () => void;

  constructor(
    update: (deltaTime: number) => void,
    render: () => void
  ) {
    this.updateCallback = update;
    this.renderCallback = render;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }

  stop(): void {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    const clampedDelta = Math.min(deltaTime, 250);
    this.accumulatedTime += clampedDelta;

    while (this.accumulatedTime >= this.FIXED_TIMESTEP) {
      this.updateCallback(this.FIXED_TIMESTEP);
      this.accumulatedTime -= this.FIXED_TIMESTEP;
    }

    this.renderCallback();

    this.frameId = requestAnimationFrame((time) => this.loop(time));
  }
}
