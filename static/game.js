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
    // 🎉 Create and show the popup
    showCompletionPopup();

    const userId = localStorage.getItem("userId");
    const pointsEarned = score * 30;

    // 2. Save to backend
    fetch('/update_progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ score_increment: pointsEarned })
    })
    .then(response => response.json())
    .then(data => {
      if (data.new_score !== undefined) {
        console.log("✅ Backend progress updated. New score:", data.new_score);
      } else {
        console.warn("⚠️ Failed to update backend progress.");
      }
    })
    .catch(error => {
      console.error('Error updating backend progress:', error);
    });

    setTimeout(() => {
      window.location.href = "/progress"; // Redirect after popup
    }, 2500);

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

function showCompletionPopup() {
  const popup = document.createElement("div");
  popup.innerHTML = `
    🎉 Level Complete! <br> You scored ${score}/3! <br> Great job! 🌟
  `;
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "#ffe066";
  popup.style.color = "#333";
  popup.style.padding = "30px";
  popup.style.borderRadius = "20px";
  popup.style.boxShadow = "0px 4px 20px rgba(0, 0, 0, 0.3)";
  popup.style.fontSize = "24px";
  popup.style.textAlign = "center";
  popup.style.zIndex = "9999";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 2000);
}

window.addEventListener("DOMContentLoaded", showNextShape);
window.submitAnswer = submitAnswer;
