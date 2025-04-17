import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: true, // Start muted by default
  
  setBackgroundMusic: (music) => {
    // Configure background music for a better experience
    music.volume = 0.4; // Lower volume
    music.loop = true;  // Ensure looping
    
    // Apply a subtle filter for warmer sound
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaElementSource(music);
      const filter = audioContext.createBiquadFilter();
      
      filter.type = "lowpass";
      filter.frequency.value = 3500;
      filter.Q.value = 0.5;
      
      source.connect(filter);
      filter.connect(audioContext.destination);
    } catch (error) {
      console.log("Audio context setup failed, using default audio:", error);
    }
    
    set({ backgroundMusic: music });
  },
  
  setHitSound: (sound) => {
    // Configure hit sound for a better experience
    sound.volume = 0.35; // Lower default volume
    sound.playbackRate = 0.9; // Slightly slower for less harshness
    
    set({ hitSound: sound });
  },
  
  setSuccessSound: (sound) => {
    // Configure success sound for a better experience
    sound.volume = 0.5; // Standard volume
    sound.playbackRate = 1.1; // Slightly faster for more excitement
    
    set({ successSound: sound });
  },
  
  toggleMute: () => {
    const { isMuted, backgroundMusic } = get();
    const newMutedState = !isMuted;
    
    set({ isMuted: newMutedState });
    
    // Fade background music in/out for smoother transitions
    if (backgroundMusic) {
      const fadeAudio = setInterval(() => {
        // If unmuting, increase volume gradually
        if (!newMutedState && backgroundMusic.volume < 0.4) {
          backgroundMusic.volume = Math.min(0.4, backgroundMusic.volume + 0.05);
        }
        // If muting, decrease volume gradually
        else if (newMutedState && backgroundMusic.volume > 0) {
          backgroundMusic.volume = Math.max(0, backgroundMusic.volume - 0.05);
        }
        // Once target volume reached, clear interval
        else {
          clearInterval(fadeAudio);
        }
      }, 50);
    }
    
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'} with fade effect`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound && !isMuted) {
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      
      // Add slight random variation to volume and playback rate for a more natural feel
      soundClone.volume = 0.3 + (Math.random() * 0.1);
      soundClone.playbackRate = 0.9 + (Math.random() * 0.2);
      
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound && !isMuted) {
      // Clone the sound for independent control
      const soundClone = successSound.cloneNode() as HTMLAudioElement;
      
      // Add slight random variation for a more natural feel
      soundClone.volume = 0.45 + (Math.random() * 0.1);
      soundClone.playbackRate = 1.05 + (Math.random() * 0.15);
      
      soundClone.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  }
}));
