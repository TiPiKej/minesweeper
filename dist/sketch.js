let segmentsDate;

function setup() {
  createCanvas(windowWidth, windowHeight);

  segmentsDate = new showDate(10, 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  segmentsDate = new showDate(10, 10);
}

function draw() {
  background(51);

  segmentsDate.update();

  frameRate(1);
}

class showDate {
  constructor(xStart = 0, yStart = 0) {
    this.xStart = xStart;
    this.yStart = yStart;
    // dla 700px mamy 50px length
    // dla 750px mamy 20px width

    this.segmentLength = windowWidth / 14;
    this.segmentWidth = windowWidth / 37.5;

    this.firstHour = new sevenSegments(
      this.xStart,
      this.yStart,
      this.segmentLength,
      this.segmentWidth
    );
    this.secondHour = new sevenSegments(
      this.xStart + this.segmentLength * 2,
      this.yStart,
      this.segmentLength,
      this.segmentWidth
    );

    this.firstMinutes = new sevenSegments(
      this.xStart + this.segmentLength * 5,
      this.yStart,
      this.segmentLength,
      this.segmentWidth
    );
    this.secondMinutes = new sevenSegments(
      this.xStart + this.segmentLength * 7,
      this.yStart,
      this.segmentLength,
      this.segmentWidth
    );

    this.firstSeconds = new sevenSegments(
      this.xStart + this.segmentLength * 10,
      this.yStart,
      this.segmentLength,
      this.segmentWidth
    );
    this.secondSeconds = new sevenSegments(
      this.xStart + this.segmentLength * 12,
      this.yStart,
      this.segmentLength,
      this.segmentWidth
    );
  }

  update() {
    this.secondHour.correctLoc(
      this.xStart + this.segmentLength * 2,
      this.yStart
    );
    this.firstMinutes.correctLoc(
      this.xStart + this.segmentLength * 5,
      this.yStart
    );
    this.secondMinutes.correctLoc(
      this.xStart + this.segmentLength * 7,
      this.yStart
    );
    this.firstSeconds.correctLoc(
      this.xStart + this.segmentLength * 10,
      this.yStart
    );
    this.secondSeconds.correctLoc(
      this.xStart + this.segmentLength * 12,
      this.yStart
    );

    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    this.firstHour.draw(
      hours.toString().length === 1 ? 0 : Number(hours.toString()[0])
    );
    this.secondHour.draw(hours % 10);

    this.drawDotted();

    this.firstMinutes.draw(
      minutes.toString().length === 1 ? 0 : Number(minutes.toString()[0])
    );
    this.secondMinutes.draw(minutes % 10);

    this.drawDotted();

    this.firstSeconds.draw(
      seconds.toString().length === 1 ? 0 : Number(seconds.toString()[0])
    );
    this.secondSeconds.draw(seconds % 10);
  }

  drawDotted() {
    const tops = [
      (this.segmentLength * 2) / 4 + this.segmentWidth / 2,
      (this.segmentLength * 6) / 4 + this.segmentWidth
    ];

    tops.forEach(top => {
      push();
      fill(255, 0, 0);
      translate(this.segmentLength * 2, top);
      beginShape();
      vertex(10, 0);
      vertex(20, 10);
      vertex(10, 20);
      vertex(0, 10);
      endShape(CLOSE);
      pop();
    });
  }
}
