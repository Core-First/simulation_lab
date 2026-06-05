// code-sync.js – Exposes CodeSync as a global for inline <script> blocks
class CodeSync {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.lines = [];
  }

  highlightJS(code) {
    // Escape HTML first
    let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // 1. Comments: // ...
    const commentMap = {};
    let commentCount = 0;
    escaped = escaped.replace(/(\/\/.*)/g, (match) => {
      const key = `COMMENTPLACEHOLDER${String.fromCharCode(65 + commentCount++)}`;
      commentMap[key] = match;
      return key;
    });

    // 2. Strings: '...' or "..." or `...`
    const stringMap = {};
    let stringCount = 0;
    escaped = escaped.replace(/(['"`])(.*?)\1/g, (match) => {
      const key = `STRINGPLACEHOLDER${String.fromCharCode(65 + stringCount++)}`;
      stringMap[key] = match;
      return key;
    });

    // 3. Function names (after function keyword, or before paren)
    escaped = escaped.replace(/\b(function\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)/g, '$1<span class="code-func">$2</span>');
    escaped = escaped.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\()/g, '<span class="code-func">$1</span>');

    // 4. Keywords: let, const, var, function, return, for, while, if, else, break, continue
    const keywords = /\b(let|const|var|function|return|for|while|if|else|break|continue)\b/g;
    escaped = escaped.replace(keywords, '<span class="code-keyword">$1</span>');

    // 5. Numbers
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');

    // 6. Restore strings and comments with proper spans
    for (const key in stringMap) {
      escaped = escaped.replace(key, `<span class="code-string">${stringMap[key]}</span>`);
    }
    for (const key in commentMap) {
      escaped = escaped.replace(key, `<span class="code-comment">${commentMap[key]}</span>`);
    }

    return escaped;
  }

  init(codeString) {
    if (!this.container || !codeString) return;
    
    // Highlight the entire code block first
    const highlightedCode = this.highlightJS(codeString.trim());
    
    // Split into lines
    const rawLines = highlightedCode.split(/\n/);
    
    this.container.innerHTML = rawLines
      .map((ln, i) =>
        `<pre class="code-line" data-line="${i}"><span class="code-line-num">${i + 1}</span>${ln}</pre>`
      )
      .join('');
    this.lines = this.container.querySelectorAll('.code-line');
  }

  highlight(lineIdx) {
    this.lines.forEach(l => l.classList.remove('code-highlight'));
    if (lineIdx >= 0 && lineIdx < this.lines.length) {
      this.lines[lineIdx].classList.add('code-highlight');
      this.lines[lineIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  clearHighlight() {
    this.lines.forEach(l => l.classList.remove('code-highlight'));
  }
}
// Make available globally
window.CodeSync = CodeSync;
