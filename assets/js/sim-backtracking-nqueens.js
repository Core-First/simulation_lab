// --------------------------------------------------------------
// Production-Grade Self-Guided Backtracking Simulation Core
// --------------------------------------------------------------
let state = {
  n: 8,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1.5,
  nodeCount: 0,
  backtrackCount: 0,
  treeNodes: {},
  showCompare: false,
};

let animationTimer = null;
let speechSynth = window.speechSynthesis;

// Element Reference Cache
let chessboardDiv, treeSvg, execDescDiv, btnStep, btnPlay, btnPause, btnReset;
let speedSlider, speedValue, inputN, nodeCountSpan, backtrackCountSpan;
let timelineSlider,
  currentStepIdxSpan,
  totalStepsSpan,
  compareToggle,
  comparisonStatsDiv;
let editorDiv,
  themeToggle,
  readAloudBtn,
  aiResponseDiv,
  aiInput,
  aiSendBtn,
  aiHelpBtn,
  aiExplainCodeBtn;

function initDOMElements() {
  chessboardDiv = document.getElementById("chessboard");
  treeSvg = document.getElementById("treeSvg");
  execDescDiv = document.getElementById("executionDesc");
  btnStep = document.getElementById("btnStep");
  btnPlay = document.getElementById("btnPlay");
  btnPause = document.getElementById("btnPause");
  btnReset = document.getElementById("btnReset");
  speedSlider = document.getElementById("speedSlider");
  speedValue = document.getElementById("speedValue");
  inputN = document.getElementById("inputN");
  nodeCountSpan = document.getElementById("nodeCount");
  backtrackCountSpan = document.getElementById("backtrackCount");
  timelineSlider = document.getElementById("timelineSlider");
  currentStepIdxSpan = document.getElementById("currentStepIdx");
  totalStepsSpan = document.getElementById("totalSteps");
  compareToggle = document.getElementById("compareToggle");
  editorDiv = document.getElementById("codeEditor");
  themeToggle = document.getElementById("themeToggle");
  readAloudBtn = document.getElementById("treeVoiceBtn");
  comparisonStatsDiv = document.getElementById("comparisonStats");
  aiResponseDiv = document.getElementById("aiResponse");
  aiInput = document.getElementById("aiInput");
  aiSendBtn = document.getElementById("aiSendBtn");
  aiHelpBtn = document.getElementById("aiHelpBtn");
  aiExplainCodeBtn = document.getElementById("aiExplainCodeBtn");
}

function initBoard(n) {
  return Array(n)
    .fill()
    .map(() => Array(n).fill(0));
}

function copyBoard(board) {
  return board.map((row) => [...row]);
}

