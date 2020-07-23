const numCols = 8;
const numRows = 8;
let targetsArray = [];
const message = document.querySelector("#message");
let flagMode = false;
const grid = document.querySelector("#grid");
const flagsPlaced = document.querySelector("#flagsPlaced");
const flagsNeeded = document.querySelector("#flagsNeeded");
const flagButton = document.querySelector("#flagButton");
let squaresLeft = 0;

//// restart button click
document.querySelector("#reset").addEventListener("click", () => reset());

//Create Grid and assign co-ords

const generateField = () => {
  !message.classList.contains("hidden") && message.classList.add("hidden");
  grid.innerHTML = "";
  targetsArray = [];
  for (let r = 0; r < numRows; r++) {
    grid.innerHTML = grid.innerHTML + `<div class="row"></div>`;
  }
  const rowsList = document.querySelectorAll(".row");

  for (let r = 0; r < rowsList.length; r++) {
    for (let c = 0; c < numCols; c++) {
      rowsList[r].innerHTML =
        rowsList[r].innerHTML +
        `<div class="tile" data-row=` +
        r +
        ` data-col=` +
        c +
        `></div>`;
    }
  }
};

//randomize targets
const randomiseTargets = (numTargets) => {
  let count = 0;
  while (count < numTargets) {
    let xPoint = Math.floor(Math.random() * numRows);
    let yPoint = Math.floor(Math.random() * numCols);
    if (
      targetsArray.some(
        (item) =>
          JSON.stringify(item) === JSON.stringify({ x: xPoint, y: yPoint })
      )
    ) {
      continue;
    } else {
      let target = { x: xPoint, y: yPoint };
      targetsArray.push(target);
      count++;
    }
  }
  flagsPlaced.innerText = 0;
  flagsNeeded.innerText = parseInt(numTargets, 0);
  squaresLeft = document.querySelectorAll(".tile").length - targetsArray.length;
};

//tile check and reveal
const tileReveal = (target) => {
  let clickCoords = {
    x: parseInt(target.dataset.row, 0),
    y: parseInt(target.dataset.col, 0)
  };
  if (
    targetsArray.some(
      (coords) => JSON.stringify(coords) === JSON.stringify(clickCoords)
    )
  ) {
    target.classList.add("hit");
    message.classList.remove("hidden");
    message.innerText = "Game Over!";
  } else {
    target.classList.add("empty");
    target.innerText = checkNeighbours(clickCoords);
  }
  squaresLeft -= 1;
  console.log(squaresLeft);
};

//count neighbouring mines
const checkNeighbours = (targetCoords) => {
  let { x, y } = targetCoords;

  //check each neighbour
  let activeNeighbours = 0;
  targetsArray.forEach((target) => {
    target.x === x && target.y === y + 1 && activeNeighbours++;
    target.x === x && target.y === y - 1 && activeNeighbours++;
    target.x === x + 1 && target.y === y && activeNeighbours++;
    target.x === x - 1 && target.y === y && activeNeighbours++;
    target.x === x + 1 && target.y === y + 1 && activeNeighbours++;
    target.x === x - 1 && target.y === y - 1 && activeNeighbours++;
    target.x === x + 1 && target.y === y - 1 && activeNeighbours++;
    target.x === x - 1 && target.y === y + 1 && activeNeighbours++;
  });
  return activeNeighbours;
};

//add clickHandlers
////tile clicks
const addClickHandlers = () => {
  document.querySelectorAll(".tile").forEach((t) =>
    t.addEventListener("click", (e) => {
      if (flagMode) {
        if (e.target.classList.contains("flagged")) {
          e.target.classList.remove("flagged");
          flagsPlaced.innerText = flagsPlaced.innerText * 1 - 1;
        } else if (!e.target.classList.contains("empty")) {
          e.target.classList.add("flagged");
          flagsPlaced.innerText = flagsPlaced.innerText * 1 + 1;
        }
      } else {
        !e.target.classList.contains("flagged") && tileReveal(e.target);
      }
      checkForWin();
    })
  );
  document.querySelector("#flagButton").addEventListener("click", () => {
    flagButton.classList.toggle("buttonActive");
    flagMode = !flagMode;
  });
};

const revealHints = (numHints) => {
  let tiles = document.querySelectorAll(".tile");
  for (let i = 0; i < numHints; i++) {
    let randomTile = tiles[Math.floor(Math.random() * tiles.length)];
    //check for mine in square, skip if there is
    let mineHere = targetsArray.some(
      (t) => t.x == randomTile.dataset.row && t.y == randomTile.dataset.col
    );
    let revealed = randomTile.classList.contains("empty");
    if (!revealed) {
      !mineHere ? tileReveal(randomTile) : i--;
    } else {
      i--;
    }
  }
};

document.addEventListener("keydown", (e) => {
  e.which === 70 && flagMode === false && (flagMode = true);
});
document.addEventListener("keyup", (e) => {
  e.which === 70 && flagMode === true && (flagMode = false);
});

const checkForWin = () => {
  if (squaresLeft === 0 && flagsPlaced.innerText * 1 === targetsArray.length) {
    message.innerText = "YOU WON!";
    message.classList.remove("hidden");
  }
  console.log(flagsPlaced.innerText * 1);
};

const reset = () => {
  generateField();
  randomiseTargets(10);
  revealHints(34);
  addClickHandlers();
};

setTimeout(() => {
  reset();
}, 500);
