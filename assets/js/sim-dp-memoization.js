// Global UI state handling
function togglePlatformTheme() {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  const btn = document.getElementById("themeToggleBtn");
  btn.innerHTML = isLight
    ? '<i class="fa-solid fa-sun"></i> <span>Light Mode</span>'
    : '<i class="fa-solid fa-moon"></i> <span>Dark Mode</span>';
}

function toggleMemoizationSetting() {
  const toggle = document.getElementById("memoToggle");
  toggle.classList.toggle("active");
  initSimulationProblem();
}

// Code line explanations for tooltips
const lineExplanations = {
  fibonacci: {
    memo: [
      'Function declaration with memo array to cache results.',
      'Return cached value immediately if already computed.',
      'Base case: return n directly for fib(0) and fib(1).',
      'Recursive step: store fib(n-1) + fib(n-2) in memo and return it.',
    ],
    naive: [
      'Function declaration without memoization.',
      'Base case: return n for fib(0) and fib(1).',
      'Direct recursive computation of fib(n-1) + fib(n-2).',
    ],
  },
  coinchange: {
    memo: [
      'Function declaration with memo object to cache results.',
      'Return cached result if this amount has been computed before.',
      'Base case: zero coins needed for zero amount.',
      'Initialize minimum coins to infinity.',
      'Iterate through each coin denomination.',
      'Only consider coins that do not exceed the current amount.',
      'Recursive call to find minimum coins for the remaining amount.',
      'Store the minimum result in memo and return it.',
    ],
    naive: [
      'Function declaration without memoization.',
      'Base case: zero coins needed for zero amount.',
      'Initialize minimum coins to infinity.',
      'Iterate through each coin denomination.',
      'Only consider coins that do not exceed the current amount.',
      'Direct recursive computation of minCoins for remaining amount + 1.',
      'Return the minimum number of coins found.',
    ],
  },
};

// Structural Code Snippet Templates
const codeTemplates = {
  fibonacci: {
    memo: [
      `<span class="code-keyword">function</span> <span class="code-func">fib</span>(n, memo = []) {`,
      `    <span class="code-keyword">if</span> (memo[n] !== <span class="code-type">undefined</span>) <span class="code-keyword">return</span> memo[n]; <span class="code-comment">// Cache Hit!</span>`,
      `    <span class="code-keyword">if</span> (n <= 1) <span class="code-keyword">return</span> n;`,
      `    memo[n] = <span class="code-func">fib</span>(n - 1, memo) + <span class="code-func">fib</span>(n - 2, memo);`,
      `    <span class="code-keyword">return</span> memo[n];`,
      `}`,
    ],
    naive: [
      `<span class="code-keyword">function</span> <span class="code-func">fib</span>(n) {`,
      `    <span class="code-keyword">if</span> (n <= 1) <span class="code-keyword">return</span> n;`,
      `    <span class="code-keyword">return</span> <span class="code-func">fib</span>(n - 1) + <span class="code-func">fib</span>(n - 2);`,
      `}`,
    ],
  },
  coinchange: {
    memo: [
      `<span class="code-keyword">function</span> <span class="code-func">minCoins</span>(amt, coins, memo = {}) {`,
      `    <span class="code-keyword">if</span> (amt <span class="code-macro">in</span> memo) <span class="code-keyword">return</span> memo[amt];`,
      `    <span class="code-keyword">if</span> (amt === 0) <span class="code-keyword">return</span> 0;`,
      `    <span class="code-keyword">let</span> min = <span class="code-type">Infinity</span>;`,
      `    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> c <span class="code-macro">of</span> coins) {`,
      `        <span class="code-keyword">if</span> (amt - c >= 0) {`,
      `            <span class="code-keyword">let</span> res = <span class="code-func">minCoins</span>(amt - c, coins, memo);`,
      `            min = Math.min(min, res + 1);`,
      `        }`,
      `    }`,
      `    memo[amt] = min; <span class="code-keyword">return</span> min;`,
      `}`,
    ],
    naive: [
      `<span class="code-keyword">function</span> <span class="code-func">minCoins</span>(amt, coins) {`,
      `    <span class="code-keyword">if</span> (amt === 0) <span class="code-keyword">return</span> 0;`,
      `    <span class="code-keyword">let</span> min = <span class="code-type">Infinity</span>;`,
      `    <span class="code-keyword">for</span> (<span class="code-keyword">let</span> c <span class="code-macro">of</span> coins) {`,
      `        <span class="code-keyword">if</span> (amt - c >= 0) {`,
      `            min = Math.min(min, <span class="code-func">minCoins</span>(amt - c, coins) + 1);`,
      `        }`,
      `    }`,
      `    <span class="code-keyword">return</span> min;`,
      `}`,
    ],
  },
};

