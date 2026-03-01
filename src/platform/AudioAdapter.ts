export class AudioAdapter {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private masterVolume: number = 0.7;
  private isMuted: boolean = false;

  async init(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  async loadSound(id: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.sounds.set(id, audioBuffer);
    } catch (e) {
      console.warn(`Failed to load sound: ${id}`, e);
    }
  }

  play(id: string, volume: number = 1): void {
    if (!this.audioContext || this.isMuted) return;

    const buffer = this.sounds.get(id);
    if (!buffer) {
      this.playSynth(id, volume);
      return;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    gainNode.gain.value = volume * this.masterVolume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start(0);
  }

  private playSynth(id: string, volume: number): void {
    if (!this.audioContext || this.isMuted) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value = 0.1 * volume * this.masterVolume;

    switch (id) {
      case 'chop':
        osc.frequency.value = 150;
        osc.type = 'square';
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        break;
      case 'crit':
        osc.frequency.value = 300;
        osc.type = 'sawtooth';
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        break;
      case 'fall':
        osc.frequency.value = 100;
        osc.type = 'triangle';
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        break;
      case 'collect':
        osc.frequency.value = 440;
        osc.type = 'sine';
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        break;
      default:
        osc.frequency.value = 200;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    }

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  mute(): void {
    this.isMuted = true;
  }

  unmute(): void {
    this.isMuted = false;
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}
