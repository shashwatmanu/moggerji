class MusicEngine {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = true;

  init() {
    if (typeof window !== "undefined" && !this.audio) {
      this.audio = new Audio('/music.mp3'); // User will place music.mp3 in public folder
      this.audio.loop = true;
      this.audio.volume = 0.4;
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    
    if (this.audio) {
      if (!this.isMuted) {
        // Handle autoplay policy
        this.audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        this.audio.pause();
      }
    }
    
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Removing the synth UI sounds as they were too much
  playHover() {}
  playClick() {}
  playTransition() {}
  playSuccess() {}
}

export const sound = new MusicEngine();
