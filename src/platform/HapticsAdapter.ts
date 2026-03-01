export class HapticsAdapter {
  private enabled: boolean = true;

  async init(): Promise<void> {
    this.enabled = 'vibrate' in navigator;
  }

  light(): void {
    if (!this.enabled) return;
    navigator.vibrate(10);
  }

  medium(): void {
    if (!this.enabled) return;
    navigator.vibrate([20, 10, 20]);
  }

  success(): void {
    if (!this.enabled) return;
    navigator.vibrate([30, 50, 30]);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled && 'vibrate' in navigator;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
