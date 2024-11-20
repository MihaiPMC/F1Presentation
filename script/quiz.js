document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");
  const nextButton = document.getElementById("next-question");
  const scoreDisplay = document.getElementById("score-display");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  // Fetch quiz questions from JSON
  fetch("data/quiz.json")
    .then((response) => response.json())
    .then((data) => {
      questions = data.questions;
      loadQuestion();
    })
    .catch((error) => console.error("Error fetching quiz data:", error));

  // Load a question
  function loadQuestion() {
    quizContainer.innerHTML = ""; // Clear previous content
    const question = questions[currentQuestionIndex];

    // Display question text
    const questionText = document.createElement("h3");
    questionText.textContent = question.text;
    quizContainer.appendChild(questionText);

    // Display answer choices
    question.choices.forEach((choice, index) => {
      const choiceButton = document.createElement("button");
      choiceButton.className = "choice-btn";
      choiceButton.textContent = choice;
      choiceButton.addEventListener("click", () => handleAnswer(index, question.correct));
      quizContainer.appendChild(choiceButton);
    });
  }

  // Handle answer selection
  function handleAnswer(selectedIndex, correctIndex) {
    const buttons = document.querySelectorAll(".choice-btn");
    buttons.forEach((button, index) => {
      if (index === correctIndex) {
        button.style.backgroundColor = "green";
      } else if (index === selectedIndex) {
        button.style.backgroundColor = "red";
      }
      button.disabled = true;
    });

    // Update score if the answer is correct
    if (selectedIndex === correctIndex) {
      score++;
      scoreDisplay.textContent = score;
    }

    // Enable the "Next Question" button
    nextButton.disabled = false;
  }

  // Move to the next question
  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion();
      nextButton.disabled = true;
    } else {
      showFinalScore();
    }
  });

  // Show final score
  function showFinalScore() {
    quizContainer.innerHTML = `
      <h3>Quiz Complete!</h3>
      <p>Your final score is ${score} out of ${questions.length}.</p>
    `;
    nextButton.style.display = "none";
  }
});
