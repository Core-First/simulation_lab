(function () {
  function getHighlightLine(step) {
    if (step.type === 'compare') return 7; // line where compare highlighted
    if (step.type === 'swap') return 8; // line where swap highlighted
    if (step.type === 'pass') return 4; // line for pass/iteration
    return -1;
  }
  // expose globally for the simulation script
  window.getHighlightLine = getHighlightLine;
})();
