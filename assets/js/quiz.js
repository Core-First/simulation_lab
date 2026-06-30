// Shared Quiz Module for Simulations
// Export quiz state and functions for reuse across simulations

let quizState = {
  currentQuestion: 0,
  answers: [],
  completed: false
};

function initQuiz(questions, title) {
  quizState = { currentQuestion: 0, answers: [], completed: false };
  const overlay = document.getElementById("quizOverlay");
  if (!overlay) return null;
  
  overlay.style.display = "flex";
  
  const titleEl = document.getElementById("quizTitle");
  if (titleEl && title) {
    const html = `<i class="fa-solid fa-circle-question"></i> ${title}`;
    titleEl.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
  }
  
  // Ensure correct sub-panels are visible/hidden
  const contentEl = document.querySelector(".quiz-content");
  const actionsEl = document.querySelector(".quiz-actions");
  const resultsEl = document.getElementById("quizResults");
  if (contentEl) contentEl.style.display = "block";
  if (actionsEl) actionsEl.style.display = "flex";
  if (resultsEl) resultsEl.style.display = "none";

  renderQuizQuestion(questions);

  const submitEl = document.getElementById("quizSubmit");
  if (submitEl) submitEl.onclick = () => submitQuizAnswer(questions);

  const skipEl = document.getElementById("quizSkip");
  if (skipEl) skipEl.onclick = closeQuiz;

  const closeEl = document.getElementById("quizClose");
  if (closeEl) closeEl.onclick = closeQuiz;
  
  return questions;
}

function renderQuizQuestion(questions) {
  const q = questions[quizState.currentQuestion];
  if (!q) return;
  
  const questionText = q.question !== undefined ? q.question : q.q;
  const optionsList = q.options !== undefined ? q.options : q.o;
  
  const progressEl = document.getElementById("quizProgress");
  const questionEl = document.getElementById("quizQuestion");
  const optionsEl = document.getElementById("quizOptions");
  
  if (progressEl) progressEl.innerText = `Question ${quizState.currentQuestion + 1} of ${questions.length}`;
  if (questionEl) questionEl.innerText = questionText;
  if (optionsEl) {
    const html = optionsList
      .map((opt, i) => `<div class="quiz-option" data-index="${i}" onclick="selectQuizOption(this, ${i})">${opt}</div>`)
      .join("");
    optionsEl.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
  }
  
  const feedbackEl = document.getElementById("quizFeedback");
  if (feedbackEl) feedbackEl.classList.remove("show");
  
  const submitEl = document.getElementById("quizSubmit");
  if (submitEl) {
    submitEl.disabled = true;
    submitEl.innerText = "Submit Answer";
  }
}

function selectQuizOption(el, index) {
  document.querySelectorAll(".quiz-option").forEach(opt => opt.classList.remove("selected"));
  el.classList.add("selected");
  const submitEl = document.getElementById("quizSubmit");
  if (submitEl) submitEl.disabled = false;
}

function submitQuizAnswer(questions) {
  const selected = document.querySelector(".quiz-option.selected");
  if (!selected) return;
  
  const q = questions[quizState.currentQuestion];
  const selectedIndex = parseInt(selected.dataset.index);
  const correctIndex = q.correct !== undefined ? q.correct : q.a;
  
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
  
  const feedbackEl = document.getElementById("quizFeedback");
  if (feedbackEl) {
    feedbackEl.innerText = q.explanation !== undefined ? q.explanation : (q.e || "");
    feedbackEl.className = `quiz-feedback ${selectedIndex === correctIndex ? "correct" : "incorrect"} show`;
  }
  
  const submitEl = document.getElementById("quizSubmit");
  if (submitEl) {
    submitEl.innerText = "Continue";
    submitEl.onclick = () => advanceQuiz(questions);
  }
}

function advanceQuiz(questions) {
  if (quizState.currentQuestion < questions.length - 1) {
    quizState.currentQuestion++;
    renderQuizQuestion(questions);
    const submitEl = document.getElementById("quizSubmit");
    if (submitEl) submitEl.onclick = () => submitQuizAnswer(questions);
  } else {
    showQuizResults(questions);
  }
}

function showQuizResults(questions) {
  const correct = quizState.answers.filter(a => a.selected === a.correct).length;
  const total = quizState.answers.length;
  const score = Math.round((correct / total) * 100);
  
  const contentEl = document.querySelector(".quiz-content");
  const actionsEl = document.querySelector(".quiz-actions");
  const resultsEl = document.getElementById("quizResults");
  
  if (contentEl) contentEl.style.display = "none";
  if (actionsEl) actionsEl.style.display = "none";
  if (resultsEl) resultsEl.style.display = "block";
  
  const scoreEl = document.getElementById("quizScore");
  if (scoreEl) {
    const html = `<i class="fa-solid fa-star"></i> ${score}%`;
    scoreEl.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
  }
  
  const summaryEl = document.getElementById("quizSummary");
  if (summaryEl) {
    const html = quizState.answers.map((a, i) => {
      return `<div class="quiz-summary-item">
        <span>Q${i + 1}: ${a.selected === a.correct ? '<span style="color:var(--success)">Correct</span>' : '<span style="color:var(--danger)">Incorrect</span>'}</span>
        <span>${a.selected === a.correct ? '✓' : '✗'}</span>
      </div>`;
    }).join("");
    summaryEl.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;
  }
  
  quizState.completed = true;
  
  const restartEl = document.getElementById("quizRestart");
  const closeEl = document.getElementById("quizClose");
  
  if (restartEl) restartEl.onclick = () => restartQuiz(questions);
  if (closeEl) closeEl.onclick = closeQuiz;
}

function restartQuiz(questions) {
  quizState = { currentQuestion: 0, answers: [], completed: false };
  const resultsEl = document.getElementById("quizResults");
  const contentEl = document.querySelector(".quiz-content");
  const actionsEl = document.querySelector(".quiz-actions");
  
  if (resultsEl) resultsEl.style.display = "none";
  if (contentEl) contentEl.style.display = "block";
  if (actionsEl) actionsEl.style.display = "flex";
  
  renderQuizQuestion(questions);
  const submitEl = document.getElementById("quizSubmit");
  if (submitEl) submitEl.onclick = () => submitQuizAnswer(questions);
}

function closeQuiz() {
  const overlay = document.getElementById("quizOverlay");
  if (overlay) overlay.style.display = "none";
}

// Export for global use
window.quizModule = {
  quizState,
  initQuiz,
  renderQuizQuestion,
  selectQuizOption,
  submitQuizAnswer,
  advanceQuiz,
  showQuizResults,
  restartQuiz,
  closeQuiz
};