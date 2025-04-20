const shapes = [
    { emoji: "🔵", name: "circle" },
    { emoji: "🟥", name: "square" },
    { emoji: "🔺", name: "triangle" },
    { emoji: "⭐", name: "star" },
    { emoji: "⬡", name: "hexagon" }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  let currentShape = {};
  
  function showNextShape() {
    if (currentQuestion >= 3) {
      document.getElementById("finalScore").style.display = "block";
      document.getElementById("finalScore").innerHTML = `✅ You scored ${score}/3! Saving progress...`;
  
      const userId = localStorage.getItem("userId");
      saveProgress(userId, "Level 1 - Shapes", score * 100); // Save via Azure
  
      setTimeout(() => {
        window.location.href = "progress.html";
      }, 2000);
      return;
    }
  
    currentShape = shapes[Math.floor(Math.random() * shapes.length)];
    document.getElementById("shapeDisplay").textContent = currentShape.emoji;
    document.getElementById("questionNum").textContent = `Question ${currentQuestion + 1} of 3`;
    document.getElementById("shapeInput").value = "";
    document.getElementById("feedback").textContent = "";
  }
  
  function submitAnswer() {
    const answer = document.getElementById("shapeInput").value.trim().toLowerCase();
    if (answer === currentShape.name.toLowerCase()) {
      score++;
      document.getElementById("feedback").textContent = "✅ Correct!";
    } else {
      document.getElementById("feedback").textContent = `❌ Oops! It was a ${currentShape.name}.`;
    }
  
    currentQuestion++;
    setTimeout(showNextShape, 1000);
  }
  
  window.addEventListener("DOMContentLoaded", showNextShape);
  window.submitAnswer = submitAnswer;
  