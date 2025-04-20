function login() {
    const userId = "test_kid123";
    localStorage.setItem("userId", userId);
    localStorage.setItem("level", 1);
    localStorage.setItem("score", 50);
    window.location.href = "home.html";
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    const userIdDisplay = document.getElementById("userIdDisplay");
    const levelDisplay = document.getElementById("levelDisplay");
    const scoreDisplay = document.getElementById("scoreDisplay");
  
    if (userIdDisplay && levelDisplay && scoreDisplay) {
      const userId = localStorage.getItem("userId") || "Unknown";
      const level = localStorage.getItem("level") || 0;
      const score = localStorage.getItem("score") || 0;
  
      userIdDisplay.textContent = userId;
      levelDisplay.textContent = level;
      scoreDisplay.textContent = score;
    }
  });
  
  async function fetchProgress() {
    const res = await fetch("https://miniminds-backend.azurewebsites.net/api/getProgress?");
    const data = await res.json();
    console.log("User progress:", data);
  }
  
  fetchProgress();
  