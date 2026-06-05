// sorting-tour.js
// Provides the interactive guided tour for sorting algorithm simulations

let tourSteps = [
  {
    target: 'tour-canvas',
    title: 'Interactive Canvas',
    text: 'This is where the algorithm visually comes to life. Watch elements get compared, swapped, and sorted in real-time.',
    placement: 'bottom'
  },
  {
    target: 'tour-controls',
    title: 'Configuration',
    text: 'Adjust the size of the array, playback speed, and initial ordering here. You can even input your own custom values!',
    placement: 'left'
  },
  {
    target: 'tour-stats',
    title: 'Live Statistics',
    text: 'Keep an eye on how many comparisons and swaps the algorithm makes as it runs. This helps you understand its efficiency.',
    placement: 'left'
  },
  {
    target: 'tour-code',
    title: 'Execution Code',
    text: 'View the actual JavaScript code that corresponds to the algorithm running. Watch as the logic flows.',
    placement: 'left'
  },
  {
    target: 'tour-info',
    title: 'Algorithm Details',
    text: 'Read up on the theoretical complexities, best/worst cases, and whether the sort is stable or in-place.',
    placement: 'right'
  },
  {
    target: 'tour-ai',
    title: 'AI Assistant',
    text: 'Stuck? Ask the context-aware AI any question about the algorithm and get an instant explanation!',
    placement: 'right'
  }
];

let currentTourStep = 0;
let tourOverlay, tourTooltip, tourTitle, tourText;

function initTourDOMElements() {
  tourOverlay = document.getElementById('guidedTour');
  tourTooltip = document.getElementById('tourTooltip');
  tourTitle = document.getElementById('tourTitle');
  tourText = document.getElementById('tourText');

  document.getElementById('startTourBtn').addEventListener('click', startTour);
  document.getElementById('tourSkip').addEventListener('click', endTour);
  document.getElementById('tourNext').addEventListener('click', nextTourStep);
}

function startTour() {
  currentTourStep = 0;
  tourOverlay.style.display = 'block';
  showTourStep();
}

function showTourStep() {
  if (currentTourStep >= tourSteps.length) {
    endTour();
    return;
  }

  const step = tourSteps[currentTourStep];
  tourTitle.innerText = step.title;
  tourText.innerText = step.text;

  // Reset highlights
  document.querySelectorAll('.tour-highlight').forEach(el => {
    el.classList.remove('tour-highlight');
    el.style.zIndex = '';
    el.style.position = '';
    el.style.pointerEvents = '';
  });

  const targetEl = document.getElementById(step.target);
  if (targetEl) {
    targetEl.classList.add('tour-highlight');
    targetEl.style.zIndex = '10001';
    targetEl.style.position = 'relative';
    targetEl.style.pointerEvents = 'none';

    // Position tooltip
    const rect = targetEl.getBoundingClientRect();
    
    // Simple positioning logic
    let top = rect.top + window.scrollY;
    let left = rect.left + window.scrollX;

    if (step.placement === 'bottom') {
      top += rect.height + 15;
      left += (rect.width / 2) - 160; // center tooltip
    } else if (step.placement === 'left') {
      top += 10;
      left -= 340;
    } else if (step.placement === 'right') {
      top += 10;
      left += rect.width + 15;
    }

    // Keep on screen bounds
    top = Math.max(10, Math.min(top, window.innerHeight - 200));
    left = Math.max(10, Math.min(left, window.innerWidth - 340));

    tourTooltip.style.top = top + 'px';
    tourTooltip.style.left = left + 'px';

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.getElementById('tourNext').innerHTML = currentTourStep === tourSteps.length - 1 ? 'Finish' : 'Next <i class="fa-solid fa-arrow-right ms-1"></i>';
}

function nextTourStep() {
  currentTourStep++;
  showTourStep();
}

function endTour() {
  tourOverlay.style.display = 'none';
  document.querySelectorAll('.tour-highlight').forEach(el => {
    el.classList.remove('tour-highlight');
    el.style.zIndex = '';
    el.style.position = '';
    el.style.pointerEvents = '';
  });
}

document.addEventListener('DOMContentLoaded', initTourDOMElements);
