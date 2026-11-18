class DestinationSoundscape {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlayingAmbient: boolean = false;
  private masterGain: GainNode | null = null;
  private waveLfoTimer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.45;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startAmbientOcean() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isPlayingAmbient) return;
    this.isPlayingAmbient = true;

    // Generate 6-second brown/pink noise buffer for gentle ocean surf
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * 6;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.35;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320;

    const waveGain = this.ctx.createGain();
    waveGain.gain.value = 0.08;

    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);
    noiseSource.start();

    // Gentle ocean swell rhythm every 5.5 seconds
    const cycleWave = () => {
      if (!this.ctx || !this.isPlayingAmbient) return;
      const now = this.ctx.currentTime;
      filter.frequency.cancelScheduledValues(now);
      waveGain.gain.cancelScheduledValues(now);

      filter.frequency.setValueAtTime(240, now);
      filter.frequency.exponentialRampToValueAtTime(620, now + 2.4);
      filter.frequency.exponentialRampToValueAtTime(240, now + 5.4);

      waveGain.gain.setValueAtTime(0.06, now);
      waveGain.gain.linearRampToValueAtTime(0.16, now + 2.4);
      waveGain.gain.linearRampToValueAtTime(0.06, now + 5.4);
    };

    cycleWave();
    this.waveLfoTimer = window.setInterval(cycleWave, 5500);
  }

  public playDoorOpeningSequence() {
    this.initContext();
    this.startAmbientOcean();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. At t + 0.65s: Realistic brass handle latch click
    const latchOsc = this.ctx.createOscillator();
    const latchGain = this.ctx.createGain();
    latchOsc.type = 'triangle';
    latchOsc.frequency.setValueAtTime(420, now + 0.62);
    latchOsc.frequency.exponentialRampToValueAtTime(140, now + 0.75);
    latchGain.gain.setValueAtTime(0.001, now + 0.6);
    latchGain.gain.linearRampToValueAtTime(0.18, now + 0.63);
    latchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.78);
    latchOsc.connect(latchGain);
    latchGain.connect(this.masterGain);
    latchOsc.start(now + 0.6);
    latchOsc.stop(now + 0.8);

    // 2. At t + 1.15s: Ethereal warm sunlight chord bloom (Fmaj9 / Cmaj9 arpeggiated shimmer)
    const freqs = [261.63, 329.63, 392.0, 493.88, 587.33, 783.99];
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + 1.1 + idx * 0.14);

      gain.gain.setValueAtTime(0.0001, now + 1.1 + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.055, now + 1.6 + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.2 + idx * 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + 1.1 + idx * 0.14);
      osc.stop(now + 5.5 + idx * 0.2);
    });
  }

  public playChimeAccent() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77];
    freqs.forEach((f, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.0001, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.03, now + i * 0.08 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.6);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 1.7);
    });
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.45,
        this.ctx.currentTime,
        0.15
      );
    }
    if (!this.isMuted && !this.isPlayingAmbient) {
      this.startAmbientOcean();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const soundscape = new DestinationSoundscape();
