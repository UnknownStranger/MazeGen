let cells = [];
let visited = [];
let size = 20,
  rows = 50,
  cols = 50;
let width, height;
let current;
let mazeDrawn = false;

function setup() {
  width = cols * size;
  height = rows * size;

  document.getElementById("reset").addEventListener("click", reset);
  createCanvas(width, height);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      cells.push(new Cell(i, j));
    }
  }
  current = cells[0];
}


function draw() {
  background(50);
  cells.forEach(cell => {
    cell.show();
  });

  if (!mazeDrawn) {
    current.visited = true;
    next = current.checkNeighbors();

    if (next) {
      removeWalls(current, next);
      visited.push(next);
      current = next;
    } else if (visited.length > 0) {
      current = visited.pop();
    } else {
      noLoop();
      current = cells[0];
      mazeDrawn = true;
    }

    stroke(255);
    noFill();
    rect(0, 0, width - 1, height - 1);
    current.highlight();
  }
}

class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.x = col * size;
    this.y = row * size;
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  show() {
    if (this.visited) {
      noStroke();
      fill(150, 0, 255);
      rect(this.x, this.y, size, size);
    }
    this.lines(this.x, this.y);
  }

  lines(x, y) {
    stroke(255);
    if (this.walls[0]) {
      line(x, y, x + size, y);
    }
    if (this.walls[1]) {
      line(x + size, y, x + size, y + size);
    }
    if (this.walls[2]) {
      line(x + size, y + size, x, y + size);
    }
    if (this.walls[3]) {
      line(x, y + size, x, y);
    }
  }

  checkNeighbors() {
    let col = this.col;
    let row = this.row;

    let neighbors = [];

    let top = cells[index(col, row - 1)];
    let right = cells[index(col + 1, row)];
    let bottom = cells[index(col, row + 1)];
    let left = cells[index(col - 1, row)];

    if (top && !top.visited) {
      neighbors.push(top);
    }

    if (right && !right.visited) {
      neighbors.push(right);
    }

    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }

    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      return neighbors[floor(random(0, neighbors.length))];
    }
  }

  highlight() {
    noStroke();
    fill(0, 0, 255);
    rect(this.x, this.y, size, size);
  }

}

function removeWalls(c, n) {
  let x = c.col - n.col;
  let y = c.row - n.row;

  if (x == 1) {
    c.walls[3] = false;
    n.walls[1] = false;
  }
  if (x == -1) {
    c.walls[1] = false;
    n.walls[3] = false;
  }
  if (y == 1) {
    c.walls[0] = false;
    n.walls[2] = false;
  }
  if (y == -1) {
    c.walls[2] = false;
    n.walls[0] = false;
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1
  }
  return (i + j * cols)
}

function reset() {
  tempRows = document.getElementById("rows").value;
  tempCols = document.getElementById("columns").value;
  tempSize = document.getElementById("size").value;
  if (tempRows > 0 && tempCols > 0 && tempSize > 0) {
    clear();
    rows = tempRows;
    cols = tempCols;
    size = tempSize;
    cells = [];
    test = [];
    mazeDrawn = false;
    setup();
    loop();
  } else {
    alert("Please choose positive number values for columns, rows and path size.")
  }
}