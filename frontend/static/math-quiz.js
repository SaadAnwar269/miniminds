const questions = [
    { type: 'addition', operator: '+', min: 1, max: 20 },
    { type: 'subtraction', operator: '-', min: 1, max: 20 },
    { type: 'multiplication', operator: '*', min: 1, max: 20 },
    { type: 'division', operator: '/', min: 1, max: 20 }
  ];
  
  let currentQuestion;
  let correctAnswer;
  let attempts = 0;
  
  document.addEventListener("DOMContentLoaded", () => {
    generateQuestion();
  
    const submitButton = document.getElementById('submit-answer');
    submitButton.addEventListener('click', checkAnswer);
  });
  
  function generateQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[randomIndex];
    
    const num1 = Math.floor(Math.random() * (currentQuestion.max - currentQuestion.min + 1)) + currentQuestion.min;
    const num2 = Math.floor(Math.random() * (currentQuestion.max - currentQuestion.min + 1)) + currentQuestion.min;
    
    let questionText = '';
    
    switch (currentQuestion.type) {
      case 'addition':
        questionText = `${num1} + ${num2}`;
        correctAnswer = num1 + num2;
        break;
      case 'subtraction':
        questionText = `${num1} - ${num2}`;
        correctAnswer = num1 - num2;
        break;
      case 'multiplication':
        questionText = `${num1} * ${num2}`;
        correctAnswer = num1 * num2;
        break;
      case 'division':
        questionText = `${num1 * num2} / ${num2}`;
        correctAnswer = num1;
        break;
    }
  
    document.getElementById('question').textContent = questionText;
  }
  
  function checkAnswer() {
    const answerField = document.getElementById('answer');
    const userAnswer = parseInt(answerField.value, 10);
  
    if (userAnswer === correctAnswer) {
      attempts++;
      document.getElementById('status').textContent = `Correct! You've answered ${attempts} question(s).`;
      if (attempts === 5) {
        showResult(true);
      } else {
        setTimeout(() => {
          answerField.value = '';
          generateQuestion();
        }, 1000);
      }
    } else {
      document.getElementById('status').textContent = 'Incorrect. Try again!';
    }
  }
  
  function showResult(success) {
    const resultMessage = success ? 'Congratulations! You completed the quiz.' : 'Try again!';
    document.getElementById('result-message').textContent = resultMessage;
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('back-to-game').style.display = 'inline-block';
  }
  