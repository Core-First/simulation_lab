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
4. [Deploying the Landing Page](#-deploying-the-landing-page)
5. [Pull Request Process](#-pull-request-process)
6. [Style Guidelines](#-style-guidelines)

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

Open `index.html` (the main dashboard) in your browser.

Use Live Server (VS Code extension) or any HTTP server for best results (some simulations use fetch or modules).

### Working with Parts

1. Determine which part you are working on (part-1 through part-6) based on the issue or feature you are addressing.
2. Switch to the `develop` branch: `git checkout develop` (ensure it's up to date).
3. Create a feature branch for your part: `git checkout -b feature/part-X-short-description` where X is the part number.
4. Work inside the corresponding folder: `part-X-<topic>/` (e.g., `part-1-sorting/`).
5. Make your changes, test, then commit and push.

---

## Deploying the Landing Page

The project includes a GitHub Actions workflow that automatically deploys the `public/` directory to GitHub Pages whenever code is pushed to the `web` branch.

### Prerequisites

Before deploying, ensure GitHub Pages is enabled in the repository settings:
- Go to `Settings > Pages` and set the source to GitHub Actions for the `web` branch (for the main landing page) or `main` branch (for full project).

### Automatic Deployment via the `web` Branch

1. **Switch to the `web` branch:**
   ```bash
   git checkout web
   git pull origin web
   ```

2. **Update files in `public/`:**
   Make any changes to the files inside the `public/` directory. These are the files that will be published to the live site.

   ```bash
   # Example: edit the landing page
   code public/index.html
   ```

3. **Stage, commit, and push to the `web` branch:**
   ```bash
   git add public/
   git commit -m "chore(deploy): update landing page content"
   git push origin web
   ```

4. **Trigger the GitHub Actions workflow:**
    The workflow file `.github/workflows/github_pages_deploy.yml` is configured with:

    ```yaml
    on:
      push:
        branches: [ web ]
      pull_request:
        branches: [ web ]
    ```

    Pushing to `web` automatically triggers the `Deploy to GitHub Pages` job.

5. **Monitor the deployment:**
    - Go to the `Actions` tab in the GitHub repository.
    - Select the `Deploy to GitHub Pages` workflow run.
    - Verify that the job completes successfully.

### Deployment Workflow Details

The workflow performs the following steps:

1. Checks out the repository.
2. Sets up GitHub Pages.
3. Uploads the `public/` directory as an artifact.
4. Deploys to GitHub Pages.

### Notes

- Pull requests targeting the `web` branch also trigger the deployment workflow.
- The `web` branch should be protected; only approved changes should be merged into it.
- Do not commit secrets or API keys to the `public/` directory.

---

## Pull Request Process

1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/amazing-simulation
   ```

2. Commit your changes with clear, descriptive messages.

3. Test your changes locally.

4. Push to your fork and open a Pull Request against the main branch.

5. Ensure the PR includes:
   - A clear description of what you changed.
   - Screenshots (if visual changes were made).
   - If you added a simulation, include the link to it in the PR description.
   - Link any issues your PR addresses (e.g., "Closes #42").
   - **Ensure your code passes the automated Sentinel Security checks.**

**Tip:** If you're adding a new simulation, create it in a standalone HTML file first, test it, then link it from the main dashboard.

---

## Style Guidelines

### HTML

- Use semantic HTML5 elements (`<nav>`, `<main>`, `<section>`, etc.).
- Keep inline styles minimal; use the shared CSS files instead.
- Use `data-*` attributes for interactive behavior where possible.

### CSS

- Use CSS Custom Properties (variables) for theming (light/dark mode).
- Add your new styles to `assets/css/main.css` or `assets/css/simulation-base.css`.
- Avoid `!important` unless absolutely necessary.
- Keep classes BEM-like when appropriate.

### JavaScript

- Use vanilla ES6+ JavaScript.
- No libraries beyond Bootstrap 5 and FontAwesome.
- Keep logic modular – separate rendering (`draw()`) from algorithm (`step()`).
- Use descriptive variable names (e.g., `comparisons`, `swaps`, `currentIndex`).
- Add comments for non-obvious logic (e.g., merging, recursion, pivot selection).
- **Security Requirements:** All `.innerHTML` assignments must be sanitized to pass the Sentinel Security Scanner. Wrap your HTML strings using DOMPurify: `el.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;`.

### Simulation Files

Each simulation HTML file must include:

- A header with title and controls (speed, step, reset).
- A canvas or DOM-based visualizer.
- A right panel with complexity counters and an AI Assistant box.
- Dark/light mode support (via the shared CSS).

### Testing

- Test on Chrome, Firefox, and Safari.
- Test mobile layout (sidebar hidden, responsiveness).
- Validate that the simulation runs without console errors.
