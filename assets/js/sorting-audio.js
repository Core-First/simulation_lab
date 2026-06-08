class SortingAudio {
  constructor() {
    this.audioCtx = null;
    this.mainGain = null;
    this.isMuted = localStorage.getItem('sorting-audio-muted') === 'true';
    this.activeOscillators = [];
    this.sweepTimeouts = [];
    
    // Automatically hook up UI elements when loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initUI());
    } else {
      this.initUI();
    }
  }

  /**
   * Initializes the Web Audio API context on first user action.
   */
  initContext() {
    if (this.audioCtx) return;
    
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      this.mainGain = this.audioCtx.createGain();
      // Set volume: 0.15 is clear but not piercing
      this.mainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.audioCtx.currentTime);
      this.mainGain.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
    }
  }

  /**
   * Hook up UI elements like the mute button.
   */
  initUI() {
    const toggleBtn = document.getElementById('audioToggle');
    if (toggleBtn) {
      this.updateToggleButton(toggleBtn);
      toggleBtn.addEventListener('click', () => {
        this.toggleMute();
        this.updateToggleButton(toggleBtn);
      });
    }
  }

  /**
   * Toggles the mute state and saves it to local storage.
   */
  toggleMute() {
    this.initContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('sorting-audio-muted', this.isMuted);
    
    if (this.mainGain && this.audioCtx) {
      // Smooth volume transition to avoid pops
      const targetGain = this.isMuted ? 0 : 0.15;
      this.mainGain.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.01);
    }
  }

  /**
   * Updates the icon class of the mute toggle button.
   */
  updateToggleButton(btn) {
    const icon = btn.querySelector('i');
    if (icon) {
      if (this.isMuted) {
        icon.className = 'fa-solid fa-volume-xmark';
        btn.classList.add('btn-outline-danger');
        btn.classList.remove('btn-outline-secondary');
        btn.title = "Unmute Sound";
      } else {
        icon.className = 'fa-solid fa-volume-high';
        btn.classList.add('btn-outline-secondary');
        btn.classList.remove('btn-outline-danger');
        btn.title = "Mute Sound";
      }
    }
  }

  /**
   * Plays a quick tone mapped to the value of an array element.
   * @param {number} value - The value to play
   * @param {number[]} array - The current array context (used to scale frequency)
   * @param {number} [duration=0.08] - Sound duration in seconds
   */
  playTone(value, array, duration = 0.06) {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;
    
    // Resume context if suspended (browser security policy)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Map value to frequency (linear mapping between 150 Hz and 900 Hz)
    const minVal = Math.min(...array);
    const maxVal = Math.max(...array);
    const range = maxVal - minVal;
    const pct = range > 0 ? (value - minVal) / range : 0.5;
    const freq = 150 + pct * 750;

    const osc = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();

    osc.connect(noteGain);
    noteGain.connect(this.mainGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // ADSR Envelope: Prevents audio clicks/pops with clean attack and decay
    noteGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    noteGain.gain.linearRampToValueAtTime(1.0, this.audioCtx.currentTime + 0.005); // quick attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration); // quick decay

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);

    // Keep track of active oscillator to allow emergency stop
    this.activeOscillators.push(osc);
    osc.onended = () => {
      this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
    };
  }

  /**
   * Sweeps through the final sorted array playing a rapid rising scale.
   * @param {number[]} array - The sorted array
   */
  playSweep(array) {
    this.stop(); // Stop any pending sounds/sweeps first
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const n = array.length;
    const sweepDuration = 1000; // total sweep duration in ms
    const interval = Math.max(15, Math.min(40, sweepDuration / n)); // ms per element

    array.forEach((val, idx) => {
      const tId = setTimeout(() => {
        // slightly longer duration for sweep notes to make them ring nicely
        this.playTone(val, array, 0.12);
      }, idx * interval);
      this.sweepTimeouts.push(tId);
    });
  }

  /**
   * Stops all active oscillator nodes and clears scheduled sweeps.
   */
  stop() {
    // Clear any scheduled timeouts for sweeps
    this.sweepTimeouts.forEach(clearTimeout);
    this.sweepTimeouts = [];

    // Stop and disconnect any playing oscillators immediately
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped/disconnected
      }
    });
    this.activeOscillators = [];
  }
}

// Export globally
window.SortingAudio = SortingAudio;
