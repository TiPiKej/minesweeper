let minesweeper;

function setup() {
  createCanvas(500, 600);

  minesweeper = new Minesweeper();
  minesweeper.draw();
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    minesweeper.clicked();
  }
}

function mouseMoved() {
  minesweeper.moved();
}