// Generates the deterministic steps array complete with contextual references
function generateSteps(n) {
  let steps = [];
  let nodeCounter = 0;
  let backtracks = 0;
  let currentPath = [];

  function placeQueen(board, row, n) {
    if (row === n) {
      steps.push({
        type: "solution",
        row: row,
        col: -1,
        path: [...currentPath],
        pathStr: currentPath.join("-") || "root",
        boardCopy: copyBoard(board),
        message:
          "✅ Complete valid solution identified! All rows successfully contain unconflicted queens.",
      });
      return true;
    }

    for (let col = 0; col < n; col++) {
      nodeCounter++;
      currentPath.push(col);
      let pathStr = currentPath.join("-");

      // Check conflicts against previously locked rows
      let conflicts = [];
      for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) {
          conflicts.push({ row: i, col: col, reason: "column" });
        }
        if (col - (row - i) >= 0 && board[i][col - (row - i)] === 1) {
          conflicts.push({
            row: i,
            col: col - (row - i),
            reason: "diagonal-left",
          });
        }
        if (col + (row - i) < n && board[i][col + (row - i)] === 1) {
          conflicts.push({
            row: i,
            col: col + (row - i),
            reason: "diagonal-right",
          });
        }
      }

      steps.push({
        type: "try",
        row,
        col,
        path: [...currentPath],
        pathStr,
        boardCopy: copyBoard(board),
        conflicts: [...conflicts],
        message: `Testing allocation parameter at Row ${row}, Column ${col}... Checking constraints.`,
      });

      if (conflicts.length === 0) {
        board[row][col] = 1;
        steps.push({
          type: "place",
          row,
          col,
          path: [...currentPath],
          pathStr,
          boardCopy: copyBoard(board),
          message: `👑 Position safe! Locked queen at Row ${row}, Column ${col}. Proceeding to recursively evaluate Row ${row + 1}.`,
        });

        if (placeQueen(board, row + 1, n)) return true;

        board[row][col] = 0;
        backtracks++;
        steps.push({
          type: "backtrack",
          row,
          col,
          path: [...currentPath],
          pathStr,
          boardCopy: copyBoard(board),
          message: `↩️ Dead end detected under Row ${row}, Column ${col}. Retracting node allocation and resetting constraint variables.`,
        });
      } else {
        steps.push({
          type: "conflict",
          row,
          col,
          path: [...currentPath],
          pathStr,
          boardCopy: copyBoard(board),
          conflicts: conflicts,
          message: `❌ Constraint Conflict! Square (${row}, ${col}) is targeted by queen at Row ${conflicts[0].row}, Col ${conflicts[0].col} along its shared ${conflicts[0].reason.replace("-", " ")}.`,
        });
      }
      currentPath.pop();
    }
    return false;
  }

  let board = initBoard(n);
  placeQueen(board, 0, n);
  return { steps, nodeCounter, backtracks };
}

// Builds layout specifications for a dynamic N-Ary Tree matching reality
function buildTreeLayout(steps) {
  let root = {
    id: "root",
    name: "Start",
    children: [],
    depth: 0,
    parent: null,
  };
  let nodeMap = { root: root };

  steps.forEach((step) => {
    if (!step.pathStr) return;
    let parts = step.path;
    let currentId = "";
    let parentNode = root;

    for (let i = 0; i < parts.length; i++) {
      let col = parts[i];
      let nextId = currentId ? `${currentId}-${col}` : `${col}`;

      if (!nodeMap[nextId]) {
        let newNode = {
          id: nextId,
          name: `R${i}C${col}`,
          row: i,
          col: col,
          children: [],
          depth: i + 1,
          parent: parentNode,
        };
        nodeMap[nextId] = newNode;
        parentNode.children.push(newNode);
      }
      parentNode = nodeMap[nextId];
      currentId = nextId;
    }
  });

  let leafCount = 0;
  function assignPositions(node) {
    if (node.children.length === 0) {
      node.x = leafCount++;
    } else {
      node.children.forEach(assignPositions);
      let sumX = node.children.reduce((sum, ch) => sum + ch.x, 0);
      node.x = sumX / node.children.length;
    }
  }
  assignPositions(root);

  let totalLeaves = Math.max(1, leafCount - 1);
  Object.values(nodeMap).forEach((node) => {
    if (node.id === "root") {
      node.xActual = 400;
      node.yActual = 15;
    } else {
      node.xActual = 40 + (node.x / totalLeaves) * 720;
      node.yActual = 15 + node.depth * 24;
    }
  });

  return nodeMap;
}

function renderTreeSVG() {
  treeSvg.innerHTML = "";
  // Append SVG marker for arrowhead visualization
  let defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  let marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "arrow");
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "6");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("orient", "auto-start-reverse");
  let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M 0 1 L 10 5 L 0 9 z");
  path.setAttribute("fill", "var(--danger)");
  marker.appendChild(path);
  defs.appendChild(marker);
  treeSvg.appendChild(defs);

  // Draw lines
  Object.values(state.treeNodes).forEach((node) => {
    if (!node.parent) return;
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.id = `node-link-${node.id}`;
    line.setAttribute("x1", node.parent.xActual);
    line.setAttribute("y1", node.parent.yActual);
    line.setAttribute("x2", node.xActual);
    line.setAttribute("y2", node.yActual);
    line.className.baseVal = "edge-line";
    treeSvg.appendChild(line);
  });

  // Draw circles
  Object.values(state.treeNodes).forEach((node) => {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    let circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.id = `node-circle-${node.id}`;
    circle.setAttribute("cx", node.xActual);
    circle.setAttribute("cy", node.yActual);
    circle.setAttribute("r", node.id === "root" ? "7" : "9");
    circle.className.baseVal = "node-circle";

    circle.addEventListener("click", () => {
      jumpToPathId(node.id);
    });

    let title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent =
      node.id === "root"
        ? "Root State"
        : `Row ${node.row}, Column ${node.col} (Click to teleport historical state)`;
    circle.appendChild(title);

    g.appendChild(circle);
    treeSvg.appendChild(g);
  });
}

