# Simulation Lab Project Structure

```
📦 dsa-practical-guides/
├── 📂 assets/
│   ├── 📂 css/
│   │   ├── main.css               # Shared styles (Bootstrap overrides, dark/light theme)
│   │   └── simulation-base.css    # Common layout for all sims (canvas, controls, AI panel)
│   ├── 📂 js/
│   │   ├── utils.js               # Helper functions (random array, timer, animation queue)
│   │   ├── visualizer-core.js     # Shared canvas logic (bar drawing, swapping, pointer)
│   │   └── ai-assistant.js        # AI prompt logic (can be reused across sims)
│   └── 📂 icons/                  # Custom SVGs for visual metaphors (optional)
│
├── 📂 part-1-sorting/
│   ├── index.html                 # Part 1 landing page (links to simulations below)
│   ├── sim-01-bubble-sort.html
│   ├── sim-02-selection-sort.html
│   ├── sim-03-insertion-sort.html
│   ├── sim-04-merge-sort.html
│   └── sim-05-quick-sort.html
│
├── 📂 part-2-searching/
│   ├── index.html
│   ├── sim-06-linear-binary-search.html
│   └── sim-07-hashing-collision.html
│
├── 📂 part-3-linear-data-structures/
│   ├── index.html
│   ├── sim-08-singly-linked-list.html
│   └── sim-09-stack-queue.html
│
├── 📂 part-4-recursive-data-structures/
│   ├── index.html
│   ├── sim-10-bst.html
│   ├── sim-11-avl-red-black.html
│   └── sim-12-heap-priority-queue.html
│
├── 📂 part-5-graphs/
│   ├── index.html
│   ├── sim-13-bfs-dfs.html
│   └── sim-14-dijkstra.html
│
└── 📂 part-6-algorithm-design/
    ├── index.html
    ├── sim-15-dp-memoization.html
    └── sim-16-backtracking-nqueens.html
```