// Centralized Simulation Audio Helper
class SimAudio {
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

  initContext() {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      this.mainGain = this.audioCtx.createGain();
      this.mainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.audioCtx.currentTime);
      this.mainGain.connect(this.audioCtx.destination);
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
    }
  }

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

  toggleMute() {
    this.initContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('sorting-audio-muted', this.isMuted);
    
    if (this.mainGain && this.audioCtx) {
      const targetGain = this.isMuted ? 0 : 0.15;
      this.mainGain.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.01);
    }
  }

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

  playTone(value, array, duration = 0.06) {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const minVal = Math.min(...array);
    const maxVal = Math.max(...array);
    const range = maxVal - minVal;
    const pct = range > 0 ? (value - minVal) / range : 0.5;
    const freq = 150 + pct * 750;

    this.playSound(freq, duration * 1000, 'sine', 1.0);
  }

  playSound(freq, durationMs, type = 'sine', volume = 0.3) {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    try {
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.connect(noteGain);
      noteGain.connect(this.mainGain || this.audioCtx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const durationSec = durationMs / 1000;
      noteGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      noteGain.gain.linearRampToValueAtTime(volume, this.audioCtx.currentTime + 0.005);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + durationSec);

      osc.start();
      osc.stop(this.audioCtx.currentTime + durationSec);

      this.activeOscillators.push(osc);
      osc.onended = () => {
        this.activeOscillators = this.activeOscillators.filter(o => o !== osc);
      };
    } catch(e) {
      console.warn("playSound failed:", e);
    }
  }

  playCrackSound() {
    this.playSound(120, 80, 'sawtooth', 0.6);
    setTimeout(() => this.playSound(80, 120, 'sawtooth', 0.5), 50);
    setTimeout(() => this.playSound(200, 60, 'square', 0.4), 120);
  }

  playSweep(array) {
    this.stop();
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const n = array.length;
    const sweepDuration = 1000;
    const interval = Math.max(15, Math.min(40, sweepDuration / n));

    array.forEach((val, idx) => {
      const tId = setTimeout(() => {
        this.playTone(val, array, 0.12);
      }, idx * interval);
      this.sweepTimeouts.push(tId);
    });
  }

  stop() {
    this.sweepTimeouts.forEach(clearTimeout);
    this.sweepTimeouts = [];

    this.activeOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }
}

window.SimAudio = SimAudio;
window.SortingAudio = SimAudio;
window.simAudio = new SimAudio();
