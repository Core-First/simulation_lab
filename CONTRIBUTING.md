# Contributing to ATC SimLab DSA Practical Guides

This project aims to make learning Data Structures and Algorithms interactive, visual, and accessible. Whether you're fixing a bug, adding a new simulation, improving the UI, or writing documentation, your help is greatly appreciated.

## Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [How Can I Contribute?](#-how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Adding a New Simulation](#adding-a-new-simulation)
   - [Improving Existing Simulations](#improving-existing-simulations)
3. [Development Setup](#-development-setup)
4. [Pull Request Process](#-pull-request-process)
5. [Style Guidelines](#-style-guidelines)

---

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct. By participating, you agree to uphold this standard of respectful, inclusive collaboration.

---

## How Can I Contribute?

### Reporting Bugs

- Search the issue tracker first to avoid duplicates.
- Use a clear, descriptive title.
- Include steps to reproduce, expected behavior, and actual behavior.
- Add screenshots or GIFs for visual bugs (especially in simulations).

### Suggesting Enhancements

- Describe the improvement and why it would be valuable.
- If adding a UI feature, mention if it should follow the existing dark/light theme.
- For AI Assistant prompts, suggest better conceptual questions that help students understand the algorithm.

### Adding a New Simulation

The project follows a modular structure. To add a **new simulation**:

1. **Identify the Part** – Sorting, Searching, Linear Data Structures, etc.
2. **Create the HTML file** inside the appropriate folder (e.g., `part-1-sorting/sim-XX-your-algorithm.html`).
3. **Use the Template** – Copy one of the existing simulation files (e.g., `sim-01-bubble-sort.html`) as a starting point.
4. **Replace the logic** – Update the `step()` function with the new algorithm's logic.
5. **Update the complexity counters** – Comparisons, swaps, recursion depth, etc.
6. **Add an AI prompt** – A question that appears in the right panel to guide learning.
7. **Test** – Ensure the simulation works on desktop and mobile views.
8. **Add the link** – Add the simulation to the dropdown in the main dashboard's sidebar.

### Improving Existing Simulations

- Speed up or improve animation transitions.
- Add new control options (e.g., random array regeneration, custom array input).
- Fix any wrong complexity counts or visual bugs.
- Enhance the AI Assistant prompt to be more helpful.

---

## Development Setup

The project is **self-contained** and requires no build tools. You can run it directly in any modern browser.

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://git@github.com:Core-First/simulation_lab.git
   cd simulation_lab
   ```

Open index.html (the main dashboard) in your browser.

Use Live Server (VS Code extension) or any HTTP server for best results (some simulations use fetch or modules).

### Working with Parts

1. Determine which part you are working on (part-1 through part-6) based on the issue or feature you are addressing.
2. Switch to the `develop` branch: `git checkout develop` (ensure it's up to date).
3. Create a feature branch for your part: `git checkout -b feature/part-X-short-description` where X is the part number.
4. Work inside the corresponding folder: `part-X-<topic>/` (e.g., `part-1-sorting/`).
5. Make your changes, test, then commit and push.

Pull Request Process
Fork the repository and create your feature branch (git checkout -b feature/amazing-simulation).

Commit your changes with clear, descriptive messages.

Test your changes locally.

Push to your fork and open a Pull Request against the main branch.

Ensure the PR includes:

A clear description of what you changed.

Screenshots (if visual changes were made).

If you added a simulation, include the link to it in the PR description.

Link any issues your PR addresses (e.g., "Closes #42").

Tip: If you’re adding a new simulation, create it in a standalone HTML file first, test it, then link it from the main dashboard.

Style Guidelines
HTML
Use semantic HTML5 elements (<nav>, <main>, <section>, etc.).

Keep inline styles minimal; use the shared CSS files instead.

Use data-\* attributes for interactive behavior where possible.

CSS
Use CSS Custom Properties (variables) for theming (light/dark mode).

Add your new styles to assets/css/main.css or assets/css/simulation-base.css.

Avoid !important unless absolutely necessary.

Keep classes BEM-like when appropriate.

JavaScript
Use vanilla ES6+ JavaScript.

No libraries beyond Bootstrap 5 and FontAwesome.

Keep logic modular – separate rendering (draw()) from algorithm (step()).

Use descriptive variable names (e.g., comparisons, swaps, currentIndex).

Add comments for non-obvious logic (e.g., merging, recursion, pivot selection).

Simulation Files
Each simulation HTML file must include:

A header with title and controls (speed, step, reset).

A canvas or DOM-based visualizer.

A right panel with complexity counters and an AI Assistant box.

Dark/light mode support (via the shared CSS).

Testing
Test on Chrome, Firefox, and Safari.

Test mobile layout (sidebar hidden, responsiveness).

Validate that the simulation runs without console errors.
