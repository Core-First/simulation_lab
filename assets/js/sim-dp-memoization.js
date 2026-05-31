// DP Memoization Simulation - Fibonacci Sequence
// Extracted from sim-15-dp-memoization.html

window.initDPMemoizationSimulation = function() {
    const state = {
        n: 5,
        max: 100,
        memo: [],
        memoEnabled: true,
        callCount: 0,
        memoHits: 0,
        currentStep: 0,
        isPlaying: false,
        speed: 1.5,
        steps: [],
        treeNodes: [],
        currentNode: null,
        codeErrors: [],
        originalCode: ''
    };

    const treeSvg = document.getElementById('treeSvg');
    const codeEditor = document.getElementById('codeEditor');
    const btnStep = document.getElementById('btnStep');
    const btnPlay = document.getElementById('btnPlay');
    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');
    const memoToggle = document.getElementById('memoToggle');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const callCountEl = document.getElementById('callCount');
    const memoHitsEl = document.getElementById('memoHits');
    const inputN = document.getElementById('inputN');
    const inputMax = document.getElementById('inputMax');
    const errorPanel = document.getElementById('errorPanel');
    const editorStatusDot = document.getElementById('editorStatusDot');
    const editorStatusText = document.getElementById('editorStatusText');
    const themeToggleBtn = document.getElementById('themeToggle');
    const executionDesc = document.getElementById('executionDesc');

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        } else {
            document.body.classList.remove('light-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        }
    }

    const originalCCode = `<span class="code-line" data-line="1" data-line-num="1"><span class="code-preproc">#include</span> <span class="code-number">&lt;stdio.h&gt;</span></span>
<span class="code-line" data-line="2" data-line-num="2"><span class="code-macro">#define</span> <span class="code-type">MAX</span> <span class="code-number">100</span></span>
<span class="code-line" data-line="3" data-line-num="3"></span>
<span class="code-line" data-line="4" data-line-num="4"><span class="code-type">int</span> <span class="code-keyword">memo</span>[<span class="code-type">MAX</span>];</span>
<span class="code-line" data-line="5" data-line-num="5"></span>
<span class="code-line" data-line="6" data-line-num="6"><span class="code-type">void</span> <span class="code-func">init_memo</span>() {</span>
<span class="code-line" data-line="7" data-line-num="7" style="padding-left:20px;"><span class="code-keyword">for</span> (<span class="code-type">int</span> i = <span class="code-number">0</span>; i < <span class="code-type">MAX</span>; i++) <span class="code-keyword">memo</span>[i] = <span class="code-number">-1</span>;</span>
<span class="code-line" data-line="8" data-line-num="8">}</span>
<span class="code-line" data-line="9" data-line-num="9"></span>
<span class="code-line" data-line="10" data-line-num="10"><span class="code-type">int</span> <span class="code-func">fib</span>(<span class="code-type">int</span> n) {</span>
<span class="code-line" data-line="11" data-line-num="11" style="padding-left:20px;"><span class="code-keyword">if</span> (n <= <span class="code-number">1</span>) <span class="code-keyword">return</span> n;</span>
<span class="code-line" data-line="12" data-line-num="12" style="padding-left:20px;"><span class="code-keyword">if</span> (<span class="code-keyword">memo</span>[n] != <span class="code-number">-1</span>) <span class="code-keyword">return</span> <span class="code-keyword">memo</span>[n];</span>
<span class="code-line" data-line="13" data-line-num="13" style="padding-left:20px;"><span class="code-keyword">memo</span>[n] = <span class="code-func">fib</span>(n-<span class="code-number">1</span>) + <span class="code-func">fib</span>(n-<span class="code-number">2</span>);</span>
<span class="code-line" data-line="14" data-line-num="14" style="padding-left:20px;"><span class="code-keyword">return</span> <span class="code-keyword">memo</span>[n];</span>
<span class="code-line" data-line="15" data-line-num="15">}</span>`;

    function initMemoArray() {
        state.memo = new Array(state.max).fill(-1);
    }

    const memoHeaderRow = document.getElementById('memoHeaderRow');
    const memoValueRow = document.getElementById('memoValueRow');

    function buildMemoTable() {
        const n = state.n;
        memoHeaderRow.innerHTML = '<th>Index (i)</th>';
        for (let i = 0; i <= n; i++) {
            const th = document.createElement('th');
            th.textContent = i;
            memoHeaderRow.appendChild(th);
        }
        memoValueRow.innerHTML = '<th style="background:#1e293b; color:var(--muted);">memo[i]</th>';
        for (let i = 0; i <= n; i++) {
            const td = document.createElement('td');
            td.id = `memo-${i}`;
            td.textContent = '-1';
            memoValueRow.appendChild(td);
        }
    }

    function validateCCode(htmlContent) {
        const errors = [];
        const warnings = [];
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        
        if (!plainText.includes('#include')) {
            errors.push({ line: 1, type: 'error', message: 'Missing #include directive' });
        }
        
        if (!plainText.includes('#define')) {
            warnings.push({ line: 2, type: 'warning', message: 'Missing #define directive for MAX' });
        }
        
        if (!plainText.includes('memo[')) {
            errors.push({ line: 4, type: 'error', message: 'Missing memo array declaration' });
        }
        
        if (!plainText.includes('init_memo')) {
            warnings.push({ line: 6, type: 'warning', message: 'Missing init_memo function' });
        }
        
        if (!plainText.includes('fib(')) {
            errors.push({ line: 10, type: 'error', message: 'Missing fib function' });
        }
        
        if (!plainText.includes('return')) {
            errors.push({ line: 11, type: 'error', message: 'Missing return statement' });
        }
        
        if (plainText.match(/if\s*\(/g) && !plainText.match(/if\s*\([^)]*\)\s*{/g)) {
            warnings.push({ line: 11, type: 'warning', message: 'if statement may be missing opening brace' });
        }
        
        if (plainText.includes('memo[n]') && !plainText.includes('memo[n] != -1')) {
            warnings.push({ line: 12, type: 'warning', message: 'Memo check may be missing -1 comparison' });
        }
        
        const openBraces = (plainText.match(/{/g) || []).length;
        const closeBraces = (plainText.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            errors.push({ line: 0, type: 'error', message: `Unbalanced braces: ${openBraces} opening, ${closeBraces} closing` });
        }
        
        const openParens = (plainText.match(/\(/g) || []).length;
        const closeParens = (plainText.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            errors.push({ line: 0, type: 'error', message: `Unbalanced parentheses: ${openParens} opening, ${closeParens} closing` });
        }
        
        return { errors, warnings };
    }

    function updateErrorDisplay(validation) {
        const { errors, warnings } = validation;
        state.codeErrors = [...errors, ...warnings];
        
        if (errors.length > 0) {
            editorStatusDot.className = 'status-dot invalid';
            editorStatusText.textContent = `${errors.length} error(s)`;
            editorStatusText.style.color = 'var(--danger)';
        } else if (warnings.length > 0) {
            editorStatusDot.className = 'status-dot warning';
            editorStatusText.textContent = `${warnings.length} warning(s)`;
            editorStatusText.style.color = 'var(--warning)';
        } else {
            editorStatusDot.className = 'status-dot valid';
            editorStatusText.textContent = 'Code is valid';
            editorStatusText.style.color = 'var(--success)';
        }
        
        errorPanel.innerHTML = '';
        if (errors.length === 0 && warnings.length === 0) {
            errorPanel.classList.remove('show');
        } else {
            errorPanel.classList.add('show');
            
            errors.forEach(err => {
                const div = document.createElement('div');
                div.className = 'error-item error';
                div.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> <span><strong>Line ${err.line}:</strong> ${err.message}</span>`;
                errorPanel.appendChild(div);
            });
            
            warnings.forEach(warn => {
                const div = document.createElement('div');
                div.className = 'error-item warning';
                div.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <span><strong>Line ${warn.line}:</strong> ${warn.message}</span>`;
                errorPanel.appendChild(div);
            });
        }
        
        document.querySelectorAll('.code-line').forEach(line => {
            line.classList.remove('error', 'warning');
        });
        
        errors.forEach(err => {
            const lineEl = document.querySelector(`.code-line[data-line="${err.line}"]`);
            if (lineEl) lineEl.classList.add('error');
        });
        
        warnings.forEach(warn => {
            const lineEl = document.querySelector(`.code-line[data-line="${warn.line}"]`);
            if (lineEl) lineEl.classList.add('warning');
        });
        
        const hasErrors = errors.length > 0;
        btnStep.disabled = hasErrors;
        btnPlay.disabled = hasErrors;
        btnReset.disabled = hasErrors;
    }

    function reapplySyntaxHighlighting() {
        const content = codeEditor.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        const lines = tempDiv.querySelectorAll('.code-line');
        lines.forEach(line => {
            let text = line.innerHTML;
            
            const keywords = ['int', 'void', 'if', 'else', 'for', 'while', 'return'];
            keywords.forEach(kw => {
                const regex = new RegExp(`\\b${kw}\\b`, 'g');
                text = text.replace(regex, `<span class="code-keyword">${kw}</span>`);
            });
            
            text = text.replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
            text = text.replace(/(#include|#define)/g, '<span class="code-preproc">$1</span>');
            text = text.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="code-func">$1</span>(');
            
            line.innerHTML = text;
        });
        
        codeEditor.innerHTML = tempDiv.innerHTML;
    }

    function handleCodeChange() {
        const validation = validateCCode(codeEditor.innerHTML);
        updateErrorDisplay(validation);
        
        setTimeout(() => {
            reapplySyntaxHighlighting();
        }, 100);
    }

    function generateSteps() {
        state.steps = [];
        state.callCount = 0;
        state.memoHits = 0;
        initMemoArray();
        
        const executionLog = [];
        
        function fib(n, depth = 0, path = []) {
            state.callCount++;
            const currentPath = [...path, n];
            
            executionLog.push({
                type: 'call',
                n: n,
                depth: depth,
                path: currentPath,
                line: 10,
                description: `fib(${n}) called`
            });

            if (n <= 1) {
                executionLog.push({
                    type: 'base',
                    n: n,
                    depth: depth,
                    path: currentPath,
                    line: 11,
                    value: n,
                    description: `Base case: fib(${n}) = ${n}`
                });
                return n;
            }

            executionLog.push({
                type: 'check_memo',
                n: n,
                depth: depth,
                path: currentPath,
                line: 12,
                description: `Checking memo[${n}]`
            });

            if (state.memoEnabled && state.memo[n] !== -1) {
                state.memoHits++;
                executionLog.push({
                    type: 'memo_hit',
                    n: n,
                    depth: depth,
                    path: currentPath,
                    line: 12,
                    value: state.memo[n],
                    description: `Cache hit! memo[${n}] = ${state.memo[n]}`
                });
                return state.memo[n];
            }

            executionLog.push({
                type: 'compute_left',
                n: n,
                depth: depth,
                path: currentPath,
                line: 13,
                description: `Computing left: fib(${n}-${1})`
            });

            const left = fib(n - 1, depth + 1, currentPath);

            executionLog.push({
                type: 'compute_right',
                n: n,
                depth: depth,
                path: currentPath,
                line: 13,
                description: `Computing right: fib(${n}-${2})`
            });

            const right = fib(n - 2, depth + 1, currentPath);

            const result = left + right;
            state.memo[n] = result;

            executionLog.push({
                type: 'store_memo',
                n: n,
                depth: depth,
                path: currentPath,
                line: 13,
                value: result,
                description: `Stored: memo[${n}] = ${left} + ${right} = ${result}`
            });

            executionLog.push({
                type: 'return',
                n: n,
                depth: depth,
                path: currentPath,
                line: 14,
                value: result,
                description: `Returning fib(${n}) = ${result}`
            });

            return result;
        }

        fib(state.n);
        state.steps = executionLog;
    }

    function resetSimulation() {
        state.currentStep = 0;
        state.isPlaying = false;
        initMemoArray();
        state.callCount = 0;
        state.memoHits = 0;
        state.treeNodes = [];
        state.currentNode = null;

        btnPlay.disabled = false;
        btnPause.disabled = true;
        btnStep.disabled = false;
        inputN.disabled = false;

        buildMemoTable();
        
        if (executionDesc) {
            executionDesc.textContent = 'Click "Step" or "Play" to begin visualization';
        }
        
        document.querySelectorAll('.code-line').forEach(line => {
            line.classList.remove('code-highlight');
        });

        treeSvg.innerHTML = '';

        callCountEl.textContent = '0';
        memoHitsEl.textContent = '0';

        generateSteps();

        drawTree();
    }

    function drawTree() {
        treeSvg.innerHTML = '';
        let maxDepth = 0;
        state.steps.forEach(step => {
            if (step.depth > maxDepth) maxDepth = step.depth;
        });
        const dynamicHeight = Math.max(320, 80 + maxDepth * 60);
        treeSvg.setAttribute('viewBox', '0 0 700 ' + dynamicHeight);
        treeSvg.style.height = dynamicHeight + 'px';

        const nodes = new Map();
        const childrenMap = new Map();

        const visited = new Set();

        state.steps.forEach(step => {
            const key = `${step.n}-${step.depth}`;
            if (!visited.has(key)) {
                visited.add(key);

                const node = { n: step.n, depth: step.depth };
                nodes.set(key, node);

                if (!childrenMap.has(step.depth)) {
                    childrenMap.set(step.depth, []);
                }
                childrenMap.get(step.depth).push(node);
            }
        });

        const levelWidth = 700;
        const levels = Array.from(childrenMap.entries()).sort((a, b) => a[0] - b[0]);

        levels.forEach(([depth, levelNodes]) => {
            const y = 50 + depth * 50;
            const siblingCount = levelNodes.length;
            levelNodes.forEach((node, index) => {
                const x = (levelWidth / (siblingCount + 1)) * (index + 1);
                node.x = x;
                node.y = y;
            });
        });

        const keyToNode = new Map();
        nodes.forEach((node, key) => keyToNode.set(key, node));

        nodes.forEach((node, key) => {
            if (node.depth > 0) {
                const parentKey = `${node.n + 1}-${node.depth - 1}`;
                const parent = keyToNode.get(parentKey);
                const grandparentParentKey = `${node.n + 2}-${node.depth - 1}`;
                const grandparentParent = keyToNode.get(grandparentParentKey);

                let parentNode = parent || grandparentParent;
                if (!parentNode && node.depth > 1) {
                    for (let i = node.depth - 1; i >= 0; i--) {
                        const potentialParent = keyToNode.get(`${node.n + 1}-${i}`);
                        if (potentialParent) {
                            parentNode = potentialParent;
                            break;
                        }
                    }
                }

                if (parentNode) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', parentNode.x);
                    line.setAttribute('y1', parentNode.y);
                    line.setAttribute('x2', node.x);
                    line.setAttribute('y2', node.y);
                    line.setAttribute('class', 'edge-line');
                    treeSvg.appendChild(line);
                }
            }
        });

        nodes.forEach((node, key) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', Math.max(18, 28 - node.depth * 2));
            circle.setAttribute('class', 'node-circle');
            circle.setAttribute('data-key', key);
            treeSvg.appendChild(circle);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y);
            text.setAttribute('class', 'node-text');
            text.setAttribute('style', `font-size: ${Math.max(10, 14 - node.depth)}px`);
            text.textContent = `fib(${node.n})`;
            treeSvg.appendChild(text);
        });

        state.treeNodes = nodes;
    }

    function updateVisualization() {
        if (state.currentStep >= state.steps.length) {
            state.isPlaying = false;
            btnPlay.disabled = false;
            btnPause.disabled = true;
            inputN.disabled = false;
            return;
        }

        const step = state.steps[state.currentStep];

        document.querySelectorAll('.code-line').forEach(line => {
            line.classList.remove('code-highlight');
            if (parseInt(line.dataset.line) === step.line) {
                line.classList.add('code-highlight');
            }
        });

        document.querySelectorAll('.node-circle').forEach(circle => {
            circle.classList.remove('node-current', 'node-computed', 'node-memo');
        });

        const currentKey = `${step.n}-${step.depth}`;
        const currentCircle = document.querySelector(`.node-circle[data-key="${currentKey}"]`);

        if (currentCircle) {
            if (step.type === 'memo_hit') {
                currentCircle.classList.add('node-memo');
            } else if (step.type === 'return' || step.type === 'base') {
                currentCircle.classList.add('node-computed');
            } else {
                currentCircle.classList.add('node-current');
            }
        }

        if (step.type === 'store_memo' || step.type === 'memo_hit' || step.type === 'base') {
            const cell = document.getElementById(`memo-${step.n}`);
            if (cell) {
                cell.textContent = step.value;
                cell.className = step.type === 'memo_hit' ? 'computed' : 'computing';
                setTimeout(() => {
                    cell.className = 'computed';
                }, 300);
            }
        }

        if (executionDesc && step.description) {
            executionDesc.textContent = step.description;
        }

        callCountEl.textContent = state.callCount;
        memoHitsEl.textContent = state.memoHits;
        callCountEl.classList.add('updated');
        memoHitsEl.classList.add('updated');
        setTimeout(() => {
            callCountEl.classList.remove('updated');
            memoHitsEl.classList.remove('updated');
        }, 300);
    }

    function stepForward() {
        if (state.currentStep < state.steps.length) {
            state.currentStep++;
            updateVisualization();
        }
    }

    function playSimulation() {
        state.isPlaying = true;
        btnPlay.disabled = true;
        btnPause.disabled = false;
        btnStep.disabled = true;
        inputN.disabled = true;

        const delay = 1000 / state.speed;

        function playStep() {
            if (!state.isPlaying) return;

            if (state.currentStep < state.steps.length) {
                stepForward();
                setTimeout(playStep, delay);
            } else {
                state.isPlaying = false;
                btnPlay.disabled = false;
                btnPause.disabled = true;
                btnStep.disabled = false;
                inputN.disabled = false;
            }
        }

        playStep();
    }

    function pauseSimulation() {
        state.isPlaying = false;
        btnPlay.disabled = false;
        btnPause.disabled = true;
        btnStep.disabled = false;
        inputN.disabled = false;
    }

    function setupEventListeners() {
        btnStep.addEventListener('click', stepForward);
        btnPlay.addEventListener('click', playSimulation);
        btnPause.addEventListener('click', pauseSimulation);
        btnReset.addEventListener('click', resetSimulation);

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
                localStorage.setItem('theme', next);
                applyTheme(next);
            });
        }

        const savedTheme = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        memoToggle.addEventListener('click', () => {
            state.memoEnabled = !state.memoEnabled;
            memoToggle.classList.toggle('active', state.memoEnabled);
            resetSimulation();
        });

        speedSlider.addEventListener('input', (e) => {
            state.speed = parseFloat(e.target.value);
            speedValue.textContent = `${state.speed}x`;
        });

        inputN.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            if (val >= 0 && val <= 10) {
                state.n = val;
                resetSimulation();
            } else {
                e.target.value = state.n;
            }
        });

        codeEditor.addEventListener('input', handleCodeChange);
        codeEditor.addEventListener('blur', handleCodeChange);

        codeEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.execCommand('insertLineBreak');
            }
        });
    }

    initMemoArray();
    codeEditor.innerHTML = originalCCode;
    state.originalCode = originalCCode;
    generateSteps();
    resetSimulation();
    setupEventListeners();
};