function updateTreeVisualStates() {
  if (state.steps.length === 0) return;
  const activeStep = state.steps[state.currentStep];
  const targetPath = activeStep.pathStr || "root";

  let historicalVisits = new Set();
  let historicalBacktracks = new Set();
  let historicalConflicts = new Set();
  let activePlacements = new Set();

  for (let i = 0; i <= state.currentStep; i++) {
    let s = state.steps[i];
    let p = s.pathStr || "root";
    historicalVisits.add(p);
    if (s.type === "backtrack") {
      historicalBacktracks.add(p);
      activePlacements.delete(p);
    } else if (s.type === "place") {
      activePlacements.add(p);
    } else if (s.type === "conflict") {
      historicalConflicts.add(p);
    }
  }

  Object.keys(state.treeNodes).forEach((id) => {
    let circle = document.getElementById(`node-circle-${id}`);
    let line = document.getElementById(`node-link-${id}`);
    if (!circle) return;

    circle.className.baseVal = "node-circle";
    if (line) {
      line.setAttribute("stroke", "#475569");
      line.setAttribute("opacity", "1");
    }
    circle.setAttribute("opacity", "1");

    if (id === "root") {
      circle.classList.add("node-computed");
      return;
    }

    if (!historicalVisits.has(id)) {
      circle.setAttribute("opacity", "0.15");
      if (line) line.setAttribute("opacity", "0.15");
    } else {
      if (id === targetPath) {
        if (activeStep.type === "conflict" || activeStep.type === "backtrack") {
          circle.classList.add("node-backtrack");
        } else if (
          activeStep.type === "place" ||
          activeStep.type === "solution"
        ) {
          circle.classList.add("node-computed");
        } else {
          circle.classList.add("node-current");
        }
      } else if (activePlacements.has(id)) {
        circle.classList.add("node-computed");
        if (line) line.setAttribute("stroke", "var(--success)");
      } else if (historicalBacktracks.has(id) || historicalConflicts.has(id)) {
        circle.classList.add("node-backtrack");
      } else {
        circle.classList.add("node-visited");
      }
    }
  });
}

function renderBoard(board, highlightRow, highlightCol) {
  chessboardDiv.innerHTML = "";
  const n = state.n;
  chessboardDiv.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const cell = document.createElement("div");
      cell.className = `cell ${(i + j) % 2 === 0 ? "white" : "black"}`;
      if (board[i][j] === 1) cell.classList.add("queen");
      if (highlightRow === i && highlightCol === j)
        cell.classList.add("current-highlight");

      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", () => {
        toggleManualQueen(i, j);
      });
      chessboardDiv.appendChild(cell);
    }
  }
  addHoverThreatZones();
}

