class sevenSegments {
  constructor(xStart = 0, yStart = 0, segmentLength, segmentWidth) {
    this.segmentLength = segmentLength;
    this.segmentWidth = segmentWidth;

    this.xStart = xStart;
    this.yStart = yStart;

    this.defineSegments();
  }

  defineSegments() {
    /*
     *
     *         ----1
     *       6|    |2
     *        |    |
     *         ----7
     *       5|    |
     *        |    |3
     *         ----4
     *
     */
    this.segments = [
      {
        // 1
        loc: createVector(0, 0),
        rotate: 0,
        active: false
      },
      {
        // 2
        loc: createVector(
          this.segmentLength + (this.segmentWidth * 3) / 2,
          this.segmentWidth / 2 + 1
        ),
        rotate: 90,
        active: false
      },
      {
        // 3
        loc: createVector(
          this.segmentLength + (this.segmentWidth * 3) / 2,
          this.segmentLength + (this.segmentWidth * 3) / 2 + 4
        ),
        rotate: 90,
        active: false
      },
      {
        // 4
        loc: createVector(
          0,
          this.segmentLength * 2 + (this.segmentWidth * 4) / 2 + 6
        ),
        rotate: 0,
        active: false
      },
      {
        // 5
        loc: createVector(
          this.segmentWidth / 2,
          this.segmentLength + (this.segmentWidth * 3) / 2 + 4
        ),
        rotate: 90,
        active: false
      },
      {
        // 6
        loc: createVector(this.segmentWidth / 2, this.segmentWidth / 2 + 1),
        rotate: 90,
        active: false
      },
      {
        // 7
        loc: createVector(0, this.segmentLength + this.segmentWidth + 3),
        rotate: 0,
        active: false
      }
    ];
  }

  correctLoc(x = 0, y = 0) {
    this.xStart = x;
    this.yStart = y;
  }

  draw(number = 8) {
    resetMatrix();
    translate(this.xStart, this.yStart);
    let numberOfActivitySegments = [];
    switch (number) {
      case 0:
        numberOfActivitySegments = [1, 2, 3, 4, 5, 6];
        break;
      case 1:
        numberOfActivitySegments = [2, 3];
        break;
      case 2:
        numberOfActivitySegments = [1, 2, 4, 5, 7];
        break;
      case 3:
        numberOfActivitySegments = [1, 2, 3, 4, 7];
        break;
      case 4:
        numberOfActivitySegments = [2, 3, 6, 7];
        break;
      case 5:
        numberOfActivitySegments = [1, 3, 4, 6, 7];
        break;
      case 6:
        numberOfActivitySegments = [1, 3, 4, 5, 6, 7];
        break;
      case 7:
        numberOfActivitySegments = [1, 2, 3];
        break;
      case 8:
        numberOfActivitySegments = [1, 2, 3, 4, 5, 6, 7];
        break;
      case 9:
        numberOfActivitySegments = [1, 2, 3, 4, 6, 7];
        break;
    }
    this.changeActivites(numberOfActivitySegments);
    this.segments.forEach(segment => {
      push();
      translate(segment.loc.x, segment.loc.y);
      rotate(radians(segment.rotate));
      this.oneSegment(segment.active);
      pop();
    });
  }

  changeActivites(numberOfActivitySegments = []) {
    this.segments.forEach(segment => (segment.active = false));
    numberOfActivitySegments.forEach(number => {
      this.segments[number - 1].active = true;
    });
  }

  oneSegment(active = false) {
    const segmentLength = this.segmentLength ? this.segmentLength : 40;
    const segmentWidth = this.segmentWidth ? this.segmentWidth : 7;
    if (active) {
      fill(255, 0, 0);
      noStroke();
    } else {
      fill(51);
      stroke(0);
    }
    beginShape();

    /*
     * 
     *    2. *********** .3
     *   1. *           * .4
     *    6. *********** .5
     * 
     *  or this is rotated by 90 degrees to right
     * 
     */

    vertex(0, segmentWidth / 2); // 1
    vertex(segmentWidth / 2, 0); // 2
    vertex(segmentWidth / 2 + segmentLength, 0); // 3
    vertex(segmentWidth + segmentLength, segmentWidth / 2); // 4
    vertex(segmentWidth / 2 + segmentLength, segmentWidth); // 5
    vertex(segmentWidth / 2, segmentWidth); // 6
    endShape(CLOSE); // 7
  }
}
