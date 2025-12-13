import { useCallback, useRef, useState, useEffect } from "react";

// Ambient sound system using Web Audio API for lightweight, procedural sounds
class AmbientSoundEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.15;

  async init() {
    if (this.audioContext) return;
    
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.audioContext.destination);
  }

  async resume() {
    if (this.audioContext?.state === "suspended") {
      await this.audioContext.resume();
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioContext!.currentTime, 0.1);
    }
  }

  // Soft ambient drone - calming background
  startAmbient() {
    if (!this.audioContext || !this.masterGain || this.isPlaying) return;
    
    this.isPlaying = true;
    
    // Create a very subtle, low frequency drone
    this.ambientOsc = this.audioContext.createOscillator();
    this.ambientGain = this.audioContext.createGain();
    
    this.ambientOsc.type = "sine";
    this.ambientOsc.frequency.value = 80; // Low, barely perceptible hum
    
    this.ambientGain.gain.value = 0;
    this.ambientGain.gain.setTargetAtTime(0.03, this.audioContext.currentTime, 2); // Fade in slowly
    
    this.ambientOsc.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);
    
    this.ambientOsc.start();
  }

  stopAmbient() {
    if (!this.audioContext || !this.ambientOsc || !this.ambientGain) return;
    
    this.ambientGain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.5);
    
    setTimeout(() => {
      this.ambientOsc?.stop();
      this.ambientOsc = null;
      this.ambientGain = null;
      this.isPlaying = false;
    }, 1000);
  }

  // Soft click/tap sound
  playTap() {
    if (!this.audioContext || !this.masterGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "sine";
    osc.frequency.value = 800;
    osc.frequency.setTargetAtTime(400, this.audioContext.currentTime, 0.05);
    
    gain.gain.value = 0.08;
    gain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.08);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  // Soft hover tone
  playHover() {
    if (!this.audioContext || !this.masterGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "sine";
    osc.frequency.value = 600;
    
    gain.gain.value = 0.03;
    gain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.15);
  }

  // Ascending tone for starting simulation
  playStart() {
    if (!this.audioContext || !this.masterGain) return;
    
    const notes = [400, 500, 600];
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = "sine";
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.setTargetAtTime(0.06, startTime, 0.02);
      gain.gain.setTargetAtTime(0, startTime + 0.1, 0.05);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // Soft chime for completion
  playComplete() {
    if (!this.audioContext || !this.masterGain) return;
    
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord
    
    notes.forEach((freq, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();
      
      osc.type = "sine";
      osc.frequency.value = freq;
      
      const startTime = this.audioContext!.currentTime + i * 0.05;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.setTargetAtTime(0.05, startTime, 0.01);
      gain.gain.setTargetAtTime(0, startTime + 0.3, 0.2);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(startTime);
      osc.stop(startTime + 0.8);
    });
  }

  // Soft notification/insight reveal
  playReveal() {
    if (!this.audioContext || !this.masterGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "triangle";
    osc.frequency.value = 440;
    osc.frequency.setTargetAtTime(550, this.audioContext.currentTime, 0.1);
    
    gain.gain.value = 0.04;
    gain.gain.setTargetAtTime(0, this.audioContext.currentTime + 0.15, 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.4);
  }

  // Chat message sound
  playMessage() {
    if (!this.audioContext || !this.masterGain) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = "sine";
    osc.frequency.value = 700;
    osc.frequency.setTargetAtTime(500, this.audioContext.currentTime, 0.05);
    
    gain.gain.value = 0.05;
    gain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.12);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  destroy() {
    this.stopAmbient();
    this.audioContext?.close();
    this.audioContext = null;
  }
}

// Singleton instance
let soundEngine: AmbientSoundEngine | null = null;

const getSoundEngine = () => {
  if (!soundEngine) {
    soundEngine = new AmbientSoundEngine();
  }
  return soundEngine;
};

export const useAmbientSound = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("ambientSoundEnabled") === "true";
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const engineRef = useRef<AmbientSoundEngine | null>(null);

  useEffect(() => {
    engineRef.current = getSoundEngine();
    
    return () => {
      // Don't destroy on unmount - keep singleton alive
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("ambientSoundEnabled", String(isEnabled));
  }, [isEnabled]);

  const init = useCallback(async () => {
    if (!engineRef.current || isInitialized) return;
    
    await engineRef.current.init();
    await engineRef.current.resume();
    setIsInitialized(true);
    
    if (isEnabled) {
      engineRef.current.startAmbient();
    }
  }, [isEnabled, isInitialized]);

  const toggle = useCallback(async () => {
    if (!engineRef.current) return;
    
    if (!isInitialized) {
      await init();
    }
    
    await engineRef.current.resume();
    
    if (isEnabled) {
      engineRef.current.stopAmbient();
    } else {
      engineRef.current.startAmbient();
    }
    
    setIsEnabled(!isEnabled);
  }, [isEnabled, isInitialized, init]);

  const playTap = useCallback(async () => {
    if (!isEnabled || !engineRef.current) return;
    await engineRef.current.resume();
    engineRef.current.playTap();
  }, [isEnabled]);

  const playHover = useCallback(async () => {
    if (!isEnabled || !engineRef.current) return;
    await engineRef.current.resume();
    engineRef.current.playHover();
  }, [isEnabled]);

  const playStart = useCallback(async () => {
    if (!isEnabled || !engineRef.current) return;
    await engineRef.current.resume();
    engineRef.current.playStart();
  }, [isEnabled]);

  const playComplete = useCallback(async () => {
    if (!isEnabled || !engineRef.current) return;
    await engineRef.current.resume();
    engineRef.current.playComplete();
  }, [isEnabled]);

  const playReveal = useCallback(async () => {
    if (!isEnabled || !engineRef.current) return;
    await engineRef.current.resume();
    engineRef.current.playReveal();
  }, [isEnabled]);

  const playMessage = useCallback(async () => {
    if (!isEnabled || !engineRef.current) return;
    await engineRef.current.resume();
    engineRef.current.playMessage();
  }, [isEnabled]);

  return {
    isEnabled,
    isInitialized,
    toggle,
    init,
    playTap,
    playHover,
    playStart,
    playComplete,
    playReveal,
    playMessage,
  };
};
