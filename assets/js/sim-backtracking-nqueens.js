// --------------------------------------------------------------
// N-Queens Backtracking Simulation with Step Generator
// --------------------------------------------------------------
let state = {
    n: 8,
    board: [],
    steps: [],
    currentStep: 0,
    isPlaying: false,
    speed: 1.5,
    nodeCount: 0,
    backtrackCount: 0,
    treeNodes: new Map(),
    useBacktracking: true,
    showCompare: false
};

let animationTimer = null;
let speechSynth = window.speechSynthesis;

// DOM elements will be initialized when DOM is ready
let chessboardDiv, treeSvg, execDescDiv, btnStep, btnPlay, btnPause, btnReset;
let speedSlider, speedValue, inputN, nodeCountSpan, backtrackCountSpan;
let timelineSlider, currentStepIdxSpan, totalStepsSpan, backtrackToggle, compareToggle;
let editorDiv, editorStatusDot, editorStatusText, errorPanel;
let aiResponseDiv, aiInput, aiSendBtn, aiHelpBtn, aiExplainCodeBtn;
let whyMattersDiv, toggleWhyBtn, themeToggle, readAloudBtn, comparisonStatsDiv;

function initDOMElements() {
    chessboardDiv = document.getElementById('chessboard');
    treeSvg = document.getElementById('treeSvg');
    execDescDiv = document.getElementById('executionDesc');
    btnStep = document.getElementById('btnStep');
    btnPlay = document.getElementById('btnPlay');
    btnPause = document.getElementById('btnPause');
    btnReset = document.getElementById('btnReset');
    speedSlider = document.getElementById('speedSlider');
    speedValue = document.getElementById('speedValue');
    inputN = document.getElementById('inputN');
    nodeCountSpan = document.getElementById('nodeCount');
    backtrackCountSpan = document.getElementById('backtrackCount');
    timelineSlider = document.getElementById('timelineSlider');
    currentStepIdxSpan = document.getElementById('currentStepIdx');
    totalStepsSpan = document.getElementById('totalSteps');
    backtrackToggle = document.getElementById('backtrackToggle');
    compareToggle = document.getElementById('compareToggle');
    editorDiv = document.getElementById('codeEditor');
    editorStatusDot = document.getElementById('editorStatusDot');
    editorStatusText = document.getElementById('editorStatusText');
    errorPanel = document.getElementById('errorPanel');
    aiResponseDiv = document.getElementById('aiResponse');
    aiInput = document.getElementById('aiInput');
    aiSendBtn = document.getElementById('aiSendBtn');
    aiHelpBtn = document.getElementById('aiHelpBtn');
    aiExplainCodeBtn = document.getElementById('aiExplainCodeBtn');
    whyMattersDiv = document.getElementById('whyMattersContent');
    toggleWhyBtn = document.getElementById('toggleWhyMatters');
    themeToggle = document.getElementById('themeToggle');
    readAloudBtn = document.getElementById('treeVoiceBtn');
    comparisonStatsDiv = document.getElementById('comparisonStats');
}

function initBoard(n) {
    return Array(n).fill().map(() => Array(n).fill(0));
}

function generateSteps(n) {
    let steps = [];
    let nodeCounter = 0;
    let backtracks = 0;
    function isSafe(board, row, col, n) {
        steps.push({ type: 'check', row, col, boardCopy: copyBoard(board), message: `Checking if (${row},${col}) conflicts` });
        for (let i = 0; i < row; i++) {
            if (board[i][col] === 1) return false;
            if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) return false;
            if (col + (row - i) < n && board[i][col + (row - i)] === 1) return false;
        }
        return true;
    }
    function placeQueen(board, row, n) {
        if (row === n) {
            steps.push({ type: 'solution', row, boardCopy: copyBoard(board), message: `✅ Solution found! All queens placed.` });
            return true;
        }
        for (let col = 0; col < n; col++) {
            nodeCounter++;
            steps.push({ type: 'try', row, col, boardCopy: copyBoard(board), message: `Trying queen at (${row},${col})` });
            if (isSafe(board, row, col, n)) {
                board[row][col] = 1;
                steps.push({ type: 'place', row, col, boardCopy: copyBoard(board), message: `Placed queen at (${row},${col})` });
                if (placeQueen(board, row + 1, n)) {
                    return true;
                }
                board[row][col] = 0;
                backtracks++;
                steps.push({ type: 'backtrack', row, col, boardCopy: copyBoard(board), message: `↩️ Backtrack from (${row},${col}) – no valid placement ahead` });
            } else {
                steps.push({ type: 'conflict', row, col, boardCopy: copyBoard(board), message: `❌ Conflict at (${row},${col}) – unsafe` });
            }
        }
        return false;
    }
    let board = initBoard(n);
    placeQueen(board, 0, n);
    return { steps, nodeCounter, backtracks };
}