// Engine State Variables
let simSteps = [];
let currentStepIdx = -1;
let playInterval = null;

// Initialize Simulation Engine Frames
function initSimulationProblem() {
  pauseSimulation();
  document.getElementById("quizOverlay").style.display = "none";
  const btnQuiz = document.getElementById("btnQuiz");
  if (btnQuiz) btnQuiz.classList.remove("visible");
  
  const problem = document.getElementById("algoProblem").value;
  const size = parseInt(document.getElementById("inputSize").value) || 5;
  const isMemo = document
    .getElementById("memoToggle")
    .classList.contains("active");

  // Re-render syntax synchronized code workspace
  const lines = isMemo
    ? codeTemplates[problem].memo
    : codeTemplates[problem].naive;
  const explanations = isMemo
    ? lineExplanations[problem].memo
    : lineExplanations[problem].naive;
  const codeEditor = document.getElementById("codeSandboxView");
  codeEditor.innerHTML = lines
    .map(
      (l, i) =>
        `<span class="code-line" data-line="${i + 1}">${l}<span class="line-tooltip" title="${explanations[i] || ''}">ⓘ</span></span>`,
    )
    .join("");

  codeEditor.querySelectorAll(".line-tooltip").forEach((tip) => {
    tip.addEventListener("mouseenter", () => {
      const lineEl = tip.closest(".code-line");
      const tooltip = document.createElement("span");
      tooltip.className = "line-tooltip-content";
      tooltip.textContent = tip.getAttribute("title");
      lineEl.appendChild(tooltip);
    });
    tip.addEventListener("mouseleave", () => {
      const lineEl = tip.closest(".code-line");
      const tooltip = lineEl.querySelector(".line-tooltip-content");
      if (tooltip) tooltip.remove();
    });
  });

  // Build Matrix Storage Headings/Columns
  const headerRow = document.getElementById("memoHeaderRow");
  const dataRow = document.getElementById("memoDataRow");
  headerRow.innerHTML = "";
  dataRow.innerHTML = "";

  const maxCells = problem === "fibonacci" ? size + 1 : size + 1;
  for (let i = 0; i < maxCells; i++) {
    headerRow.innerHTML += `<th>[${i}]</th>`;
    dataRow.innerHTML += `<td id="cache-cell-${i}" class="uninitialized">nil</td>`;
  }

  // Reset analytics data components
  document.getElementById("statFrames").innerText = "0";
  document.getElementById("statCalls").innerText = "0";
  document.getElementById("cacheStatsLabel").innerText = "0 Hits Registered";
  document.getElementById("statTimeComp").innerText = isMemo
    ? "O(N)"
    : problem === "fibonacci"
      ? "O(2ᴺ)"
      : "O(Cᴺ)";
  document.getElementById("statusDot").className = "status-dot valid";
  document.getElementById("statusText").innerText = "Ready";

  // Generate Steps Sequence Structure
  simSteps = [];
  currentStepIdx = -1;
  let nodeCounter = 0;

  if (problem === "fibonacci") {
    let cache = {};
    function generateFibSteps(n, pId = null) {
      let id = "n-" + ++nodeCounter;
      let stepInit = {
        type: "enter",
        val: n,
        id: id,
        parentId: pId,
        cache: { ...cache },
        highlightLine: isMemo ? 1 : 1,
      };
      simSteps.push(stepInit);

      if (isMemo && cache[n] !== undefined) {
        simSteps.push({
          type: "cache-hit",
          val: n,
          id: id,
          parentId: pId,
          cache: { ...cache },
          highlightLine: 2,
        });
        return cache[n];
      }
      if (n <= 1) {
        cache[n] = n;
        simSteps.push({
          type: "base-case",
          val: n,
          id: id,
          parentId: pId,
          cache: { ...cache },
          highlightLine: 3,
          res: n,
        });
        return n;
      }

      simSteps.push({
        type: "computing",
        val: n,
        id: id,
        parentId: pId,
        cache: { ...cache },
        highlightLine: 4,
      });
      let left = generateFibSteps(n - 1, id);
      let right = generateFibSteps(n - 2, id);
      let sum = left + right;
      cache[n] = sum;

      simSteps.push({
        type: "computed",
        val: n,
        id: id,
        parentId: pId,
        cache: { ...cache },
        highlightLine: 4,
        res: sum,
      });
      return sum;
    }
    generateFibSteps(size);
  } else {
    // Coin change baseline mock tree generation structure
    let cache = {};
    let coins = [1, 2, 3];
    function generateCCSteps(amt, pId = null) {
      let id = "n-" + ++nodeCounter;
      simSteps.push({
        type: "enter",
        val: amt,
        id: id,
        parentId: pId,
        cache: { ...cache },
        highlightLine: 1,
      });
      if (isMemo && cache[amt] !== undefined) {
        simSteps.push({
          type: "cache-hit",
          val: amt,
          id: id,
          parentId: pId,
          cache: { ...cache },
          highlightLine: 2,
        });
        return cache[amt];
      }
      if (amt === 0) {
        cache[amt] = 0;
        simSteps.push({
          type: "base-case",
          val: amt,
          id: id,
          parentId: pId,
          cache: { ...cache },
          highlightLine: 3,
          res: 0,
        });
        return 0;
      }

      simSteps.push({
        type: "computing",
        val: amt,
        id: id,
        parentId: pId,
        cache: { ...cache },
        highlightLine: 7,
      });
      let min = Infinity;
      for (let c of coins) {
        if (amt - c >= 0) {
          let r = generateCCSteps(amt - c, id);
          min = Math.min(min, r + 1);
        }
      }
      cache[amt] = min;
      simSteps.push({
        type: "computed",
        val: amt,
        id: id,
        parentId: pId,
        cache: { ...cache },
        highlightLine: 11,
        res: min,
      });
      return min;
    }
    generateCCSteps(size);
  }

  renderTreeSnapshot();
}

