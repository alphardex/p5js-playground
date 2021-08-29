import p5 from "p5";

class PointLine {
  s: p5;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  d: number;
  dotCount: number;
  modifyFunc: Function;
  constructor(s: p5, x1: number, y1: number, x2: number, y2: number, d = 6) {
    this.s = s;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.d = d;
    let dotCount = s.dist(x1, y1, x2, y2);
    this.dotCount = s.ceil(dotCount);
    const modifyFunc = (x: number, y: number) => [x, y];
    this.modifyFunc = modifyFunc;
  }
  draw() {
    for (let i = 0; i < this.dotCount; i++) {
      let x = this.s.map(i, 0, this.dotCount, this.x1, this.x2);
      let y = this.s.map(i, 0, this.dotCount, this.y1, this.y2);
      [x, y] = this.modifyFunc(x, y);
      this.s.ellipse(x, y, this.d, this.d);
    }
  }
  blur(seed = 0, amount = 0) {
    const blurPower = 1 + this.s.sq(amount);
    this.dotCount *= blurPower;
    const blurPower2 = 1 - amount;
    this.d *= blurPower2;
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
  p: number;
  lines: PointLine[];
  constructor(s: p5, x: number, y: number, r: number, p: number) {
    super(s, x, x, y, y);
    this.x = x;
    this.y = y;
    this.r = r;
    this.p = p;
    this.lines = [];
    for (let i = 0; i < this.p; i++) {
      const x1 = this.x + this.r * this.s.cos((this.s.TWO_PI * i) / this.p);
      const y1 = this.y + this.r * this.s.sin((this.s.TWO_PI * i) / this.p);
      const x2 =
        this.x + this.r * this.s.cos((this.s.TWO_PI * (i + 1)) / this.p);
      const y2 =
        this.y + this.r * this.s.sin((this.s.TWO_PI * (i + 1)) / this.p);
      const line = new PointLine(this.s, x1, y1, x2, y2);
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
  let time = 0;
  let N = 12;
  let velocity = 0.02;

  const setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight, s.WEBGL);

    s.noStroke();
    s.blendMode(s.ADD);
    s.colorMode(s.HSB, 1);
  };

  const draw = () => {
    s.background(0);

    s.push();
    for (let i = 0; i < N; i++) {
      const ratio = i / N;

      s.fill(0.5 + ratio, 0.7, 0.25);

      const offset = s.PI * ratio;
      let x = 160 * s.cos(s.TWO_PI * time - offset);

      const shape = new PointShape(s, x, 0, 90, 6);
      shape.blur(10, ratio);
      shape.draw();
    }
    s.pop();

    time += velocity;
  };

  s.setup = setup;
  s.draw = draw;
};

export default sketch;