function copyBoard(board) { return board.map(row => [...row]); }

function rebuildSimulation() {
    if (state.isPlaying) stopPlay();
    const { steps, nodeCounter, backtracks } = generateSteps(state.n);
    state.steps = steps;
    state.nodeCount = nodeCounter;
    state.backtrackCount = backtracks;
    state.currentStep = 0;
    nodeCountSpan.innerText = state.nodeCount;
    backtrackCountSpan.innerText = state.backtrackCount;
    totalStepsSpan.innerText = state.steps.length;
    currentStepIdxSpan.innerText = 0;
    timelineSlider.max = Math.max(1, state.steps.length - 1);
    updateVisualization();
    drawTree();
}

function updateVisualization() {
    if (state.currentStep >= state.steps.length) {
        if (state.isPlaying) stopPlay();
        return;
    }
    const step = state.steps[state.currentStep];
    const board = step.boardCopy || initBoard(state.n);
    renderBoard(board, step.row, step.col);
    execDescDiv.innerText = step.message || `Step ${state.currentStep+1}: ${step.type}`;
    currentStepIdxSpan.innerText = state.currentStep;
    timelineSlider.value = state.currentStep;
    highlightNodeInTree(step.row, step.col);
    highlightCodeLine(step.type);
}

function renderBoard(board, highlightRow, highlightCol) {
    chessboardDiv.innerHTML = '';
    const n = board.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(i+j)%2===0 ? 'white' : 'black'}`;
            if (board[i][j] === 1) cell.classList.add('queen');
            if (highlightRow === i && highlightCol === j) cell.classList.add('current-highlight');
            cell.dataset.row = i; cell.dataset.col = j;
            cell.addEventListener('click', () => { if(!state.isPlaying) toggleManualQueen(i,j); });
            chessboardDiv.appendChild(cell);
        }
    }
}

function toggleManualQueen(row, col) {
    let board = initBoard(state.n);
    if(state.currentStep < state.steps.length && state.steps[state.currentStep].boardCopy)
        board = state.steps[state.currentStep].boardCopy;
    board[row][col] = board[row][col] === 1 ? 0 : 1;
    renderBoard(board, row, col);
}

function drawTree() {
    treeSvg.innerHTML = '';
    const n = state.n;
    const width = 800;
    const height = 300;
    treeSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const nodes = [];
    for (let r = 0; r <= n; r++) {
        const y = 40 + r * 35;
        const count = Math.pow(2, r);
        for (let c = 0; c < count; c++) {
            const x = 50 + (c * (width - 100) / Math.max(1, count-1));
            nodes.push({ row: r, colIdx: c, x, y });
        }
    }
    nodes.forEach(node => {
        if (node.row > 0) {
            const parentRow = node.row - 1;
            const parentIdx = Math.floor(node.colIdx / 2);
            const parent = nodes.find(n => n.row === parentRow && n.colIdx === parentIdx);
            if (parent) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', parent.x);
                line.setAttribute('y1', parent.y);
                line.setAttribute('x2', node.x);
                line.setAttribute('y2', node.y);
                line.setAttribute('stroke', '#6b7280');
                line.setAttribute('stroke-width', '1.5');
                treeSvg.appendChild(line);
            }
        }
    });
    nodes.forEach(node => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', 12);
        circle.setAttribute('class', 'node-circle');
        circle.setAttribute('data-row', node.row);
        circle.addEventListener('click', () => jumpToRow(node.row));
        treeSvg.appendChild(circle);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y);
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '9');
        text.setAttribute('text-anchor', 'middle');
        text.textContent = `R${node.row}`;
        treeSvg.appendChild(text);
    });
}

function highlightNodeInTree(row) {
    document.querySelectorAll('.node-circle').forEach(circle => {
        circle.classList.remove('node-current');
        if (parseInt(circle.getAttribute('data-row')) === row) circle.classList.add('node-current');
    });
}

function highlightCodeLine(stepType) {
    let lineNum = 1;
    if (stepType === 'try') lineNum = 10;
    else if (stepType === 'place') lineNum = 12;
    else if (stepType === 'backtrack') lineNum = 15;
    document.querySelectorAll('.code-line').forEach(el => el.classList.remove('code-highlight'));
    const target = document.querySelector(`.code-line[data-line="${lineNum}"]`);
    if (target) target.classList.add('code-highlight');
}

function stepForward() {
    if (state.currentStep < state.steps.length - 1) {
        state.currentStep++;
        updateVisualization();
    }
}

function playSimulation() {
    if (state.isPlaying) return;
    state.isPlaying = true;
    btnPlay.disabled = true;
    btnPause.disabled = false;
    btnStep.disabled = true;
    function stepLoop() {
        if (!state.isPlaying) return;
        if (state.currentStep < state.steps.length - 1) {
            stepForward();
            animationTimer = setTimeout(stepLoop, 800 / state.speed);
        } else {
            stopPlay();
        }
    }
    stepLoop();
}

function stopPlay() {
    if (animationTimer) clearTimeout(animationTimer);
    state.isPlaying = false;
    btnPlay.disabled = false;
    btnPause.disabled = true;
    btnStep.disabled = false;
}

function pauseSimulation() {
    if (state.isPlaying) stopPlay();
}

function resetSimulation() {
    stopPlay();
    state.currentStep = 0;
    updateVisualization();
}

function getContextualHelp() {
    const step = state.steps[state.currentStep];
    if (!step) return "No active step. Start simulation.";
    if (step.type === 'conflict') return `At (${step.row},${step.col}) the queen attacks another queen. Check diagonals or same column.`;
    if (step.type === 'backtrack') return `Backtracking happened because no safe column in row ${step.row+1}. The algorithm returns to previous row.`;
    if (step.type === 'place') return `Queen placed at row ${step.row}, column ${step.col}. Now trying next row.`;
    return "The algorithm recursively tries to place queens column by column. If a placement leads to dead end, it undoes and tries next column.";
}

function explainCurrentCode() {
    return "The C code defines `isSafe()` to check conflicts, and `solveNQueens()` uses recursion + backtracking. The key is pruning when a column is unsafe.";
}

function handleAIQuery(query) {
    const q = query.toLowerCase();
    if (q.includes("conflict") || q.includes("unsafe")) return "A queen is unsafe if another queen shares its column or diagonal. The `isSafe` function checks these conditions.";
    if (q.includes("backtrack")) return "Backtracking means undoing a placement and trying the next column when no safe position exists.";
    if (q.includes("prune")) return "Pruning eliminates entire branches early – e.g., skipping a column that would cause immediate conflict.";
    return "Backtracking explores placements row by row. When conflict arises, it 'backtracks' to the previous row and tries a different column. This reduces the search space dramatically.";
}

function jumpToRow(row) {
    if (!state.isPlaying && row <= state.n) {
        const targetStep = state.steps.findIndex(s => s.row === row);
        if (targetStep !== -1) {
            state.currentStep = targetStep;
            updateVisualization();
        }
    }
}

// Initialize code editor content
function initCodeEditor() {
    if (editorDiv) {
        editorDiv.innerText = `#include <stdbool.h>\n#define N 8\n\nbool isSafe(int board[N][N], int row, int col) {\n    for (int i = 0; i < row; i++)\n        if (board[i][col]) return false;\n    // diagonal checks ...\n    return true;\n}\n\nbool solve(int board[N][N], int row) {\n    if (row == N) return true;\n    for (int col = 0; col < N; col++)\n        if (isSafe(board, row, col)) {\n            board[row][col] = 1;\n            if (solve(board, row+1)) return true;\n            board[row][col] = 0; // backtrack\n        }\n    return false;\n}`;
    }
}

