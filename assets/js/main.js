  // Theme toggle
  const themeBtn = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i><span>Light Mode</span>';
    } else {
      document.body.classList.remove('light-theme');
      themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i><span>Dark Mode</span>';
    }
  };
  applyTheme(localStorage.getItem('theme') || 'dark');
  themeBtn.addEventListener('click', () => {
    const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  // Sidebar active state (top-level links only — skip nested submenu links here)
  document.querySelectorAll('nav > .nav-link-custom, .sidebar-footer .nav-link-custom').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link-custom').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.submenu .sub-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('backdrop').classList.remove('show');
    });
  });

  // Hamburger
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  document.getElementById('hamburger').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    backdrop.classList.toggle('show');
  });
  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
  });

  // Build DSA Practical Guides nested dropdown
  const dsaData = [
    { part: 'Part 1: Sorting Algorithms Lab Suite', sims: [
      'Simulation 1: Bubble Sort',
      'Simulation 2: Selection Sort',
      'Simulation 3: Insertion Sort',
      'Simulation 4: Merge Sort',
      'Simulation 5: Quick Sort',
    ]},
    { part: 'Part 2: Searching Algorithms Lab Suite', sims: [
      'Simulation 6: Linear vs Binary Search',
      'Simulation 7: Hashing and Collision Resolution',
    ]},
    { part: 'Part 3: Linear Data Structures Lab Suite', sims: [
      'Simulation 8: Singly Linked List Visualiser',
      'Simulation 9: Stack and Queue Visualiser',
    ]},
    { part: 'Part 4: Recursive Data Structures Lab Suite', sims: [
      'Simulation 10: Binary Search Tree (BST) Visualiser',
      'Simulation 11: AVL Tree / Red-Black Tree',
      'Simulation 12: Heap / Priority Queue',
    ]},
    { part: 'Part 5: Graph Algorithms Lab Suite', sims: [
      'Simulation 13: BFS vs DFS Graph Traversal',
      "Simulation 14: Dijkstra's Algorithm (Shortest Path)",
    ]},
    { part: 'Part 6: Algorithm Design Paradigms', sims: [
      'Simulation 15: Dynamic Programming (Memoization)',
      'Simulation 16: Backtracking (N-Queens / Sudoku Solver)',
    ]},
  ];

  // Simulation file path mapping
  const simPaths = {
    'Simulation 15: Dynamic Programming (Memoization)': 'part-6-algorithm-design/sim-15-dp-memoization.html',
    'Simulation 16: Backtracking (N-Queens / Sudoku Solver)': 'part-6-algorithm-design/sim-16-backtracking-nqueens.html',
  };

  const dsaRoot = document.querySelector('#dsaMenu .submenu');
  dsaData.forEach((p, i) => {
    const partId = `dsaPart${i}`;
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="nav-toggle collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${partId}" aria-expanded="false">
        <i class="fa-solid fa-book lead-icon"></i> ${p.part}
        <i class="fa-solid fa-chevron-right chev"></i>
      </button>
      <div class="collapse" id="${partId}">
        <ul class="submenu">
          ${p.sims.map(s => {
            const href = simPaths[s] || '#';
            return `<li><a href="${href}" class="sub-link"><i class="fa-solid fa-circle"></i> ${s}</a></li>`;
          }).join('')}
        </ul>
      </div>
    `;
    dsaRoot.appendChild(li);
  });

  // Simulation click handling
  document.querySelectorAll('#dsaMenu .sub-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        // Allow navigation to simulation files
        return;
      }
      e.preventDefault();
      document.querySelectorAll('.nav-link-custom').forEach(l => l.classList.remove('active'));
      document.querySelectorAll('.submenu .sub-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      console.log('Navigating to:', link.textContent.trim());
      if (window.innerWidth < 992) {
        sidebar.classList.remove('open');
        backdrop.classList.remove('show');
      }
    });
  });