// Tree Node Configuration Layout Render Engine
function renderTreeSnapshot() {
  const nodesGrp = document.getElementById("nodesGroup");
  const edgesGrp = document.getElementById("edgesGroup");
  nodesGrp.innerHTML = "";
  edgesGrp.innerHTML = "";

  if (simSteps.length === 0) return;

  // Extract visibility state map up to the current trace point
  let activeFrame = simSteps[Math.max(0, currentStepIdx)] || simSteps[0];
  let activeNodes = [];
  let cacheHitsCount = 0;

  for (let i = 0; i <= currentStepIdx; i++) {
    let s = simSteps[i];
    if (!activeNodes.find((n) => n.id === s.id)) {
      activeNodes.push({
        id: s.id,
        val: s.val,
        parentId: s.parentId,
        state: s.type,
      });
    } else {
      let target = activeNodes.find((n) => n.id === s.id);
      target.state = s.type;
      if (s.type === "computed") target.res = s.res;
    }
    if (s.type === "cache-hit") cacheHitsCount++;
  }

  if (currentStepIdx === -1) {
    activeNodes = [
      {
        id: simSteps[0].id,
        val: simSteps[0].val,
        parentId: null,
        state: "pending",
      },
    ];
  }

  // Simple programmatic tree branch coordinates layout solver
  let levels = {};
  function assignCoordinates(nodeId, x, depth, spread) {
    let match = activeNodes.find((n) => n.id === nodeId);
    if (!match) return;
    match.x = x;
    match.y = 40 + depth * 50;

    let children = activeNodes.filter((n) => n.parentId === nodeId);
    let count = children.length;
    children.forEach((c, idx) => {
      let nextSpread = spread / 1.8;
      let nx = x + (idx - (count - 1) / 2) * spread;
      assignCoordinates(c.id, nx, depth + 1, nextSpread);
    });
  }

  if (activeNodes.length > 0) {
    assignCoordinates(activeNodes[0].id, 400, 0, 160);
  }

  // Draw connecting edges
  activeNodes.forEach((node) => {
    if (node.parentId) {
      let parent = activeNodes.find((n) => n.id === node.parentId);
      if (parent) {
        const isMemoEdge = node.state === "cache-hit";
        edgesGrp.innerHTML += `<line class="edge-line ${isMemoEdge ? "memo-edge" : ""}" x1="${parent.x}" y1="${parent.y}" x2="${node.x}" y2="${node.y}" />`;
      }
    }
  });

  // Draw individual nodes
  activeNodes.forEach((node) => {
    let stateClass = "node-circle";
    if (node.state === "enter") stateClass += " node-current";
    else if (node.state === "computing") stateClass += " node-computing";
    else if (node.state === "computed" || node.state === "base-case")
      stateClass += " node-computed";
    else if (node.state === "cache-hit") stateClass += " node-memo";
    else stateClass += " node-visited";

    if (currentStepIdx >= 0 && simSteps[currentStepIdx].id === node.id) {
      stateClass += " node-current";
    }

    let displayVal = node.val;
    if (node.res !== undefined && node.res !== Infinity)
      displayVal += `:${node.res}`;

    nodesGrp.innerHTML += `
                    <g transform="translate(${node.x}, ${node.y})" 
                       onmouseover="showNodeTooltip(event, '${node.id}', ${node.val}, '${node.state}')" 
                       onmouseout="hideNodeTooltip()">
                        <circle class="${stateClass}" r="16" />
                        <text class="node-text">${displayVal}</text>
                    </g>
                `;
  });

  // Update live metadata matrices elements
  if (currentStepIdx >= 0) {
    const curStep = simSteps[currentStepIdx];
    document.getElementById("statFrames").innerText = activeNodes.filter(
      (n) => n.state === "enter" || n.state === "computing",
    ).length;
    document.getElementById("statCalls").innerText = currentStepIdx + 1;
    document.getElementById("cacheStatsLabel").innerText =
      `${cacheHitsCount} Hits Registered`;

    // Synchronize active code line highlighter
    document
      .querySelectorAll(".code-line")
      .forEach((el) => el.classList.remove("code-highlight"));
    if (curStep.highlightLine) {
      const lineEl = document.querySelector(
        `.code-line[data-line="${curStep.highlightLine}"]`,
      );
      if (lineEl) lineEl.classList.add("code-highlight");
    }

    // Synchronize caching lookup layout states
    Object.keys(curStep.cache).forEach((k) => {
      const cell = document.getElementById(`cache-cell-${k}`);
      if (cell) {
        cell.className = "computed";
        cell.innerHTML = `${curStep.cache[k]}<span class="cache-hit-badge">✓</span>`;
      }
    });

    if (curStep.type === "cache-hit") {
      const cell = document.getElementById(`cache-cell-${curStep.val}`);
      if (cell) cell.className = "computing";
      document.getElementById("aiInstructorContent").innerText =
        `Cache Hit triggered at position [${curStep.val}]! The engine immediately returns the stored value without expanding this recursive branch further.`;
    }
  }
}

