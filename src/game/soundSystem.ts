/**
 * Sound & Audio Controller for "محقق الحارة"
 * 
 * Fully separates Game Sounds (Permanent / Always Active) from Background Music (User-Controlled):
 * - Sfx & Radio Bus: Permanent (دائم), high-clarity, never muted by music controls
 * - Music Bus: Controlled by the user via the TopNav music slider & mute button
 * - Rhythmic Egyptian Noir Trip-Hop / Detective Beat synthesis (kick, snare, bassline, Rhodes chords, Oud riffs)
 * - Studio Master Dynamics Compressor + Subsonic Filter to prevent distortion
 */

import { ASSETS } from '../data/assets';

class SoundSystem {
  private audioCtx: AudioContext | null = null;
  private bgAudioElement: HTMLAudioElement | null = null;
  
  // Background Music State (Controlled by user)
  private isMusicMuted: boolean = false;
  private musicVolume: number = ASSETS.defaultVolume || 0.70;
  private isSynthesizingBeat: boolean = false;
  private beatInterval: number | null = null;
  private beatStep: number = 0;

  // Master Audio Bus Nodes
  private masterCompressor: DynamicsCompressorNode | null = null;
  private masterHighpass: BiquadFilterNode | null = null;

  // Music Channel Gain (User Controlled)
  private musicGain: GainNode | null = null;

  // Game SFX Channel Gain (Always Permanent / Active)
  private sfxGain: GainNode | null = null;

  private hasUserInteracted: boolean = false;

