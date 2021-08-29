import p5 from "p5";

class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class PointLine {
  s: p5;
  p1: Point;
  p2: Point;
  thickness: number;
  dotCount: number;
  modifyFunc: Function;
  constructor(s: p5, p1: Point, p2: Point, thickness = 1) {
    this.s = s;
    this.p1 = p1;
    this.p2 = p2;
    this.thickness = thickness;
    let dotCount = s.dist(p1.x, p1.y, p2.x, p2.y);
    this.dotCount = s.ceil(dotCount);
    const modifyFunc = (x: number, y: number) => [x, y];
    this.modifyFunc = modifyFunc;
  }
  draw() {
    for (let i = 0; i < this.dotCount; i++) {
      let x = this.s.map(i, 0, this.dotCount, this.p1.x, this.p2.x);
      let y = this.s.map(i, 0, this.dotCount, this.p1.y, this.p2.y);
      [x, y] = this.modifyFunc(x, y);
      this.s.ellipse(x, y, this.thickness, this.thickness);
    }
  }
  blur(seed = 0, amount = 0) {
    const blurPower = 1 + this.s.sq(amount);
    this.dotCount *= blurPower;
    const blurPower2 = 1 - amount;
    this.thickness *= blurPower2;
    this.modifyFunc = (x: number, y: number) => {
      x += seed * amount * this.s.randomGaussian(0, 1);
      y += seed * amount * this.s.randomGaussian(0, 1);
      return [x, y];
    };
  }
}

class PointShape extends PointLine {
  x: number;
  y: number;
  r: number;
  edgeCount: number;
  lines: PointLine[];
  constructor(
    s: p5,
    x: number,
    y: number,
    r: number,
    edgeCount: number,
    thickness = 1
  ) {
    super(s, new Point(x, y), new Point(x, y), thickness);
    this.x = x;
    this.y = y;
    this.r = r;
    this.edgeCount = edgeCount;
    this.lines = [];
    for (let i = 0; i < this.edgeCount; i++) {
      const x1 =
        this.x + this.r * this.s.cos((this.s.TWO_PI * i) / this.edgeCount);
      const y1 =
        this.y + this.r * this.s.sin((this.s.TWO_PI * i) / this.edgeCount);
      const x2 =
        this.x +
        this.r * this.s.cos((this.s.TWO_PI * (i + 1)) / this.edgeCount);
      const y2 =
        this.y +
        this.r * this.s.sin((this.s.TWO_PI * (i + 1)) / this.edgeCount);
      const p1 = new Point(x1, y1);
      const p2 = new Point(x2, y2);
      const line = new PointLine(this.s, p1, p2, thickness);
      this.lines.push(line);
    }
  }
  draw() {
    this.lines.forEach((line) => {
      line.draw();
    });
  }
  blur(seed = 0, amount = 0) {
    this.lines.forEach((line) => {
      line.blur(seed, amount);
    });
  }
}

const sketch = (s: p5) => {
  let mousePositions: Point[] = [];
  const maxPos = 12;

  const setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight, s.WEBGL);

    s.noStroke();
    s.blendMode(s.ADD);
    s.colorMode(s.HSB, 1);
  };

  const draw = () => {
    s.background(0);

    const mousePos = new Point(s.mouseX - s.width / 2, s.mouseY - s.height / 2);

    const shape = new PointShape(s, mousePos.x, mousePos.y, 90, 6, 6);
    shape.draw();

    mousePositions.push(mousePos);
    if (mousePositions.length > maxPos) {
      mousePositions.shift();
    }

    mousePositions.forEach((pos, i) => {
      const ratio = i / mousePositions.length;
      s.fill(0.5 + ratio, 0.7, 0.25);
      const shape = new PointShape(s, pos.x, pos.y, 90, 6, 6);
      shape.blur(10, ratio);
      shape.draw();
    });
  };

  s.setup = setup;
  s.draw = draw;
};

export default sketch;
