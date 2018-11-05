class Minesweeper {
  constructor(bombs = 10, rows = 4, cols = 4) {
    this.bombs = bombs;
    this.rows = rows;
    this.cols = cols;
    this.movedTitle = false;
  }

  setFields() {
    let fields = [];
    for (let r = 0; r < this.rows; r++) {
      fields[r] = [];
      for (let c = 0; c < this.cols; c++) {
        fields[r][c] = { bomb: false, checked: false, x: 0, y: 0, wh: 0 };
      }
    }
    this.fields = fields;
  }

  randomBombs() {
    if (this.rows * this.cols < this.bombs) console.error("Too much bombs");
    else {
      for (let i = 0; i < this.bombs; i++) {
        const randomized = Math.floor(random(0, this.rows * this.cols));
        let row = Math.floor(randomized / this.cols);
        let col = randomized % this.cols;
        if (!this.fields[row][col].bomb) {
          this.fields[row][col].bomb = true;
        } else i--;
      }
    }
  }

  clicked() {
    if (mouseY < 70) {
      this.draw();
    } else {
      let field;
      field = this.fields.filter(
        row => row[0].y < mouseY && row[0].y + row[0].wh > mouseY
      )[0];
      field =
        field !== undefined
          ? field.filter(col => col.x < mouseX && col.x + col.wh > mouseX)[0]
          : false;
      if (field ? field.bomb : null) this.loose = true;
    }
  }

  moved() {
    if (mouseY < 70 && mouseX < width) {
      this.movedTitle = true;
    } else {
      this.movedTitle = false;
    }
  }

  pointsBar(timeReset = false, stringPar) {
    if (timeReset) this.time = 0;

    let string = this.loose ? `You loose!` : `Time: ${Math.floor(this.time)}`;

    const fontSize = 60;
    rect(10, 10, width - 20, 60);
    textSize(fontSize);

    if (this.movedTitle) string = "Click to restart";

    text(string, 10, 10, width - 20, fontSize);
    this.counter = setTimeout(() => {
      this.time += 0.1;
      this.pointsBar();
    }, 100);
  }

  drawFields() {
    const margin = 100 / this.cols;
    const whbox = width / this.cols - margin * 2;
    const top = 70;
    translate(0, top);
    this.fields.forEach((row, nrow) => {
      row.forEach((col, ncol) => {
        push();
        const marginLeft =
          ncol === 0 ? margin * (ncol + 1) : margin * ncol * 2 + margin;
        const marginTop =
          nrow === 0 ? margin * (nrow + 1) : margin * nrow * 2 + margin;
        if (col.bomb) fill(255, 0, 0);
        translate(ncol * whbox + marginLeft, nrow * whbox + marginTop);
        rect(0, 0, whbox, whbox);
        this.fields[nrow][ncol].x = ncol * whbox + marginLeft;
        this.fields[nrow][ncol].y = nrow * whbox + marginTop + top;
        this.fields[nrow][ncol].wh = whbox;
        pop();
      });
    });
  }

  draw() {
    this.reset();
    background(51);
    this.pointsBar(true);
    this.drawFields();
  }

  reset() {
    resetMatrix();
    this.time = 0;
    this.loose = false;
    this.setFields();
    this.randomBombs();
    clearTimeout(this.counter);
  }
}
