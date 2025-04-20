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
    try{
    const res = await fetch("https://miniminds-backend.azurewebsites.net/api/getProgress?");
    const data = await res.json();
    console.log("User progress:", data);

    // Dynamically update the UI with fetched data
    document.getElementById("userIdDisplay").textContent = data.userId || "Unknown";
    document.getElementById("levelDisplay").textContent = data.progress || "Level 0";
    document.getElementById("scoreDisplay").textContent = data.score || 0;
  }catch (error) {
    console.error("Error fetching progress:", error);
  }
}
  
  // Call the fetch function when the page is ready
  window.addEventListener("DOMContentLoaded", fetchProgress);
  

  async function saveProgress(userId, progress, score) {
    const res = await fetch("https://miniminds-backend.azurewebsites.net/api/saveProgress?", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, progress, score })
    });
  
    const result = await res.json();
    console.log("Save response:", result);
  }
   
    //Then, on some action (like a button), call it like this:
    //const userId = localStorage.getItem("userId");
    //saveProgress(userId, "Level 2 - Colors", 160);
