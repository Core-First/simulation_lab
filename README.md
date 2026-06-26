# Simulation Lab Project

# ATC SimLab DSA Practical Guides

## Project Overview

ATC SimLab DSA Practical Guides is a comprehensive, interactive learning platform for Data Structures and Algorithms. It contains 16 visual simulations covering Sorting, Searching, Linear Data Structures, Recursive Data Structures, Graphs, and Algorithm Design Paradigms. Each simulation provides real-time visual feedback, complexity counters, and an integrated AI assistant to reinforce conceptual understanding.

## Tech Stack

The project is built entirely with client-side web technologies and requires no build tools or server.

- HTML5
- CSS3 (Custom Properties for theming)
- Bootstrap 5.3 (Grid, Collapse, Responsive utilities)
- FontAwesome 6.4 (Icons)
- Vanilla JavaScript (ES6+)
- Canvas API (for algorithm visualisation)

All dependencies are loaded via CDN. The project follows a modular architecture with shared assets and separate HTML files for each simulation.

## Folder Structure
```html
simulation_lab/
+-- assets/
   +-- css/
   +-- main.css               # Shared styles (Bootstrap overrides, dark/light theme)
   +-- simulation-base.css    # Common layout for all sims (canvas, controls, AI panel)
+-- js/
   +-- utils.js               # Helper functions (random array, timer, animation queue)
   +-- visualizer-core.js     # Shared canvas logic (bar drawing, swapping, pointer)
   +-- ai-assistant.js        # AI prompt logic (can be reused across sims)
+-- main.js                # Main dashboard JavaScript (theme, sidebar, navigation)
+-- icons/                     # Custom SVGs for visual metaphors (optional)
+-- .github/
   +-- workflows/
   +-- secure-low-code-detector.yml  # Security and low-code detection workflow
   +-- dependabot.yml               # Dependency updates
   +-- dependabot.yml                   # Dependabot configuration
+-- .semgrep/
   +-- custom-rules.yml                 # Semgrep custom rules for code quality
+-- part-1-sorting/
   +-- index.html                 # Part 1 landing page (links to simulations below)
   +-- sim-01-bubble-sort.html
   +-- sim-02-selection-sort.html
   +-- sim-03-insertion-sort.html
   +-- sim-04-merge-sort.html
   +-- sim-05-quick-sort.html
+-- part-2-searching/
   +-- index.html
   +-- sim-06-linear-binary-search.html
   +-- sim-07-hashing-collision.html
+-- part-3-linear-data-structures/
   +-- index.html
   +-- sim-08-singly-linked-list.html
   +-- sim-09-stack-queue.html
+-- part-4-recursive-data-structures/
   +-- index.html
   +-- sim-10-bst.html
   +-- sim-11-avl-red-black.html
   +-- sim-12-heap-priority-queue.html
+-- part-5-graphs/
   +-- index.html
   +-- sim-13-bfs-dfs.html
   +-- sim-14-dijkstra.html
+-- part-6-algorithm-design/
    +-- index.html
    +-- sim-15-dp-memoization.html
    +-- sim-16-backtracking-nqueens.html
```

## How to Run

This is a static HTML project. No installation or build step is required.

1. Clone the repository.
2. Open `index.html` in any modern browser.
3. For the best experience with local file security (CORS issues with some simulation modules), use a local HTTP server (e.g., VS Code Live Server, `python -m http.server`, or `npx serve`).

## Contribution Guidelines

Please read the `CONTRIBUTING.md` file before submitting any pull requests. It outlines the folder structure, style guidelines, and simulation standards.

## A Special Caution for Vibe Coders

If you are participating in this project using "vibe coding" (generating large chunks of code via LLMs and pasting them in), please take careful note:

- This project is **NOT** a React, Vue, or Angular application. Do not generate React components or JSX. Everything must be vanilla HTML, CSS, and JavaScript.
- Do not try to force a single-file approach for the entire project. Each simulation must live in its own standalone HTML file inside the correct folder (e.g., `part-1-sorting/sim-01-bubble-sort.html`).
- The AI Assistant prompts must be hardcoded strings inside each simulation file, not dynamic API calls. The project does not have a backend.
- Do not replace the Canvas-based visualisation with DOM-based alternatives unless specifically requested. The core visualisation engine uses the HTML5 Canvas API.
- Make sure your generated code respects the `light-theme` CSS class toggling. The project uses CSS variables for theming. Hardcoding colors will break the light/dark mode toggle.
- Do not add any NPM packages, yarn, pnpm, or build tools. The project is designed to work entirely from CDN-loaded files.

If you generate code that assumes a React build environment, Webpack, or an API backend, your pull request will be rejected. Please vibe responsibly.

## Git Workflow

### Branch Strategy

| Branch       | Purpose |
|--------------|---------|
| `stage`      | Production-ready code; always contains a running, stable project before any merge to `main` |
| `develop`    | Integration branch for features; contains the latest development work |
| `main`       | Stable production release branch |
| `feature/*`  | Personal feature branches containing new features being developed |
| `hotfix/*`   | Contains urgent fixes to be merged into `develop` |

### Branch Usage

**`stage`** - Currently serves as the pre-production branch. Always contains a running, stable project before any merge to `main`. Use this for final testing and staging.

**`develop`** - The primary integration branch. All completed features should be merged here. This is where CI/CD pipelines run tests and quality checks.

**`hotfix/*`** - Used for urgent fixes. Branch from `develop`, apply the fix, then merge back into `develop` via pull request.

### Pull Request Process

1. Create a personal feature branch from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with clear messages.

3. Open a pull request **against `develop`** (not `main` or `stage`):
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open PR via GitHub UI or `gh pr create --base develop`.

4. Ensure CI checks pass and get approval before merge.

5. After merge, the feature will be integrated into `develop` and eventually promoted to `stage` for staging tests.

## License

Will be validated later