function drawChessOverlaylasers() {
  let boardOverlay = document.getElementById("boardOverlay");
  if (!boardOverlay) {
    boardOverlay = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    boardOverlay.id = "boardOverlay";
    boardOverlay.style.position = "absolute";
    boardOverlay.style.top = "0";
    boardOverlay.style.left = "0";
    boardOverlay.style.width = "100%";
    boardOverlay.style.height = "100%";
    boardOverlay.style.pointerEvents = "none";
    boardOverlay.style.zIndex = "5";
    chessboardDiv.appendChild(boardOverlay);
  }
  boardOverlay.setAttribute("viewBox", "0 0 100 100");
  boardOverlay.innerHTML = "";

  const n = state.n;
  const step = state.steps[state.currentStep];
  if (!step) return;

  const cellW = 100 / n;

  if (step.row !== undefined && step.col !== undefined && step.col !== -1) {
    const r = step.row;
    const c = step.col;
    const cx = (c + 0.5) * cellW;
    const cy = (r + 0.5) * cellW;

    let strokeColor = "rgba(59, 130, 246, 0.35)";
    if (step.type === "conflict") strokeColor = "rgba(239, 68, 68, 0.4)";
    if (step.type === "place") strokeColor = "rgba(34, 197, 94, 0.45)";

    // Vertical projection line
    let vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    vLine.setAttribute("x1", cx);
    vLine.setAttribute("y1", 0);
    vLine.setAttribute("x2", cx);
    vLine.setAttribute("y2", cy);
    vLine.setAttribute("stroke", strokeColor);
    vLine.setAttribute("stroke-width", "1.5");
    vLine.setAttribute("stroke-dasharray", "2,2");
    boardOverlay.appendChild(vLine);

    // Diagonals
    let d1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    let leftDist = Math.min(r, c);
    d1.setAttribute("x1", (c - leftDist + 0.5) * cellW);
    d1.setAttribute("y1", (r - leftDist + 0.5) * cellW);
    d1.setAttribute("x2", cx);
    d1.setAttribute("y2", cy);
    d1.setAttribute("stroke", strokeColor);
    d1.setAttribute("stroke-width", "1.5");
    boardOverlay.appendChild(d1);

    let d2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    let rightDist = Math.min(r, n - 1 - c);
    d2.setAttribute("x1", (c + rightDist + 0.5) * cellW);
    d2.setAttribute("y1", (r - rightDist + 0.5) * cellW);
    d2.setAttribute("x2", cx);
    d2.setAttribute("y2", cy);
    d2.setAttribute("stroke", strokeColor);
    d2.setAttribute("stroke-width", "1.5");
    boardOverlay.appendChild(d2);

    if (step.type === "conflict" && step.conflicts) {
      step.conflicts.forEach((conf) => {
        let qx = (conf.col + 0.5) * cellW;
        let qy = (conf.row + 0.5) * cellW;

        let laser = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        laser.setAttribute("x1", qx);
        laser.setAttribute("y1", qy);
        laser.setAttribute("x2", cx);
        laser.setAttribute("y2", cy);
        laser.setAttribute("stroke", "var(--danger)");
        laser.setAttribute("stroke-width", "2.5");
        laser.setAttribute("marker-end", "url(#arrow)");
        boardOverlay.appendChild(laser);

        let ring = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        ring.setAttribute("cx", qx);
        ring.setAttribute("cy", qy);
        ring.setAttribute("r", cellW / 3.5);
        ring.setAttribute("fill", "none");
        ring.setAttribute("stroke", "var(--danger)");
        ring.setAttribute("stroke-width", "2");

        let anim = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "animate",
        );
        anim.setAttribute("attributeName", "r");
        anim.setAttribute("values", `${cellW / 5};${cellW / 2}`);
        anim.setAttribute("dur", "0.8s");
        anim.setAttribute("repeatCount", "indefinite");
        ring.appendChild(anim);
        boardOverlay.appendChild(ring);

        // Red-out cell background indicator
        let gridCell = chessboardDiv.children[conf.row * n + conf.col];
        if (gridCell) gridCell.classList.add("conflict");
      });
    }
  }
}

function addHoverThreatZones() {
  document.querySelectorAll(".cell").forEach((cell) => {
    let i = parseInt(cell.dataset.row);
    let j = parseInt(cell.dataset.col);
    cell.addEventListener("mouseenter", () => {
      if (!state.isPlaying) previewCustomThreatZones(i, j);
    });
    cell.addEventListener("mouseleave", () => {
      if (!state.isPlaying) drawChessOverlaylasers();
    });
  });
}

