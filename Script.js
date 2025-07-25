const GRID_SIZE = 10;
const grid = [];
const gameGrid = document.getElementById('game-grid');
const piecesContainer = document.getElementById('pieces-container');
const message = document.getElementById('message');

const shapes = [
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1], [1, 1]],
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
];

function createGrid() {
  for(let i=0; i<GRID_SIZE; i++) {
    const row = [];
    for(let j=0; j<GRID_SIZE; j++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      gameGrid.appendChild(cell);
      row.push(0);
    }
    grid.push(row);
  }
}

function drawGrid() {
  const cells = gameGrid.querySelectorAll('.grid-cell');
  let index = 0;
  for(let i=0; i<GRID_SIZE; i++) {
    for(let j=0; j<GRID_SIZE; j++) {
      if(grid[i][j] === 1) {
        cells[index].classList.add('filled');
      } else {
        cells[index].classList.remove('filled');
      }
      index++;
    }
  }
}

function generatePiece() {
  return shapes[Math.floor(Math.random() * shapes.length)];
}

let currentPieces = [];

function createPieces() {
  piecesContainer.innerHTML = '';
  currentPieces = [];
  for(let i=0; i<3; i++) {
    const shape = generatePiece();
    currentPieces.push(shape);
    const pieceDiv = document.createElement('div');
    pieceDiv.classList.add('piece');
    pieceDiv.style.gridTemplateColumns = `repeat(${shape[0].length}, 25px)`;
    pieceDiv.style.gridTemplateRows = `repeat(${shape.length}, 25px)`;
    shape.forEach(row => {
      row.forEach(cell => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('piece-cell');
        if(cell === 0) cellDiv.style.backgroundColor = 'transparent';
        pieceDiv.appendChild(cellDiv);
      });
    });
    pieceDiv.draggable = true;
    pieceDiv.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', i);
    });
    piecesContainer.appendChild(pieceDiv);
  }
}

function canPlace(shape, x, y) {
  for(let i=0; i<shape.length; i++) {
    for(let j=0; j<shape[0].length; j++) {
      if(shape[i][j] === 1) {
        if(x+i >= GRID_SIZE || y+j >= GRID_SIZE) return false;
        if(grid[x+i][y+j] === 1) return false;
      }
    }
  }
  return true;
}

function placeShape(shape, x, y) {
  for(let i=0; i<shape.length; i++) {
    for(let j=0; j<shape[0].length; j++) {
      if(shape[i][j] === 1) {
        grid[x+i][y+j] = 1;
      }
    }
  }
  clearLines();
  drawGrid();
}

function clearLines() {
  // Righe complete
  for(let i=0; i<GRID_SIZE; i++) {
    if(grid[i].every(cell => cell === 1)) {
      for(let j=0; j<GRID_SIZE; j++) {
        grid[i][j] = 0;
      }
    }
  }
  // Colonne complete
  for(let j=0; j<GRID_SIZE; j++) {
    let fullCol = true;
    for(let i=0; i<GRID_SIZE; i++) {
      if(grid[i][j] === 0) fullCol = false;
    }
    if(fullCol) {
      for(let i=0; i<GRID_SIZE; i++) {
        grid[i][j] = 0;
      }
    }
  }
}

function checkGameOver() {
  for(let i=0; i<3; i++) {
    const shape = currentPieces[i];
    for(let x=0; x<GRID_SIZE; x++) {
      for(let y=0; y<GRID_SIZE; y++) {
        if(canPlace(shape, x, y)) {
          return false;
        }
      }
    }
  }
  return true;
}

gameGrid.addEventListener('dragover', e => {
  e.preventDefault();
});

gameGrid.addEventListener('drop', e => {
  e.preventDefault();
  const pieceIndex = e.dataTransfer.getData('text/plain');
  const rect = gameGrid.getBoundingClientRect();
  const x = Math.floor((e.clientY - rect.top) / 33); // 30 + 3 gap
  const y = Math.floor((e.clientX - rect.left) / 33);
  const shape = currentPieces[pieceIndex];
  if(canPlace(shape, x, y)) {
    placeShape(shape, x, y);
    currentPieces.splice(pieceIndex, 1);
    createPieces();
    message.textContent = '';
    if(checkGameOver()) {
      message.textContent = 'Game Over! Ricarica per giocare ancora.';
    }
  } else {
    message.textContent = 'Non puoi piazzare qui!';
  }
});

createGrid();
drawGrid();
createPieces();
