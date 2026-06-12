// Shared Theme Toggling Module
(function () {
  'use strict';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    // Broadcast event for custom redraw handlers (like canvas redrawing)
    window.dispatchEvent(new CustomEvent('themechanged', { detail: { theme } }));
  };

  // Initialize theme instantly to prevent flash of wrong theme
  const currentTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(currentTheme);

  // Bind to buttons once DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const bindToggle = (btn) => {
      const updateButtonUI = (theme) => {
        const icon = btn.querySelector('i');
        const span = btn.querySelector('span');
        if (icon) {
          icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
        if (span) {
          span.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
        }
      };

      // Initial state
      updateButtonUI(localStorage.getItem('theme') || 'dark');

      btn.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
        updateButtonUI(nextTheme);
      });
    };

    // Find and bind all potential theme toggle buttons
    const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleBtn');
    themeBtns.forEach(bindToggle);
  });
})();