function previewCustomThreatZones(row, col) {
  let boardOverlay = document.getElementById("boardOverlay");
  if (!boardOverlay) return;
  boardOverlay.innerHTML = "";

  const n = state.n;
  let cellW = 100 / n;
  let cx = (col + 0.5) * cellW;
  let cy = (row + 0.5) * cellW;

  let activeStep = state.steps[state.currentStep];
  let activeBoard =
    activeStep && activeStep.boardCopy ? activeStep.boardCopy : initBoard(n);

  let hits = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (activeBoard[i][j] === 1) {
        if (j === col || i === row || Math.abs(i - row) === Math.abs(j - col)) {
          hits.push({ row: i, col: j });
        }
      }
    }
  }

  let color =
    hits.length > 0 ? "rgba(239, 68, 68, 0.25)" : "rgba(34, 197, 94, 0.3)";

  let crossH = document.createElementNS("http://www.w3.org/2000/svg", "line");
  crossH.setAttribute("x1", 0);
  crossH.setAttribute("y1", cy);
  crossH.setAttribute("x2", 100);
  crossH.setAttribute("y2", cy);
  crossH.setAttribute("stroke", color);
  crossH.setAttribute("stroke-width", "2");
  boardOverlay.appendChild(crossH);

  let crossV = document.createElementNS("http://www.w3.org/2000/svg", "line");
  crossV.setAttribute("x1", cx);
  crossV.setAttribute("y1", 0);
  crossV.setAttribute("x2", cx);
  crossV.setAttribute("y2", 100);
  crossV.setAttribute("stroke", color);
  crossV.setAttribute("stroke-width", "2");
  boardOverlay.appendChild(crossV);

  hits.forEach((h) => {
    let laser = document.createElementNS("http://www.w3.org/2000/svg", "line");
    laser.setAttribute("x1", (h.col + 0.5) * cellW);
    laser.setAttribute("y1", (h.row + 0.5) * cellW);
    laser.setAttribute("x2", cx);
    laser.setAttribute("y2", cy);
    laser.setAttribute("stroke", "var(--danger)");
    laser.setAttribute("stroke-width", "1.5");
    laser.setAttribute("stroke-dasharray", "3,3");
    boardOverlay.appendChild(laser);
  });
}

function toggleManualQueen(row, col) {
  if (state.isPlaying) return;
  let stepObj = state.steps[state.currentStep];
  let brd =
    stepObj && stepObj.boardCopy
      ? copyBoard(stepObj.boardCopy)
      : initBoard(state.n);

  brd[row][col] = brd[row][col] === 1 ? 0 : 1;
  renderBoard(brd, row, col);
  previewCustomThreatZones(row, col);
}

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
  currentStepIdxSpan.innerText = 1;

  timelineSlider.max = Math.max(0, state.steps.length - 1);
  timelineSlider.value = 0;

  state.treeNodes = buildTreeLayout(state.steps);

  // Scale view box coordinates smoothly based on tree node count
  let maxLeaves = Object.values(state.treeNodes).filter(
    (n) => n.children.length === 0,
  ).length;
  treeSvg.setAttribute(
    "viewBox",
    `0 0 800 ${Math.max(220, 40 + state.n * 24)}`,
  );

  renderTreeSVG();
  updateVisualization();
}

function updateVisualization() {
  if (state.currentStep >= state.steps.length) {
    if (state.isPlaying) stopPlay();
    return;
  }
  const step = state.steps[state.currentStep];
  const board = step.boardCopy || initBoard(state.n);

  renderBoard(board, step.row, step.col);
  execDescDiv.innerHTML = `<strong>Step ${state.currentStep + 1}/${state.steps.length} (${step.type.toUpperCase()}):</strong> ${step.message}`;
  currentStepIdxSpan.innerText = state.currentStep + 1;
  timelineSlider.value = state.currentStep;

  updateTreeVisualStates();
  drawChessOverlaylasers();
  highlightCodeLine(step.type, step);

  // Voice execution queue monitoring
  if (
    readAloudBtn.classList.contains("text-primary") &&
    !speechSynth.speaking
  ) {
    let t = execDescDiv.innerText.replace(/✅|❌|↩️|👑/g, "");
    let u = new SpeechSynthesisUtterance(t);
    u.rate = 1.2;
    speechSynth.speak(u);
  }
}

