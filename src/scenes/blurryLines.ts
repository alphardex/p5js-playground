import p5 from "p5";

const sketch = (s: p5) => {
  let time = 0;

  const blurryLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    seed = 0,
    blur = 0
  ) => {
    let dotCount = s.dist(x1, y1, x2, y2);
    const blurPower = 1 + s.sq(blur);
    dotCount *= blurPower;
    dotCount = s.ceil(dotCount);
    let d = 6;
    const blurPower2 = 1 - blur;
    d *= blurPower2;
    for (let i = 0; i < dotCount; i++) {
      let x = s.map(i, 0, dotCount, x1, x2);
      let y = s.map(i, 0, dotCount, y1, y2);
      x += seed * blur * s.randomGaussian(0, 1);
      y += seed * blur * s.randomGaussian(0, 1);
      s.ellipse(x, y, d, d);
    }
  };

  const blurryShape = (
    x: number,
    y: number,
    r: number,
    p = 3,
    seed = 0,
    blur = 0
  ) => {
    for (let i = 0; i < p; i++) {
      blurryLine(
        x + r * s.cos((s.TWO_PI * i) / p),
        y + r * s.sin((s.TWO_PI * i) / p),
        x + r * s.cos((s.TWO_PI * (i + 1)) / p),
        y + r * s.sin((s.TWO_PI * (i + 1)) / p),
        seed,
        blur
      );
    }
  };

  const setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight, s.WEBGL);

    s.noStroke();
    s.blendMode(s.ADD);
    s.colorMode(s.HSB, 1);
  };

  const draw = () => {
    s.background(0);

    s.push();
    let N = 12;
    for (let i = 0; i < N; i++) {
      s.fill(0.5 + i / N, 0.7, 0.25);
      let offset = (s.PI * i) / N;
      let x = 160 * s.cos(s.TWO_PI * time - offset);
      blurryShape(x, 0, 90, 4, 10, i / N);
    }
    s.pop();

    time += 0.02;
  };

  s.setup = setup;
  s.draw = draw;
};

export default sketch;