// Quiz State & Questions Data
let quizState = {
  currentQuestion: 0,
  answers: [],
  completed: false
};

const quizQuestions = {
  fibonacci: [
    {
      question: "What is the time complexity of the naive recursive Fibonacci algorithm?",
      options: ["O(N)", "O(2ᴺ)", "O(N²)", "O(log N)"],
      correct: 1,
      explanation: "The naive Fibonacci makes two recursive calls per step, creating a binary tree of height N, resulting in exponential O(2ᴺ) time complexity."
    },
    {
      question: "How does memoization improve the Fibonacci calculation?",
      options: [
        "It eliminates recursion entirely",
        "It stores computed values to avoid redundant calculations",
        "It reduces space complexity to O(1)",
        "It parallelizes the computation"
      ],
      correct: 1,
      explanation: "Memoization caches results of subproblems, ensuring each value is computed only once, reducing time to O(N)."
    },
    {
      question: "What is the space complexity of memoized Fibonacci?",
      options: ["O(1)", "O(N)", "O(2ᴺ)", "O(N²)"],
      correct: 1,
      explanation: "The memo table stores N values, giving O(N) space complexity, plus the recursion stack depth O(N)."
    }
  ],
  coinchange: [
    {
      question: "Which coins are available for the coin change problem in this simulation?",
      options: ["[1, 5, 10]", "[1, 2, 3]", "[2, 5, 10]", "[1, 5, 25]"],
      correct: 1,
      explanation: "The simulation uses denominations [1, 2, 3] to demonstrate the coin change algorithm."
    },
    {
      question: "What does a cache hit indicate in the coin change algorithm?",
      options: [
        "A coin was found in the pocket",
        "The solution for that amount was already computed",
        "The algorithm hit a base case",
        "An error occurred in computation"
      ],
      correct: 1,
      explanation: "A cache hit means the minimum coins for that amount were previously computed and stored."
    },
    {
      question: "What is the key principle of Dynamic Programming?",
      options: [
        "Always use iteration over recursion",
        "Solve problems by breaking them into overlapping subproblems and caching results",
        "Use the fastest possible sorting algorithm",
        "Avoid using any additional memory"
      ],
      correct: 1,
      explanation: "Dynamic Programming solves overlapping subproblems once and stores results for future reference."
    }
  ]
};

