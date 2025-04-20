async function login() {
    const userId = prompt("Enter your user ID (e.g., kid123):");
    if (!userId) return;
    
    localStorage.setItem("userId", userId);

    // Optionally initialize progress (only if not already created)
    await saveProgressToAzure(userId, " ", 0);

    window.location.href = "home.html";
}

window.addEventListener("DOMContentLoaded", fetchProgress);

async function fetchProgress() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
        // ✅ Fetch directly from your public Azure Blob container
        const url = `https://minimindsrg9f5a.blob.core.windows.net/user-progress/${userId}.json`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Progress file not found for ${userId}`);
        }

        const data = await res.json();

        document.getElementById("userIdDisplay").textContent = data.userId || "Unknown";
        document.getElementById("levelDisplay").textContent = data.progress || "Level 0";
        document.getElementById("scoreDisplay").textContent = data.score || 0;
    } catch (error) {
        console.error("Error fetching progress:", error);
    }
}

async function saveProgress(userId, progress, score) {
    // Calls saveProgressToAzure in azure-upload.js
    await saveProgressToAzure(userId, progress, score);
}