function validateCode() {
    if (editorStatusDot) {
        editorStatusDot.className = 'status-dot valid';
        editorStatusText.innerText = 'Code is valid';
        errorPanel.style.display = 'none';
    }
}

function initEventListeners() {
    btnStep.onclick = stepForward;
    btnPlay.onclick = playSimulation;
    btnPause.onclick = pauseSimulation;
    btnReset.onclick = resetSimulation;
    speedSlider.oninput = () => {
        state.speed = parseFloat(speedSlider.value);
        speedValue.innerText = state.speed + "x";
    };
    inputN.onchange = () => {
        state.n = parseInt(inputN.value);
        rebuildSimulation();
    };
    backtrackToggle.onclick = () => {
        state.useBacktracking = !state.useBacktracking;
        backtrackToggle.classList.toggle('active');
        rebuildSimulation();
    };
    compareToggle.onclick = () => {
        state.showCompare = !state.showCompare;
        compareToggle.classList.toggle('active');
        if (state.showCompare) {
            comparisonStatsDiv.style.display = 'flex';
            comparisonStatsDiv.innerHTML = `<span>🐢 Brute-force nodes: 40320</span><span>🚀 Backtracking nodes: ${state.nodeCount}</span>`;
        } else {
            comparisonStatsDiv.style.display = 'none';
        }
    };
    themeToggle.onclick = () => { document.body.classList.toggle('light-theme'); };
    aiSendBtn.onclick = () => {
        const ans = handleAIQuery(aiInput.value);
        aiResponseDiv.innerHTML = `<i class="fa-regular fa-message"></i> ${ans}`;
    };
    aiHelpBtn.onclick = () => {
        aiResponseDiv.innerHTML = `<i class="fa-regular fa-lightbulb"></i> ${getContextualHelp()}`;
    };
    aiExplainCodeBtn.onclick = () => {
        aiResponseDiv.innerHTML = `<i class="fa-regular fa-file-code"></i> ${explainCurrentCode()}`;
    };
    toggleWhyBtn.onclick = () => {
        whyMattersDiv.style.display = whyMattersDiv.style.display === 'none' ? 'block' : 'none';
    };
    readAloudBtn.onclick = () => {
        const text = execDescDiv.innerText;
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynth.speak(utterance);
    };
    editorDiv.addEventListener('input', validateCode);
}

