// AI Assistant for Simulations

/**
 * AI Assistant that provides hints and explanations for algorithms
 */
class AIAssistant {
  constructor(options = {}) {
    this.options = {
      apiEndpoint: options.apiEndpoint || '', // For future API integration
      hintsEnabled: true,
      explanationsEnabled: true,
      ...options
    };
    
    this.chatHistory = [];
    this.isProcessing = false;
  }
  
  /**
   * Add a message to the chat history
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   */
  addMessage(role, content) {
    this.chatHistory.push({ role, content, timestamp: new Date() });
  }
  
  /**
   * Get a hint for the current algorithm state
   * @param {Object} state - Current state of the algorithm
   * @returns {Promise<string>} Hint message
   */
  async getHint(state) {
    if (!this.options.hintsEnabled) {
      return Promise.resolve('Hints are disabled.');
    }
    
    // Add user message
    this.addMessage('user', `Requesting hint for state: ${JSON.stringify(state)}`);
    
    // For now, provide static hints based on algorithm type
    // In a real implementation, this would call an AI API
    const hint = this.generateStaticHint(state);
    
    // Add assistant message
    this.addMessage('assistant', hint);
    
    return Promise.resolve(hint);
  }
  
  /**
   * Get an explanation for the current algorithm step
   * @param {Object} step - Current step information
   * @returns {Promise<string>} Explanation message
   */
  async getExplanation(step) {
    if (!this.options.explanationsEnabled) {
      return Promise.resolve('Explanations are disabled.');
    }
    
    // Add user message
    this.addMessage('user', `Requesting explanation for step: ${JSON.stringify(step)}`);
    
    // Generate static explanation
    const explanation = this.generateStaticExplanation(step);
    
    // Add assistant message
    this.addMessage('assistant', explanation);
    
    return Promise.resolve(explanation);
  }
  
  /**
   * Generate a static hint based on algorithm type
   * @param {Object} state - Current state
   * @returns {string} Hint message
   */
  generateStaticHint(state) {
    const { algorithm, array, index, value } = state || {};
    
    switch (algorithm) {
      case 'bubbleSort':
        if (index < array.length - 1) {
          return `Compare elements at index ${index} (${array[index]}) and ${index + 1} (${array[index + 1]}). Swap if the first is greater than the second.`;
        }
        break;
        
      case 'selectionSort':
        return `Find the minimum element in the unsorted portion (from index ${index} to end) and swap it with the element at index ${index}.`;
        
      case 'insertionSort':
        if (index > 0) {
          return `Insert the value ${value} into the sorted portion [0..${index - 1}] by shifting larger elements to the right.`;
        }
        break;
        
      case 'mergeSort':
        return `Merge the two sorted subarrays: left [${state.left}] and right [${state.right}].`;
        
      case 'quickSort':
        if (state.partitionIndex !== undefined) {
          return `Partition the array around pivot ${state.pivot}. Elements less than pivot go left, greater go right.`;
        }
        return `Select a pivot and partition the array.`;
        
      case 'linearSearch':
        return `Check if the element at index ${index} (${array[index]}) equals the target ${value}.`;
        
      case 'binarySearch':
        if (array.length > 0) {
          const mid = Math.floor((state.low + state.high) / 2);
          return `Compare middle element (index ${mid}, value ${array[mid]}) with target ${value}. Search the ${array[mid] > value ? 'left' : 'right'} half.`;
        }
        break;
        
      default:
        return `Think about the next logical step in the ${algorithm} algorithm.`;
    }
    
    return 'Consider what the algorithm should do next based on its rules.';
  }
  
  /**
   * Generate a static explanation based on step
   * @param {Object} step - Step information
   * @returns {string} Explanation message
   */
  generateStaticExplanation(step) {
    const { algorithm, action, details } = step || {};
    
    switch (algorithm) {
      case 'bubbleSort':
        if (action === 'compare') {
          return `Comparing ${details.a} and ${details.b}. If ${details.a} > ${details.b}, we swap them to move larger elements toward the end.`;
        }
        if (action === 'swap') {
          return `Swapped ${details.a} and ${details.b} because ${details.a} was greater than ${details.b}.`;
        }
        if (action === 'passComplete') {
          return `Completed pass ${details.pass}. The largest ${details.pass} elements are now in their correct positions at the end.`;
        }
        break;
        
      case 'selectionSort':
        if (action === 'findMin') {
          return `Scanning unsorted portion to find the minimum value. Current minimum is ${details.min} at index ${details.minIndex}.`;
        }
        if (action === 'swap') {
          return `Swapped the minimum value ${details.min} (index ${details.minIndex}) with the first unsorted element ${details.first} (index ${details.firstIndex}).`;
        }
        break;
        
      case 'insertionSort':
        if (action === 'insert') {
          return `Inserting ${details.value} into the sorted portion. Shifted ${details.shiftedCount} elements to the right to make space.`;
        }
        if (action === 'compare') {
          return `Comparing ${details.value} with ${details.compared} to find the correct insertion position.`;
        }
        break;
        
      case 'mergeSort':
        if (action === 'merge') {
          return `Merging two sorted subarrays: [${details.left}] and [${details.right}] into [${details.merged}].`;
        }
        if (action === 'split') {
          return `Splitting array [${details.array}] into left [${details.left}] and right [${details.right}].`;
        }
        break;
        
      case 'quickSort':
        if (action === 'partition') {
          return `Partitioning around pivot ${details.pivot}. Elements < ${details.pivot} go left, > ${details.pivot} go right.`;
        }
        if (action === 'recurse') {
          return `Recursively sorting left partition [${details.left}] and right partition [${details.right}].`;
        }
        break;
        
      default:
        return `Executing action '${action}' in the ${algorithm} algorithm. ${details || ''}`;
    }
    
    return `Step: ${action}. Details: ${JSON.stringify(details)}`;
  }
  
  /**
   * Clear chat history
   */
  clearHistory() {
    this.chatHistory = [];
  }
  
  /**
   * Get chat history
   * @returns {Array} Copy of chat history
   */
  getHistory() {
    return [...this.chatHistory];
  }
}

// Export for global use
window.AIAssistant = AIAssistant;