  constructor() {}

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }

    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      // Build Master Bus if not initialized yet
      if (!this.masterCompressor && this.audioCtx) {
        const ctx = this.audioCtx;

        // 1. Subsonic Highpass (cleans up DC offset and sub-rumble below 40Hz)
        this.masterHighpass = ctx.createBiquadFilter();
        this.masterHighpass.type = 'highpass';
        this.masterHighpass.frequency.setValueAtTime(40, ctx.currentTime);
        this.masterHighpass.Q.setValueAtTime(0.7, ctx.currentTime);

        // 2. Studio Master Dynamics Compressor / Brickwall Limiter
        this.masterCompressor = ctx.createDynamicsCompressor();
        this.masterCompressor.threshold.setValueAtTime(-10, ctx.currentTime);
        this.masterCompressor.knee.setValueAtTime(6, ctx.currentTime);
        this.masterCompressor.ratio.setValueAtTime(10, ctx.currentTime);
        this.masterCompressor.attack.setValueAtTime(0.003, ctx.currentTime);
        this.masterCompressor.release.setValueAtTime(0.18, ctx.currentTime);

        // Chain: Highpass -> Compressor -> AudioDestination
        this.masterHighpass.connect(this.masterCompressor);
        this.masterCompressor.connect(ctx.destination);

        // 3. Dedicated Background Music Channel
        this.musicGain = ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, ctx.currentTime);
        this.musicGain.connect(this.masterHighpass);

        // 4. Dedicated Game SFX & Radio Channel (ALWAYS PERMANENT / ACTIVE)
        this.sfxGain = ctx.createGain();
        this.sfxGain.gain.setValueAtTime(1.0, ctx.currentTime); // Full, crystal-clear presence
        this.sfxGain.connect(this.masterHighpass);
      }
    }
  }

  public notifyUserInteraction() {
    this.hasUserInteracted = true;
    this.initAudioContext();
  }

  /**
   * Starts the background song (either HTML5 Audio if file is present or Synthesized Egyptian Noir Beat)
   */
  public async startBackgroundAudio(): Promise<void> {
    if (!this.hasUserInteracted) return;
    this.initAudioContext();

    if (!this.bgAudioElement) {
      this.bgAudioElement = new Audio(ASSETS.backgroundMusic);
      this.bgAudioElement.loop = true;
      this.bgAudioElement.volume = this.isMusicMuted ? 0 : this.musicVolume;

      this.bgAudioElement.addEventListener('error', () => {
        // Fallback to high-quality rhythmic Egyptian Noir beat
        this.startEgyptianNoirBeat();
      });
    }

    try {
      if (!this.isMusicMuted && this.bgAudioElement) {
        await this.bgAudioElement.play();
      }
    } catch {
      this.startEgyptianNoirBeat();
    }
  }

  /**
   * Rhythmic Egyptian Noir Detective Beat:
   * Hypnotic 76 BPM trip-hop groove with:
   * - Punchy 808 sub kick
   * - Crisp rimshot / snare
   * - Subtle acoustic shaker
   * - Warm Rhodes electric piano chords (Dm - Bb - Gm - A7)
   * - Haunting plucked Oud riffs
   * All routed strictly to this.musicGain so the user controls it!
   */
  public startEgyptianNoirBeat(): void {
    if (this.isSynthesizingBeat) return;
    this.initAudioContext();
    if (!this.audioCtx || !this.musicGain) return;

    this.isSynthesizingBeat = true;
    this.beatStep = 0;

    // 76 BPM = ~197ms per 16th note step
    const stepDuration = 0.197;

    // Chord progression in D minor: [Dm, Dm, Bb, A7] (each 8 steps / 2 beats)
    const chords = [
      [146.83, 174.61, 220.0],  // Dm (D3, F3, A3)
      [146.83, 174.61, 220.0],  // Dm
      [116.54, 174.61, 233.08], // Bb (Bb2, F3, Bb3)
      [110.0, 164.81, 220.0]    // A7 (A2, E3, A3)
    ];

    // Egyptian Oud Melodic phrase notes
    const oudScale = [220.0, 233.08, 261.63, 293.66, 311.13, 349.23];

    this.beatInterval = window.setInterval(() => {
      if (!this.audioCtx || !this.musicGain || !this.isSynthesizingBeat) return;
      if (this.isMusicMuted) return;

      const step = this.beatStep % 16;
      const bar = Math.floor(this.beatStep / 16) % 4;
      const now = this.audioCtx.currentTime;

      // 1. Kick on step 0, 6, 10
      if (step === 0 || step === 6 || step === 10) {
        this.playSynthesizedKick(now);
      }

      // 2. Snare / Rimshot on step 4 and 12 (beat 2 and 4)
      if (step === 4 || step === 12) {
        this.playSynthesizedSnare(now);
      }

      // 3. Shaker / Hat on even steps
      if (step % 2 === 0) {
        this.playSynthesizedHat(now, step === 0 || step === 8);
      }

      // 4. Bassline on step 0, 4, 8, 12
      if (step === 0 || step === 8) {
        const bassFreq = [73.42, 73.42, 58.27, 55.0][bar]; // D2, D2, Bb1, A1
        this.playSynthesizedBass(bassFreq, now);
      }

      // 5. Rhodes Chords on step 0 and step 8
      if (step === 0 || step === 8) {
        this.playRhodesChord(chords[bar], now);
      }

      // 6. Plucked Egyptian Oud Accent on steps 2, 7, 11, 14
      if (step === 2 || step === 7 || step === 11 || step === 14) {
        const noteIdx = (bar + step) % oudScale.length;
        this.playOudLeadNote(oudScale[noteIdx], now);
      }

      this.beatStep++;
    }, stepDuration * 1000);
  }

  public stopEgyptianNoirBeat(): void {
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
    this.isSynthesizingBeat = false;
  }

  // --- Internal Synth Instruments for the Noir Beat (Connected to musicGain) ---

  private playSynthesizedKick(now: number) {
    if (!this.audioCtx || !this.musicGain) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  }

  private playSynthesizedSnare(now: number) {
    if (!this.audioCtx || !this.musicGain) return;
    try {
      const ctx = this.audioCtx;
      // Noise burst
      const bufSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.35));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1100, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start(now);

      // Body tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);

      oscGain.gain.setValueAtTime(0.2, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(oscGain);
      oscGain.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  private playSynthesizedHat(now: number, isAccent: boolean) {
    if (!this.audioCtx || !this.musicGain) return;
    try {
      const ctx = this.audioCtx;
      const bufSize = Math.floor(ctx.sampleRate * 0.04);
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.2));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(6500, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isAccent ? 0.12 : 0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start(now);
    } catch {}
  }

  private playSynthesizedBass(freq: number, now: number) {
    if (!this.audioCtx || !this.musicGain) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.75);
    } catch {}
  }

  private playRhodesChord(chordFreqs: number[], now: number) {
    if (!this.audioCtx || !this.musicGain) return;
    try {
      chordFreqs.forEach(f => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.musicGain!);

        osc.start(now);
        osc.stop(now + 1.25);
      });
    } catch {}
  }

  private playOudLeadNote(freq: number, now: number) {
    if (!this.audioCtx || !this.musicGain) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {}
  }

  // --- Background Music Controls (User Controls This) ---

  public setVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));

    if (this.bgAudioElement) {
      this.bgAudioElement.volume = this.isMusicMuted ? 0 : this.musicVolume;
    }

    if (this.musicGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, now);
    }
  }

  public toggleMute(): boolean {
    this.isMusicMuted = !this.isMusicMuted;

    if (this.musicGain && this.audioCtx) {
      this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume, this.audioCtx.currentTime);
    }

    if (this.bgAudioElement) {
      this.bgAudioElement.volume = this.isMusicMuted ? 0 : this.musicVolume;
      if (!this.isMusicMuted) {
        this.bgAudioElement.play().catch(() => this.startEgyptianNoirBeat());
      }
    } else if (!this.isMusicMuted) {
      this.startEgyptianNoirBeat();
    }

    return this.isMusicMuted;
  }

  public getIsMuted(): boolean {
    return this.isMusicMuted;
  }

  public getVolume(): number {
    return this.musicVolume;
  }

  /**
   * Duck music slightly during speech or dialogue
   */
  public setLowVolumeMode(isDucking: boolean): void {
    if (!this.audioCtx || !this.musicGain) return;
    const now = this.audioCtx.currentTime;
    const factor = isDucking ? 0.25 : 1.0;

    if (this.bgAudioElement) {
      this.bgAudioElement.volume = this.isMusicMuted ? 0 : this.musicVolume * factor;
    }

    this.musicGain.gain.setValueAtTime(this.isMusicMuted ? 0 : this.musicVolume * factor, now);
  }

  // =========================================================================
  // --- Permanent Game Sounds & Radio Bus (ALWAYS ACTIVE / دائم) ---
  // =========================================================================

  private getSfxDestination(): AudioNode | null {
    this.initAudioContext();
    return this.sfxGain || (this.audioCtx ? this.audioCtx.destination : null);
  }

  /**
   * Spoken Arabic Radio Broadcast using Web Speech API:
   * Always loud, crystal clear, unaffected by music mute!
   */
  public speakArabicRadio(text: string, onEnd?: () => void): void {
    this.playRadioCueTone();
    this.setLowVolumeMode(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-EG';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0; // Always loud and clear!

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      const handleFinished = () => {
        this.setLowVolumeMode(false);
        if (onEnd) onEnd();
      };

      utterance.onend = handleFinished;
      utterance.onerror = handleFinished;

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        this.setLowVolumeMode(false);
        if (onEnd) onEnd();
      }, 2500);
    }
  }

  public stopRadioSpeech(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.setLowVolumeMode(false);
  }

  public playRadioCueTone(): void {
    this.initAudioContext();
    const dest = this.getSfxDestination();
    if (!this.audioCtx || !dest) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      [880, 1174.66].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  /**
   * Deep, resonant church bells ringing (Cairo Mar Girgis church chimes)
   * Permanent game audio, always clear and bronze resonant
   */
  public playChurchBellChimes(count: number = 10, onComplete?: () => void): void {
    this.initAudioContext();
    const dest = this.getSfxDestination();
    if (!this.audioCtx || !dest) {
      if (onComplete) onComplete();
      return;
    }

    const ctx = this.audioCtx;
    let bellsPlayed = 0;

    const interval = setInterval(() => {
      if (bellsPlayed >= count) {
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }

      try {
        const now = ctx.currentTime;
        const fundamental = 261.63; // Middle C bell bronze
        const partials = [
          { mult: 1.0, gain: 0.32, decay: 1.8 },
          { mult: 2.0, gain: 0.18, decay: 1.4 },
          { mult: 2.4, gain: 0.12, decay: 1.2 },
          { mult: 3.0, gain: 0.08, decay: 0.9 },
        ];

        partials.forEach(p => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * p.mult, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(p.gain, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + p.decay + 0.1);
        });
      } catch {}

      bellsPlayed++;
    }, 750);
  }

  /**
   * Forensic and UI sound effects:
   * Always active on the SFX bus, crisp, studio-calibrated
   */
  public playSoundEffect(type: 'clue' | 'paper' | 'click' | 'cassette_click' | 'success' | 'stinger' | 'key'): void {
    this.initAudioContext();
    const dest = this.getSfxDestination();
    if (!this.audioCtx || !dest) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'paper') {
        const bufferSize = Math.floor(ctx.sampleRate * 0.14);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.Q.setValueAtTime(1.5, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        noise.start(now);
      } else if (type === 'clue') {
        const notes = [587.33, 739.99, 880.0, 1174.66];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
          gain.gain.linearRampToValueAtTime(0.35, now + idx * 0.07 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.07);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now + idx * 0.07);
          osc.stop(now + 1.3 + idx * 0.07);
        });
      } else if (type === 'cassette_click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.06);

        gain.gain.setValueAtTime(0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'success') {
        const notes = [293.66, 369.99, 440.0, 587.33];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);

          gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
          gain.gain.linearRampToValueAtTime(0.34, now + idx * 0.09 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now + idx * 0.09);
          osc.stop(now + 1.9);
        });
      } else if (type === 'stinger') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(73.4, now + 0.9);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.linearRampToValueAtTime(180, now + 0.9);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.42, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 1.15);
      } else if (type === 'key') {
        const freqs = [1760, 2637];
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.13);
        });
      }
    } catch {}
  }
}

export const soundManager = new SoundSystem();
