// Utility Functions for Simulations

/**
 * Generate an array of random numbers
 * @param {number} size - Size of the array
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (inclusive)
 * @returns {number[]} Array of random integers
 */
function randomArray(size, min = 1, max = 100) {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return arr;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Simple timer for measuring execution time
 */
class Timer {
  constructor() {
    this.startTime = null;
    this.endTime = null;
  }
  
  start() {
    this.startTime = performance.now();
  }
  
  stop() {
    this.endTime = performance.now();
  }
  
  getElapsedTime() {
    if (this.startTime === null) return 0;
    const end = this.endTime !== null ? this.endTime : performance.now();
    return end - this.startTime;
  }
  
  reset() {
    this.startTime = null;
    this.endTime = null;
  }
}

/**
 * Animation queue for smooth visualizations
 */
class AnimationQueue {
  constructor() {
    this.queue = [];
    this.isRunning = false;
  }
  
  add(callback) {
    this.queue.push(callback);
    if (!this.isRunning) {
      this.processQueue();
    }
  }
  
  processQueue() {
    if (this.queue.length === 0) {
      this.isRunning = false;
      return;
    }
    
    this.isRunning = true;
    const callback = this.queue.shift();
    callback(() => {
      requestAnimationFrame(() => this.processQueue());
    });
  }
  
  clear() {
    this.queue = [];
    this.isRunning = false;
  }
}

/**
 * Debounce function to limit rate of calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function to limit rate of calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Sleep function that returns a promise
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Resolves after ms
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Export for use in other modules (if using modules)
// In browser, these will be window properties if attached
window.utils = {
  randomArray,
  shuffleArray,
  Timer,
  AnimationQueue,
  debounce,
  throttle,
  formatNumber,
  sleep
};