// Quiz Functions
function showQuiz() {
  const problem = document.getElementById("algoProblem").value;
  quizState = { currentQuestion: 0, answers: [], completed: false };
  
  const overlay = document.getElementById("quizOverlay");
  overlay.style.display = "flex";
  
  const title = document.getElementById("quizTitle");
  title.innerHTML = `<i class="fa-solid fa-circle-question"></i> DP Concept Quiz: ${problem === "fibonacci" ? "Fibonacci" : "Coin Change"}`;
  
  renderQuizQuestion(problem);
}

function renderQuizQuestion(problem) {
  const questions = quizQuestions[problem];
  const q = questions[quizState.currentQuestion];
  
  document.getElementById("quizProgress").innerText = 
    `Question ${quizState.currentQuestion + 1} of ${questions.length}`;
  document.getElementById("quizQuestion").innerText = q.question;
  document.getElementById("quizOptions").innerHTML = q.options
    .map((opt, i) => 
      `<div class="quiz-option" data-index="${i}" onclick="selectQuizOption(this, ${i})">${opt}</div>`
    ).join("");
  document.getElementById("quizFeedback").classList.remove("show");
  document.getElementById("quizSubmit").disabled = true;
  document.getElementById("quizSubmit").innerText = "Submit Answer";
}

function selectQuizOption(el, index) {
  document.querySelectorAll(".quiz-option").forEach(opt => opt.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("quizSubmit").disabled = false;
}

function submitQuizAnswer() {
  const problem = document.getElementById("algoProblem").value;
  const questions = quizQuestions[problem];
  const selected = document.querySelector(".quiz-option.selected");
  
  if (!selected) return;
  
  const selectedIndex = parseInt(selected.dataset.index);
  const correctIndex = questions[quizState.currentQuestion].correct;
  
  quizState.answers.push({
    question: quizState.currentQuestion,
    selected: selectedIndex,
    correct: correctIndex
  });
  
  document.querySelectorAll(".quiz-option").forEach((opt, i) => {
    opt.classList.remove("selected");
    if (i === correctIndex) opt.classList.add("correct");
    else if (i === selectedIndex && selectedIndex !== correctIndex) opt.classList.add("incorrect");
  });
  
  const feedback = document.getElementById("quizFeedback");
  feedback.innerText = questions[quizState.currentQuestion].explanation;
  feedback.className = `quiz-feedback ${selectedIndex === correctIndex ? "correct" : "incorrect"} show`;
  
  document.getElementById("quizSubmit").innerText = "Continue";
  document.getElementById("quizSubmit").onclick = advanceQuiz;
}

function advanceQuiz() {
  const problem = document.getElementById("algoProblem").value;
  const questions = quizQuestions[problem];
  
  if (quizState.currentQuestion < questions.length - 1) {
    quizState.currentQuestion++;
    renderQuizQuestion(problem);
    document.getElementById("quizSubmit").onclick = submitQuizAnswer;
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  const correct = quizState.answers.filter(a => a.selected === a.correct).length;
  const total = quizState.answers.length;
  const score = Math.round((correct / total) * 100);
  
  document.querySelector(".quiz-content").style.display = "none";
  document.querySelector(".quiz-actions").style.display = "none";
  document.getElementById("quizResults").style.display = "block";
  
  document.getElementById("quizScore").innerHTML = 
    `<i class="fa-solid fa-star"></i> ${score}%`;
  
  document.getElementById("quizSummary").innerHTML = quizState.answers
    .map((a, i) => {
      const problem = document.getElementById("algoProblem").value;
      const q = quizQuestions[problem][a.question];
      return `<div class="quiz-summary-item">
        <span>Q${i + 1}: ${a.selected === a.correct ? '<span style="color:var(--success)">Correct</span>' : '<span style="color:var(--danger)">Incorrect</span>'}</span>
        <span>${a.selected === a.correct ? '✓' : '✗'}</span>
      </div>`;
    }).join("");
  
  quizState.completed = true;
  
  document.getElementById("quizRestart").onclick = restartQuiz;
  document.getElementById("quizClose").onclick = () => {
    document.getElementById("quizOverlay").style.display = "none";
  };
}

function restartQuiz() {
  const problem = document.getElementById("algoProblem").value;
  quizState = { currentQuestion: 0, answers: [], completed: false };
  document.getElementById("quizResults").style.display = "none";
  document.querySelector(".quiz-content").style.display = "block";
  document.querySelector(".quiz-actions").style.display = "flex";
  renderQuizQuestion(problem);
  document.getElementById("quizSubmit").onclick = submitQuizAnswer;
}

function closeQuiz() {
  document.getElementById("quizOverlay").style.display = "none";
}

// Step Tracker Actions
function stepForwardSimulation() {
  if (currentStepIdx < simSteps.length - 1) {
    currentStepIdx++;
    document.getElementById("statusDot").className = "status-dot warning";
    document.getElementById("statusText").innerText =
      `Computing state frame ${currentStepIdx + 1}`;
    renderTreeSnapshot();
  } else {
    pauseSimulation();
    document.getElementById("statusDot").className = "status-dot valid";
    document.getElementById("statusText").innerText = "Computation Complete!";
    const btnQuiz = document.getElementById("btnQuiz");
    if (btnQuiz) btnQuiz.classList.add("visible");
  }
}

function playSimulation() {
  document.getElementById("btnPlay").style.display = "none";
  document.getElementById("btnPause").style.display = "inline-flex";
  const speed = parseInt(document.getElementById("speedSlider").value);

  playInterval = setInterval(() => {
    stepForwardSimulation();
  }, speed);
}

function pauseSimulation() {
  document.getElementById("btnPlay").style.display = "inline-flex";
  document.getElementById("btnPause").style.display = "none";
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
}

// Context Micro-Tooltip Handlers
function showNodeTooltip(event, id, val, state) {
  const tooltip = document.getElementById("liveNodeTooltip");
  tooltip.style.display = "block";
  tooltip.style.opacity = "1";
  tooltip.style.left = event.clientX + 14 + "px";
  tooltip.style.top = event.clientY + 14 + "px";
  tooltip.innerHTML = `<strong>Node Frame:</strong> ${id}<br/><strong>Parameter Input:</strong> n = ${val}<br/><strong>Execution State:</strong> ${state}`;
}

function hideNodeTooltip() {
  const tooltip = document.getElementById("liveNodeTooltip");
  tooltip.style.display = "none";
  tooltip.style.opacity = "0";
}

// Self-start application frame on script evaluation
window.addEventListener("DOMContentLoaded", () => {
  initSimulationProblem();
  
  document.getElementById("quizSubmit").onclick = submitQuizAnswer;
  document.getElementById("quizSkip").onclick = closeQuiz;
});