function highlightCodeLine(type, step) {
  document
    .querySelectorAll(".code-line")
    .forEach((el) => el.classList.remove("code-highlight"));
  let line = 15;

  if (type === "try") line = 16;
  else if (type === "place") line = 17;
  else if (type === "backtrack") line = 19;
  else if (type === "solution") line = 14;
  else if (type === "conflict") {
    line = 16;
    if (step.conflicts && step.conflicts.length > 0) {
      let r = step.conflicts[0].reason;
      if (r === "column") line = 6;
      else if (r === "diagonal-left") line = 7;
      else if (r === "diagonal-right") line = 8;
    }
  }

  let target = document.querySelector(`.code-line[data-line="${line}"]`);
  if (target) {
    target.classList.add("code-highlight");
    target.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

function jumpToPathId(pathId) {
  if (state.isPlaying) stopPlay();
  let idx = state.steps.findIndex((s) => (s.pathStr || "root") === pathId);
  if (idx !== -1) {
    state.currentStep = idx;
    updateVisualization();
  }
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

  function loop() {
    if (!state.isPlaying) return;
    if (state.currentStep < state.steps.length - 1) {
      stepForward();
      animationTimer = setTimeout(loop, 900 / state.speed);
    } else {
      stopPlay();
    }
  }
  loop();
}

function stopPlay() {
  if (animationTimer) clearTimeout(animationTimer);
  state.isPlaying = false;
  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnStep.disabled = false;
}

function initCodeEditor() {
  if (!editorDiv) return;
  const structures = [
    "#include &lt;stdbool.h&gt;",
    "#define N 8",
    "",
    "bool isSafe(int board[N][N], int row, int col) {",
    "    for (int i = 0; i &lt; row; i++) {",
    "        if (board[i][col] == 1) return false;",
    "        if (col - (row - i) &gt;= 0 &amp;&amp; board[i][col - (row - i)] == 1) return false;",
    "        if (col + (row - i) &lt; N &amp;&amp; board[i][col + (row - i)] == 1) return false;",
    "    }",
    "    return true;",
    "}",
    "",
    "bool solve(int board[N][N], int row) {",
    "    if (row == N) return true; // Base Case Met",
    "    for (int col = 0; col &lt; N; col++) {",
    "        if (isSafe(board, row, col)) {",
    "            board[row][col] = 1; // Try placing queen",
    "            if (solve(board, row + 1)) return true;",
    "            board[row][col] = 0; // Backtrack line execution",
    "        }",
    "    }",
    "    return false;",
    "}",
  ];
  const explanations = {
    1: "Provides the bool type and true/false constants.",
    2: "Defines N=8 for the chessboard size.",
    4: "Checks if a queen can be safely placed at (row, col).",
    5: "Iterates over all previously placed queens to test attacks.",
    6: "Conflict test: another queen in the same column.",
    7: "Conflict test: another queen on the upper-left diagonal.",
    8: "Conflict test: another queen on the upper-right diagonal.",
    9: "End of conflict-checking loop.",
    10: "No conflicts found - position is safe.",
    11: "End of isSafe function.",
    13: "Recursive backtracking solver placing one queen per row.",
    14: "Base case: all N rows filled - solution found.",
    15: "Tries every column in the current row.",
    16: "Advances only if the current cell is safe.",
    17: "Places a queen at the safe position.",
    18: "Recurses to the next row; aborts branch on failure.",
    19: "Backtrack: removes queen to try the next column.",
    20: "End of safety-check block.",
    21: "End of column-iteration loop.",
    22: "No valid placement in this row - triggers backtrack.",
    23: "End of solve function.",
  };
  editorDiv.innerHTML = structures
    .map((l, i) => {
      const lineNum = i + 1;
      const expl = explanations[lineNum] || "";
      return `<div class="code-line" data-line="${lineNum}"><span class="line-explanation" data-line="${lineNum}" title="${expl}">💡</span>${l}</div>`;
    })
    .join("");
}

function handleAIQuery(query) {
  let q = query.toLowerCase();
  let currentStepObj = state.steps[state.currentStep];
  let context = currentStepObj
    ? ` Currently, at step ${state.currentStep + 1}, the algorithm evaluates row ${currentStepObj.row}, column ${currentStepObj.col}.`
    : "";

  if (q.includes("conflict") || q.includes("unsafe") || q.includes("why")) {
    if (
      currentStepObj &&
      currentStepObj.type === "conflict" &&
      currentStepObj.conflicts
    ) {
      let c = currentStepObj.conflicts[0];
      return `Position (${currentStepObj.row}, ${currentStepObj.col}) is unsafe because the existing queen locked at cell (${c.row}, ${c.col}) exerts a check threat along the matching ${c.reason.replace("-", " ")} line.`;
    }
    return "A cell is unsafe if any previously confirmed queen populates its row, column, or matching upper diagonals. The function `isSafe()` sweeps rows 0 to (current row - 1) to block illegal moves.";
  }
  if (q.includes("backtrack")) {
    return "Backtracking occurs when the algorithm hits a dead end (row has zero safe columns). It pops out of recursion, clears the last queen (`board[row][col] = 0`), and advances the parent row column to test alternative structures.";
  }
  if (q.includes("prune") || q.includes("efficiency")) {
    return `Pruning isolates dead ends instantly. Instead of checking all $N^N$ layouts via brute force, it discards entire branches structural sub-options downstream once an individual row fails, saving massive hardware cycles.`;
  }
  if (q.includes("solution")) {
    return "For N=8, there are 92 complete combinations. The solver halts and presents the first completed path it discovers to showcase the structural logic clearly.";
  }
  return `Ask me about: "Why is this step unsafe?", "What triggers backtracking?", or "How does pruning scale efficiency?".${context}`;
}

function initEventListeners() {
  btnStep.onclick = stepForward;
  btnPlay.onclick = playSimulation;
  btnPause.onclick = () => {
    stopPlay();
  };
  btnReset.onclick = () => {
    stopPlay();
    state.currentStep = 0;
    updateVisualization();
  };

  speedSlider.oninput = () => {
    state.speed = parseFloat(speedSlider.value);
    speedValue.innerText = state.speed + "x";
  };
  inputN.onchange = () => {
    let v = parseInt(inputN.value);
    if (isNaN(v) || v < 4) v = 4;
    if (v > 8) v = 8;
    inputN.value = v;
    state.n = v;
    rebuildSimulation();
  };
  compareToggle.onclick = () => {
    state.showCompare = !state.showCompare;
    compareToggle.classList.toggle("active");
    if (state.showCompare) {
      comparisonStatsDiv.style.display = "block";
      comparisonStatsDiv.innerHTML = `<div class="p-2 border border-warning rounded bg-dark text-warning small style="font-size:12px;">
                <strong>Brute Force:</strong> Permutations require evaluating up to $N!$ or $N^N$ strings (~40,320 checks for N=8).<br>
                <strong>Backtracking:</strong> Early row pruning skips useless options, evaluating only <strong>${state.nodeCount}</strong> positions to find this layout.
            </div>`;
    } else {
      comparisonStatsDiv.style.display = "none";
    }
  };
  themeToggle.onclick = () => {
    document.body.classList.toggle("light-theme");
    let icon = themeToggle.querySelector("i");
    icon.className = document.body.classList.contains("light-theme")
      ? "fa-solid fa-sun"
      : "fa-solid fa-moon";
  };
  readAloudBtn.onclick = () => {
    readAloudBtn.classList.toggle("text-primary");
    if (!readAloudBtn.classList.contains("text-primary")) speechSynth.cancel();
  };
  timelineSlider.oninput = () => {
    state.currentStep = parseInt(timelineSlider.value);
    updateVisualization();
  };
  aiSendBtn.onclick = () => {
    aiResponseDiv.innerHTML = `<i class="fa-regular fa-message text-primary"></i> ${handleAIQuery(aiInput.value)}`;
  };
  aiHelpBtn.onclick = () => {
    let step = state.steps[state.currentStep];
    let txt = step
      ? `Current context: Type [${step.type.toUpperCase()}]. Action locked row ${step.row}, col ${step.col}. Detail path string: ${step.pathStr || "root"}.`
      : "No parameters loaded.";
    aiResponseDiv.innerHTML = `<i class="fa-regular fa-lightbulb text-warning"></i> ${txt}`;
  };
  aiExplainCodeBtn.onclick = () => {
    aiResponseDiv.innerHTML = `<i class="fa-regular fa-file-code text-info"></i> Base logic: <code>isSafe()</code> executes validation loops. <code>solve()</code> acts as a recursive engine, nesting row tracking loops sequentially until a solutions matches.`;
  };
}

// --------------------------------------------------------------
// Self-Anchoring Masterclass Tour Framework implementation
// --------------------------------------------------------------
let currentTourStep = 0;
const tourSteps = [
  {
    title: " Autonomous Masterclass Guide",
    text: "Welcome! This simulator acts as an automated tutorial workspace. No instructor is required to learn backtracking theory here.",
    target: "chessboard",
  },
  {
    title: "♕ Attack Lines & Threats",
    text: "As configurations play out, animated tracking lasers and pulse vectors show row conflict reasons instantly. Hover over elements anytime to audit active collision danger paths.",
    target: "boardWrap",
  },
  {
    title: " Dynamic Call Space Graph",
    text: "Unlike basic static maps, this tree scales dynamically to track live loops. Click any circle node to warp layout context instantly back to that step in history.",
    target: "treeSvg",
  },
  {
    title: " Pseudo-Code Sync Engine",
    text: "The active stack positions automatically map down corresponding lines here in real-time, matching source loops directly to layout transitions.",
    target: "codeCard",
  },
  {
    title: " Context-Aware Trainer Chat",
    text: "Need extra help? Ask our bot parameters like 'Why is this cell unsafe?' or 'What does backtracking do?' to access targeted calculations.",
    target: "aiCard",
  },
];

function triggerInteractiveTour() {
  currentTourStep = 0;
  let overlay = document.getElementById("guidedTour");
  overlay.style.display = "block";
  renderTourStep();
}

function renderTourStep() {
  let s = tourSteps[currentTourStep];
  document.getElementById("tourTitle").innerText = s.title;
  document.getElementById("tourText").innerText = s.text;

  let targetEl = document.getElementById(s.target);
  let tooltip = document.getElementById("tourTooltip");

  document.querySelectorAll(".tour-highlight").forEach((el) => {
    el.style.outline = "none";
  });

  if (targetEl && tooltip) {
    targetEl.style.outline = "3px solid var(--primary)";
    targetEl.style.outlineOffset = "4px";
    targetEl.classList.add("tour-highlight");

    let r = targetEl.getBoundingClientRect();
    let top = r.top + window.scrollY + r.height / 2 - 80;
    let left = r.left + window.scrollX + r.width + 16;

    if (left + 340 > window.innerWidth) left = r.left + window.scrollX - 340;
    if (top < 12) top = 12;

    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
    tooltip.style.transform = "none";
  } else if (tooltip) {
    tooltip.style.top = "40%";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translate(-50%, -50%)";
  }
}

function setupTourControls() {
  document.getElementById("startTourBtn").onclick = triggerInteractiveTour;
  document.getElementById("tourSkip").onclick = () => {
    document.getElementById("guidedTour").style.display = "none";
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.style.outline = "none";
    });
  };
  document.getElementById("tourNext").onclick = () => {
    currentTourStep++;
    if (currentTourStep < tourSteps.length) {
      renderTourStep();
    } else {
      document.getElementById("guidedTour").style.display = "none";
      document.querySelectorAll(".tour-highlight").forEach((el) => {
        el.style.outline = "none";
      });
      localStorage.setItem("nqueens_tour_complete", "true");
    }
  };
}

function init() {
  initDOMElements();
  initCodeEditor();
  initEventListeners();
  setupTourControls();
  rebuildSimulation();

  if (!localStorage.getItem("nqueens_tour_complete")) {
    setTimeout(triggerInteractiveTour, 800);
  }
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", init)
  : init();
