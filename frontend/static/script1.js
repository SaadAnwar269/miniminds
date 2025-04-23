const words = ["APPLE", "SUN", "CAT", "DOG", "FISH"];
const gridSize = 10;
const grid = document.getElementById("grid");
const wordList = document.getElementById("word-list");
const status = document.getElementById("status");
const backButton = document.createElement("a");
backButton.href = "game.html"; // Link to go back to the game page
backButton.id = "back-button";
backButton.textContent = "Back to Game";

let selectedCells = [];
let cells = [];
let foundWords = 0;

// Generate grid
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.textContent = letters[Math.floor(Math.random() * letters.length)];
  cell.dataset.index = i;
  grid.appendChild(cell);
  cells.push(cell);
}

// Place words
function placeWord(word) {
  const dir = Math.random() > 0.5 ? "H" : "V";
  let row, col, index;

  while (true) {
    if (dir === "H") {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * (gridSize - word.length));
    } else {
      row = Math.floor(Math.random() * (gridSize - word.length));
      col = Math.floor(Math.random() * gridSize);
    }

    let canPlace = true;
    for (let i = 0; i < word.length; i++) {
      const r = row + (dir === "V" ? i : 0);
      const c = col + (dir === "H" ? i : 0);
      index = r * gridSize + c;
      if (cells[index].dataset.word && cells[index].dataset.word !== word) {
        canPlace = false;
        break;
      }
    }

    if (canPlace) break;
  }

  for (let i = 0; i < word.length; i++) {
    const r = row + (dir === "V" ? i : 0);
    const c = col + (dir === "H" ? i : 0);
    index = r * gridSize + c;
    cells[index].textContent = word[i];
    cells[index].dataset.word = word;
  }
}

words.forEach(word => {
  placeWord(word);
  const li = document.createElement("li");
  li.textContent = word;
  li.id = "word-" + word;
  wordList.appendChild(li);
});

// Handle selection
let isSelecting = false;

grid.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("cell")) {
    isSelecting = true;
    clearSelection();
    e.target.classList.add("selected");
    selectedCells.push(e.target);
  }
});

grid.addEventListener("mouseover", (e) => {
  if (isSelecting && e.target.classList.contains("cell") && !e.target.classList.contains("selected")) {
    e.target.classList.add("selected");
    selectedCells.push(e.target);
  }
});

document.addEventListener("mouseup", () => {
  if (isSelecting) {
    checkWord();
    isSelecting = false;
  }
});

function clearSelection() {
  selectedCells.forEach(cell => cell.classList.remove("selected"));
  selectedCells = [];
}

function checkWord() {
  const word = selectedCells.map(c => c.textContent).join("");
  const reversed = word.split("").reverse().join("");

  if (words.includes(word) || words.includes(reversed)) {
    selectedCells.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("found");
    });
    document.getElementById("word-" + (words.includes(word) ? word : reversed)).classList.add("found");
    foundWords++;
    checkGameStatus();
  } else {
    setTimeout(clearSelection, 300);
    status.textContent = "Try again!";
  }
}

function checkGameStatus() {
  if (foundWords === words.length) {
    status.textContent = "Congratulations! You found all the words!";
    status.classList.add("congratulated");
    document.body.appendChild(backButton);  // Add the 'Back to Game' button
  }
}