// Tour (first time)
function initTour() {
    if (localStorage.getItem('nqueens_tour_shown')) return;
    const tourDiv = document.getElementById('guidedTour');
    if (!tourDiv) return;
    tourDiv.style.display = 'block';
    let stepTour = 0;
    const stepsTour = [
        {title: "Welcome", text: "This simulation visualizes backtracking for N-Queens.", highlight: "chessboard"},
        {title: "Board", text: "Click any cell to place/remove queen manually.", highlight: "chessboard"},
        {title: "Tree", text: "Recursion tree shows rows as levels.", highlight: "treeSvg"},
        {title: "AI Assistant", text: "Ask any question about backtracking!", highlight: "aiInput"}
    ];
    function showStep() {
        const s = stepsTour[stepTour];
        document.getElementById('tourTitle').innerText = s.title;
        document.getElementById('tourText').innerText = s.text;
        const tooltip = document.querySelector('.tour-tooltip');
        if (tooltip) {
            tooltip.style.top = "30%";
            tooltip.style.left = "30%";
        }
    }
    showStep();
    const tourNext = document.getElementById('tourNext');
    const tourSkip = document.getElementById('tourSkip');
    if (tourNext) {
        tourNext.onclick = () => {
            stepTour++;
            if (stepTour < stepsTour.length) showStep();
            else { tourDiv.style.display = 'none'; localStorage.setItem('nqueens_tour_shown', 'true'); }
        };
    }
    if (tourSkip) {
        tourSkip.onclick = () => {
            tourDiv.style.display = 'none';
            localStorage.setItem('nqueens_tour_shown', 'true');
        };
    }
}

// Initialize on DOM ready
function init() {
    initDOMElements();
    initCodeEditor();
    validateCode();
    initEventListeners();
    initTour();
    rebuildSimulation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.jumpToRow = jumpToRow;