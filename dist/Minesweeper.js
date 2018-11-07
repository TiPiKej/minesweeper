class Minesweeper {
  constructor(bombs = 30, rows = 10, cols = 10) {
    this.bombs = bombs;
    this.rows = rows;
    this.cols = cols;
    this.movedTitle = false;
    this.reset();
    this.flagImg = loadImage("img/flag.png");
    this.bombImg = loadImage("img/bomb.png");
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
    if (this.rows * this.cols < this.bombs) throw new Error("Too much bombs");

    for (let i = 0; i < this.bombs; i++) {
      const randomized = Math.floor(random(0, this.rows * this.cols));
      let row = Math.floor(randomized / this.cols);
      let col = randomized % this.cols;

      if (!this.fields[row][col].bomb) {
        this.fields[row][col].bomb = true;
      } else i--;
    }
  }

  capture(cFi) {
    if (cFi.checked) return false;

    cFi.flag = cFi.flag === undefined ? true : !cFi.flag;
    console.log(cFi);
  }

  looseF() {
    this.loose = true;
  }

  clicked() {
    if (mouseY < 70) return this.reset();
    if (this.loose) return false;

    let clickedField = this.fields;
    clickedField = clickedField.filter(
      row => row[0].y < mouseY && row[0].y + row[0].wh > mouseY
    );
    if (clickedField[0] !== undefined) {
      clickedField = clickedField[0].filter(
        col => col.x < mouseX && col.x + col.wh > mouseX
      )[0];
    }

    if (!clickedField || clickedField.length === 0) return false;

    if (mouseButton === "center") return this.capture(clickedField);
    if (mouseButton === "left") {
      if (clickedField.bomb) this.looseF();
      else if (!clickedField.bomb) this.showNearlyBombs(clickedField);
    }
  }

  showNearlyBombs(field) {
    field.flag = false;
    field.checked = true;
  }

  nearlyBombs(field) {
    function checkRow(row = [], cur = false) {
      if (row && row.length > 0) {
        let w = 0;
        if (checkCol(row[field.col - 2])) w++;
        if (checkCol(row[field.col - 1])) w++;
        if (checkCol(row[field.col])) w++;

        return w;
      }

      return 0;
    }

    function checkCol(col = {}) {
      if (col) return col.bomb;
    }

    // console.log(field);

    // console.log(`All rows ${this.rows} All cols: ${this.cols}`);
    // console.log(`This row ${field.row} This col: ${field.col}`);

    const prevRow = this.fields[field.row - 2];
    const curRow = this.fields[field.row - 1];
    const nextRow = this.fields[field.row];

    let w = 0;

    w += checkRow(prevRow);
    w += checkRow(curRow, true);
    w += checkRow(nextRow);

    return w;
  }

  moved() {
    if (mouseY < 70 && mouseX < width) {
      this.movedTitle = true;
    } else {
      this.movedTitle = false;
    }
  }

  pointsBar() {
    let string = this.loose ? `You loose!` : `Time: ${Math.floor(this.time)}`;

    const fontSize = 60;
    rect(10, 10, width - 20, 60);
    textSize(fontSize);

    if (this.movedTitle) string = "Click to restart";

    text(string, 10, 10, width - 20, fontSize);

    if (this.frameCount % 60 === 59) this.time++;
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

        if (this.frameCount % 10000 === 5) col;

        if (col.checked && col.bomb) fill(255, 0, 0);

        translate(ncol * whbox + marginLeft, nrow * whbox + marginTop);
        rect(0, 0, whbox, whbox);
        this.fields[nrow][ncol].x = ncol * whbox + marginLeft;
        this.fields[nrow][ncol].y = nrow * whbox + marginTop + top;
        this.fields[nrow][ncol].wh = whbox;
        this.fields[nrow][ncol].row = nrow + 1;
        this.fields[nrow][ncol].col = ncol + 1;
        this.fields[nrow][ncol].nearlyBombs = this.nearlyBombs(
          this.fields[nrow][ncol]
        );

        if (this.fields[nrow][ncol].flag) {
          image(
            this.flagImg,
            col.wh / 5,
            col.wh / 5,
            (col.wh * 2) / 3,
            (col.wh * 2) / 3
          );
        }

        if (this.loose && this.fields[nrow][ncol].bomb) {
          image(
            this.bombImg,
            col.wh / 5,
            col.wh / 5,
            (col.wh * 2) / 3,
            (col.wh * 2) / 3
          );
        }

        pop();

        if (col.checked && !col.bomb) {
          if (this.frameCount % 10000 === 5) console.log(col);
          textSize(col.wh);
          text(
            String(col.nearlyBombs),
            col.x + col.wh * 0.25,
            col.y - top + col.wh * 0.9
          );
        }
      });
    });
  }

  draw() {
    background(51);
    this.pointsBar();
    this.drawFields();
    this.frameCount++;
  }

  reset() {
    resetMatrix();
    this.time = 0;
    this.frameCount = 0;
    this.loose = false;
    this.setFields();
    this.randomBombs();
    clearTimeout(this.counter);
  }
}
