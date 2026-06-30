// Sidebar active state (top-level links only — skip nested submenu links here)
document
  .querySelectorAll("nav > .nav-link-custom, .sidebar-footer .nav-link-custom")
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".nav-link-custom")
        .forEach((l) => l.classList.remove("active"));
      document
        .querySelectorAll(".submenu .sub-link")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      document.getElementById("sidebar").classList.remove("open");
      document.getElementById("backdrop").classList.remove("show");
    });
  });

// Hamburger
const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
document.getElementById("hamburger").addEventListener("click", () => {
  sidebar.classList.toggle("open");
  backdrop.classList.toggle("show");
});
backdrop.addEventListener("click", () => {
  sidebar.classList.remove("open");
  backdrop.classList.remove("show");
});

// Build DSA Practical Guides nested dropdown
const dsaData = [
  {
    part: "Part 1: Sorting Algorithms Lab Suite",
    sims: [
      "Simulation 1: Bubble Sort",
      "Simulation 2: Selection Sort",
      "Simulation 3: Insertion Sort",
      "Simulation 4: Merge Sort",
      "Simulation 5: Quick Sort",
    ],
  },
  {
    part: "Part 2: Searching Algorithms Lab Suite",
    sims: [
      "Simulation 6: Linear vs Binary Search",
      "Simulation 7: Hashing and Collision Resolution",
    ],
  },
  {
    part: "Part 3: Linear Data Structures Lab Suite",
    sims: [
      "Simulation 8: Singly Linked List Visualiser",
      "Simulation 9: Stack and Queue Visualiser",
    ],
  },
  {
    part: "Part 4: Recursive Data Structures Lab Suite",
    sims: [
      "Simulation 10: Binary Search Tree (BST) Visualiser",
      "Simulation 11: AVL Tree / Red-Black Tree",
      "Simulation 12: Heap / Priority Queue",
    ],
  },
  {
    part: "Part 5: Graph Algorithms Lab Suite",
    sims: [
      "Simulation 13: BFS vs DFS Graph Traversal",
      "Simulation 14: Dijkstra's Algorithm (Shortest Path)",
    ],
  },
  {
    part: "Part 6: Algorithm Design Paradigms",
    sims: [
      "Simulation 15: Dynamic Programming (Memoization)",
      "Simulation 16: Backtracking (N-Queens / Sudoku Solver)",
    ],
  },
];

// Simulation file path mapping
const simPaths = {
  "Simulation 1: Bubble Sort": "part-1-sorting/sim-01-bubble-sort.html",
  "Simulation 2: Selection Sort": "part-1-sorting/sim-02-selection-sort.html",
  "Simulation 3: Insertion Sort": "part-1-sorting/sim-03-insertion-sort.html",
  "Simulation 4: Merge Sort": "part-1-sorting/sim-04-merge-sort.html",
  "Simulation 5: Quick Sort": "part-1-sorting/sim-05-quick-sort.html",
  "Simulation 6: Linear vs Binary Search": "part-2-searching/sim-06-linear-binary-search.html",
  "Simulation 7: Hashing and Collision Resolution": "part-2-searching/sim-07-hashing-collision.html",
  "Simulation 8: Singly Linked List Visualiser": "part-3-linear-data-structures/sim-08-singly-linked-list.html",
  "Simulation 9: Stack and Queue Visualiser": "part-3-linear-data-structures/sim-09-stack-queue.html",
  "Simulation 10: Binary Search Tree (BST) Visualiser":
    "part-4-recursive-data-structures/sim-10-bst.html",
  "Simulation 11: AVL Tree / Red-Black Tree":
    "part-4-recursive-data-structures/sim-11-avl-red-black.html",
  "Simulation 12: Heap / Priority Queue":
    "part-4-recursive-data-structures/sim-12-heap-priority-queue.html",
  "Simulation 15: Dynamic Programming (Memoization)":
    "part-6-algorithm-design/sim-15-dp-memoization.html",
  "Simulation 16: Backtracking (N-Queens / Sudoku Solver)":
    "part-6-algorithm-design/sim-16-backtracking-nqueens.html",
};

const dsaRoot = document.querySelector("#dsaMenu .submenu");
dsaData.forEach((p, i) => {
  const partId = `dsaPart${i}`;
  const isReady = i === 0 || i === 1 || i === 2 || i === 3 || i === 5;
  const li = document.createElement("li");
  const html = `
    <button class="nav-toggle collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${partId}" aria-expanded="false">
      <i class="fa-solid fa-book lead-icon"></i> ${p.part}${isReady ? '<span class="status-dot valid" style="width:10px;height:10px;"></span>' : ""}
      <i class="fa-solid fa-chevron-right chev"></i>
    </button>
    <div class="collapse" id="${partId}">
      <ul class="submenu">
        ${p.sims
          .map((s) => {
            const href = simPaths[s] || "#";
            const hasGlow = simPaths[s] && href !== "#";
            return `<li><a href="${href}" class="sub-link">${hasGlow ? '<span class="status-dot valid" style="width:10px;height:10px;"></span>' : '<i class="fa-solid fa-circle"></i>'} ${s}</a></li>`;
          })
          .join("")}
      </ul>
    </div>
  `;
  li.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
  dsaRoot.appendChild(li);
});

// Simulation click handling
document.querySelectorAll("#dsaMenu .sub-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && href !== "#") {
      // Allow navigation to simulation files
      return;
    }
    e.preventDefault();
    document
      .querySelectorAll(".nav-link-custom")
      .forEach((l) => l.classList.remove("active"));
    document
      .querySelectorAll(".submenu .sub-link")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    console.log("Navigating to:", link.textContent.trim());
    if (window.innerWidth < 992) {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    }
  });
});
