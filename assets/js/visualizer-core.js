// Visualizer Core Logic

/**
 * Base class for array visualizers
 */
class ArrayVisualizer {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.array = [];
    this.options = {
      barWidth: 20,
      barMargin: 5,
      maxHeight: 300,
      ...options
    };
    this.highlights = new Map(); // index -> color
  }

  /**
   * Set the array to visualize
   * @param {number[]} arr - Array of numbers
   */
  setArray(arr) {
    this.array = [...arr];
    this.draw();
  }

  /**
   * Set a highlight for a specific index
   * @param {number} index - Array index
   * @param {string} color - CSS color
   */
  highlight(index, color) {
    this.highlights.set(index, color);
    this.draw();
  }

  /**
   * Remove highlight from an index
   * @param {number} index - Array index
   */
  unhighlight(index) {
    this.highlights.delete(index);
    this.draw();
  }

  /**
   * Clear all highlights
   */
  clearHighlights() {
    this.highlights.clear();
    this.draw();
  }

  /**
   * Draw the array as bars
   */
  draw() {
    if (this.array.length === 0) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const barWidth = this.options.barWidth;
    const barMargin = this.options.barMargin;
    const totalWidth = (barWidth + barMargin) * this.array.length - barMargin;
    const startX = (width - totalWidth) / 2;
    const maxValue = Math.max(...this.array);
    const scaleFactor = (height - 20) / maxValue; // 20px padding at bottom

    this.ctx.clearRect(0, 0, width, height);

    this.array.forEach((value, index) => {
      const x = startX + index * (barWidth + barMargin);
      const barHeight = value * scaleFactor;
      const y = height - barHeight - 10; // 10px from bottom

      // Draw bar
      this.ctx.fillStyle = this.highlights.has(index) ? this.highlights.get(index) : '#4cc9f0';
      this.ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value text
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(value, x + barWidth / 2, y - 5);
    });

    // Draw baseline
    this.ctx.strokeStyle = '#666666';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height - 10);
    this.ctx.lineTo(width, height - 10);
    this.ctx.stroke();
  }

  /**
   * Swap two bars in the visualization
   * @param {number} i - First index
   * @param {number} j - Second index
   * @param {number} duration - Duration in milliseconds
   * @returns {Promise} Resolves when animation completes
   */
  async swap(i, j, duration = 500) {
    if (i === j || i < 0 || j < 0 || i >= this.array.length || j >= this.array.length) {
      return Promise.resolve();
    }

    // Swap in array
    [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
    
    // Animate the swap
    return new Promise(resolve => {
      const startTime = performance.now();
      
      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        this.draw();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.clearHighlights(); // Clear highlights after swap
          resolve();
        }
      }
      
      requestAnimationFrame(animate);
    }.bind(this));
  }

  /**
   * Compare two indices (visual indication)
   * @param {number} i - First index
   * @param {number} j - Second index
   * @param {string} color - Color for comparison
   */
  compare(i, j, color = '#ff9f1c') {
    this.highlight(i, color);
    this.highlight(j, color);
  }

  /**
   * Set a bar to sorted state (green)
   * @param {number} index - Array index
   */
  setSorted(index) {
    this.highlight(index, '#4ade80');
  }

  /**
   * Reset the visualizer
   */
  reset() {
    this.array = [];
    this.highlights.clear();
    this.draw();
  }
}

/**
 * Specialized visualizer for sorting algorithms
 */
class SortingVisualizer extends ArrayVisualizer {
  constructor(canvasId, options = {}) {
    super(canvasId, {
      barWidth: 25,
      barMargin: 3,
      maxHeight: 250,
      ...options
    });
    
    // Add algorithm name display
    this.algorithmName = '';
    this.infoPanel = null;
  }
  
  /**
   * Set the algorithm name to display
   * @param {string} name - Name of the algorithm
   */
  setAlgorithmName(name) {
    this.algorithmName = name;
    this.drawInfo();
  }
  
  /**
   * Set the info panel element
   * @param {HTMLElement} element - DOM element for info
   */
  setInfoPanel(element) {
    this.infoPanel = element;
  }
  
  /**
   * Draw additional info (algorithm name, etc.)
   */
  drawInfo() {
    if (this.infoPanel) {
      this.infoPanel.textContent = this.algorithmName || 'Sorting Visualizer';
    }
  }
  
  /**
   * Override draw to include algorithm name
   */
  draw() {
    super.draw();
    this.drawInfo();
  }
}

/**
 * Specialized visualizer for tree structures
 */
class TreeVisualizer {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.root = null;
    this.options = {
      nodeRadius: 20,
      levelHeight: 80,
      ...options
    };
    this.highlights = new Set(); // nodes to highlight
  }
  
  /**
   * Set the tree root
   * @param {Object} root - Root node of the tree
   */
  setRoot(root) {
    this.root = root;
    this.draw();
  }
  
  /**
   * Highlight a node
   * @param {Object} node - Node to highlight
   */
  highlightNode(node) {
    this.highlights.add(node);
    this.draw();
  }
  
  /**
   * Unhighlight a node
   * @param {Object} node - Node to unhighlight
   */
  unhighlightNode(node) {
    this.highlights.delete(node);
    this.draw();
  }
  
  /**
   * Clear all highlights
   */
  clearHighlights() {
    this.highlights.clear();
    this.draw();
  }
  
  /**
   * Draw the tree
   */
  draw() {
    if (!this.root) return;
    
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    this.ctx.clearRect(0, 0, width, height);
    
    // Draw tree recursively
    this.drawNode(this.root, width / 2, 50, width / 4);
  }
  
  /**
   * Draw a node and its children
   * @param {Object} node - Node to draw
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} offset - Horizontal offset for children
   */
  drawNode(node, x, y, offset) {
    if (!node) return;
    
    // Draw left child
    if (node.left) {
      this.ctx.strokeStyle = this.highlights.has(node.left) ? '#ff9f1c' : '#666666';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + this.options.nodeRadius);
      this.ctx.lineTo(x - offset, y + this.options.levelHeight - this.options.nodeRadius);
      this.ctx.stroke();
      
      this.drawNode(node.left, x - offset, y + this.options.levelHeight, offset / 2);
    }
    
    // Draw right child
    if (node.right) {
      this.ctx.strokeStyle = this.highlights.has(node.right) ? '#ff9f1c' : '#666666';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + this.options.nodeRadius);
      this.ctx.lineTo(x + offset, y + this.options.levelHeight - this.options.nodeRadius);
      this.ctx.stroke();
      
      this.drawNode(node.right, x + offset, y + this.options.levelHeight, offset / 2);
    }
    
    // Draw node
    this.ctx.fillStyle = this.highlights.has(node) ? '#ff9f1c' : '#4cc9f0';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.options.nodeRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw node value
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(node.value, x, y);
  }
}

// Export for global use
window.visualizer = {
  ArrayVisualizer,
  SortingVisualizer,
  TreeVisualizer
};
