async function login() {
    const userId = prompt("Enter your user ID (e.g., kid123):");
    localStorage.setItem("userId", userId);
  
    // Set initial progress (optional if not already on Azure)
    await saveProgressToAzure(userId, " ", 0);
    window.location.href = "home.html";
  }
  
  window.addEventListener("DOMContentLoaded", fetchProgress);
  
  async function fetchProgress() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    try {
      const url = `https://<your-storage-account>.blob.core.windows.net/user-progress/${userId}.json`;
      const res = await fetch(url);
      const data = await res.json();
  
      document.getElementById("userIdDisplay").textContent = data.userId || "Unknown";
      document.getElementById("levelDisplay").textContent = data.progress || "Level 0";
      document.getElementById("scoreDisplay").textContent = data.score || 0;
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  }
  
  async function saveProgress(userId, progress, score) {
    await saveProgressToAzure(userId, progress, score); // from azure-upload.js
  }
  