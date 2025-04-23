const operations = ["+", "-", "*", "/"];
let currentQuestion = {};
let score = 0;
let questionCount = 0;
const maxQuestions = 5; // You can adjust the number of questions

// Function to generate a random math question
function generateQuestion() {
  const num1 = Math.floor(Math.random() * 20) + 1; // Random number between 1 and 20
  const num2 = Math.floor(Math.random() * 20) + 1;
  const operation = operations[Math.floor(Math.random() * operations.length)];

  currentQuestion = {
    num1: num1,
    num2: num2,
    operation: operation,
    answer: calculateAnswer(num1, num2, operation)
  };

  document.getElementById("question-container").textContent = `${num1} ${operation} ${num2}`;
}

// Function to calculate the answer based on the operation
function calculateAnswer(num1, num2, operation) {
  switch (operation) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return (num1 / num2).toFixed(2); // Round the division result to 2 decimal places
    default:
      return 0;
  }
}

// Function to handle submitting the answer
document.getElementById("submit-answer").addEventListener("click", () => {
  const userAnswer = parseFloat(document.getElementById("answer").value);
  if (userAnswer === currentQuestion.answer) {
    score++;
    document.getElementById("status").textContent = "Correct!";
  } else {
    document.getElementById("status").textContent = `Incorrect. The correct answer was ${currentQuestion.answer}`;
  }

  questionCount++;
  if (questionCount < maxQuestions) {
    setTimeout(generateQuestion, 1000); // Generate new question after 1 second
  } else {
    setTimeout(showResult, 1000); // Show result after all questions are done
  }
  document.getElementById("answer").value = ''; // Clear the input field
});

// Function to display the result after all questions
function showResult() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("result-container").style.display = "block";
  document.getElementById("result-message").textContent = `You scored ${score} out of ${maxQuestions}`;
}

// Start the quiz by generating the first question
generateQuestion();
