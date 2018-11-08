class Minesweeper {
  constructor(bombs = 10, rows = 4, cols = 4) {
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
    // console.log(this.captureFlags, this.bombs);
    if (this.captureFlags >= this.bombs) {
      if (cFi.flag) {
        cFi.flag = false;
        this.captureFlags--;
      }
      return false;
    }

    cFi.flag = cFi.flag === undefined ? true : !cFi.flag;

    if (cFi.flag) this.captureFlags++;
    else this.captureFlags--;

    // console.log(cFi);
  }

  looseF() {
    this.loose = true;
  }

  clicked() {
    if (mouseY < 70) return this.reset();
    if (this.loose) return false;
    if (this.win) return false;

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
      if (clickedField.flag) return false;
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
    let string = `Time: ${Math.floor(this.time)}`;

    const fontSize = 60;
    rect(10, 10, width - 20, 60);
    textSize(fontSize);

    if (this.loose) string = "You loose!";
    if (this.win) string = "Winner!";
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

        if (this.fields[nrow][ncol].flag && !this.win) {
          image(
            this.flagImg,
            col.wh / 5,
            col.wh / 5,
            (col.wh * 2) / 3,
            (col.wh * 2) / 3
          );
        }

        if ((this.loose || this.win) && this.fields[nrow][ncol].bomb) {
          image(
            this.bombImg,
            col.wh / 5,
            col.wh / 5,
            (col.wh * 2) / 3,
            (col.wh * 2) / 3
          );
        }

        pop();

        if ((col.checked || this.win) && !col.bomb) {
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

  winner() {
    // console.log("winner");
    this.win = true;
  }

  checkFlagBombs() {
    let without = 0;

    this.fields.forEach(el => {
      without += el.filter(
        field => field.bomb && field.flag && field.flag !== undefined
      ).length;
    });

    if (this.bombs === without) this.winner();
  }

  draw() {
    this.checkFlagBombs();

    background(51);
    this.pointsBar();
    this.drawFields();
    this.frameCount++;
  }

  reset(bombs = false, rows = false, cols = false) {
    this.bombs = bombs ? bombs : this.bombs;
    this.rows = rows ? rows : this.rows;
    this.cols = cols ? cols : this.cols;

    resetMatrix();
    this.time = 0;
    this.frameCount = 0;
    this.captureFlags = 0;
    this.loose = false;
    this.win = false;
    this.setFields();
    this.randomBombs();
    clearTimeout(this.counter);
  }
}
