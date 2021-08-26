import p5 from "p5";

const sketch = (s: p5) => {
  let canvasW = 0;
  let time = 0;
  let w = 24;
  let maxD = 0;

  const isometric = () => {
    let magicalAngle = s.atan(1 / s.sqrt(2));
    s.rotateX(magicalAngle);
    s.rotateY(s.QUARTER_PI);
  };

  const setup = () => {
    canvasW = s.windowHeight;

    maxD = s.dist(0, 0, canvasW / 2, canvasW / 2);

    s.createCanvas(canvasW, canvasW, s.WEBGL);
  };

  const draw = () => {
    s.background(70, 67, 67);

    let l = canvasW;
    s.ortho(-l, l, l, -l, 0, 1000);

    isometric();

    s.translate(-s.width / 2, 0, -s.height / 2);

    for (let z = 0; z < s.height; z += w) {
      for (let x = 0; x < s.width; x += w) {
        s.push();
        let d = s.dist(x, z, s.width / 2, s.height / 2);
        let offset = s.map(d, 0, maxD, -1, 1) * s.PI;
        let a = offset - time;
        let h = s.map(s.sin(a), -1, 1, 100, 300);
        s.translate(x, 0, z);
        s.normalMaterial();
        s.box(w - 2, h, w - 2);
        s.pop();
      }
    }

    time += 0.1;
  };

  s.setup = setup;
  s.draw = draw;
};

export default sketch;
