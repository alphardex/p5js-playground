import p5 from "p5";

class Particle {
  s: p5;
  position: p5.Vector; // 位置
  velocity: p5.Vector; // 速度
  acceleration: p5.Vector; // 加速度
  topSpeed: number; // 速度上限
  constructor(s: p5, position = s.createVector(0, 0)) {
    this.s = s;
    this.position = position.copy();
    this.velocity = this.s.createVector(0, 0);
    this.acceleration = this.s.createVector(0, 0);
    this.topSpeed = 12;
  }
  // 显示
  display() {
    this.s.circle(this.position.x, this.position.y, 6);
  }
  // 更新状态
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  // 运行
  run() {
    this.update();
    this.display();
  }
  // 施加力
  applyForce(force: p5.Vector) {
    // 牛顿第二定律: F = ma
    const mass = 1; // 这里设质量为单位1
    const acceleration = p5.Vector.div(force, mass);
    this.acceleration.add(acceleration);
  }
}

class ParticleSystem {
  s: p5;
  particles: Particle[]; // 该系统下的所有微粒
  origin: p5.Vector; // 系统原点
  constructor(s: p5, origin = s.createVector(0, 0)) {
    this.s = s;
    this.particles = [];
    this.origin = origin;
  }
  // 添加单个微粒
  addParticle() {
    const particle = new Particle(this.s, this.origin);
    this.particles.push(particle);
  }
  // 添加多个微粒
  addParticles(count = 1) {
    for (let i = 0; i < count; i++) {
      this.addParticle();
    }
  }
  // 运行
  run() {
    for (const particle of this.particles) {
      particle.run();
    }
  }
  // 打乱微粒位置
  shuffle() {
    this.particles.forEach((p) => {
      const x = this.s.random(0, this.s.width);
      const y = this.s.random(0, this.s.height);
      const randPos = this.s.createVector(x, y);
      p.position = randPos;
    });
  }
  // 让微粒随机漫游
  wander() {
    this.particles.forEach((p) => {
      const x = this.s.random(-1, 1);
      const y = this.s.random(-1, 1);
      const randVel = this.s.createVector(x, y);
      p.velocity = randVel;
    });
  }
  // 对每个微粒施加力
  applyForce(force: p5.Vector) {
    this.particles.forEach((p) => p.applyForce(force));
  }
  // 对每个微粒应用吸引力
  applyAttractor(attractor: Attractor) {
    this.particles.forEach((p) => attractor.applyAttractForce(p));
  }
}

class Attractor extends Particle {
  attractForceMag: number; // 吸引力大小
  radius: number; // 半径
  id: number; // id标识
  isCollasping: boolean; // 是否正在坍塌
  isDead: boolean; // 是否坍塌完毕
  static RADIUS_LIMIT = 100; // 半径上限
  constructor(s: p5, position = s.createVector(0, 0), radius = 16, id = 0) {
    super(s, position);
    this.attractForceMag = 0.05;
    this.radius = radius;
    this.id = id;
    this.isCollasping = false;
    this.isDead = false;
  }
  // 显示
  display() {
    this.s.circle(this.position.x, this.position.y, this.radius * 2);
  }
  // 施加引力
  applyAttractForce(p: Particle) {
    const attractForce = p5.Vector.sub(this.position, p.position);
    attractForce.setMag(this.attractForceMag);
    p.applyForce(attractForce);
  }
  // 是否跟另一个靠得很近
  isNearAnother(attractor: Attractor) {
    const distAB = p5.Vector.dist(this.position, attractor.position);
    const distMin = (this.radius + attractor.radius) * 0.8;
    const isNear = distAB < distMin;
    return isNear;
  }
  // 吸收
  absorb(attractor: Attractor) {
    this.attractForceMag += attractor.attractForceMag;
    this.radius += attractor.radius;
    this.velocity = this.s.createVector(0, 0);
  }
  // 坍塌
  collapse() {
    this.isCollasping = true;
    this.radius *= 0.75;
    if (this.radius < 1) {
      this.isDead = true;
    }
  }
}

const sketch = (s: p5) => {
  let ps: ParticleSystem;
  let attractors: Attractor[] = [];
  let currentAttractorId = 0;
  let mousePos: p5.Vector;

  // https://p5js.org/examples/color-linear-gradient.html
  // 创建渐变色
  const setGradient = (
    x: number,
    y: number,
    w: number,
    h: number,
    c1: p5.Color,
    c2: p5.Color,
    axis: number
  ) => {
    if (axis === 1) {
      // Top to bottom gradient
      for (let i = y; i <= y + h; i++) {
        let inter = s.map(i, y, y + h, 0, 1);
        let c = s.lerpColor(c1, c2, inter);
        s.stroke(c);
        s.line(x, i, x + w, i);
      }
    } else if (axis === 2) {
      // Left to right gradient
      for (let i = x; i <= x + w; i++) {
        let inter = s.map(i, x, x + w, 0, 1);
        let c = s.lerpColor(c1, c2, inter);
        s.stroke(c);
        s.line(i, y, i, y + h);
      }
    }
  };

  const setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);

    ps = new ParticleSystem(s, s.createVector(s.width / 2, s.height / 2));

    ps.addParticles(100);
    ps.shuffle();
    ps.wander();
  };

  const draw = () => {
    mousePos = s.createVector(s.mouseX, s.mouseY);

    s.background(0);
    s.blendMode(s.ADD);

    setGradient(
      0,
      0,
      s.width,
      s.height,
      s.color("#2b5876"),
      s.color("#4e4376"),
      1
    );

    ps.run();

    // 吸引体吸引微粒
    attractors.forEach((attractor) => {
      attractor.run();
      ps.applyAttractor(attractor);

      // 当吸引体吸收过多微粒，半径超限后会坍塌
      if (
        attractor.radius >= Attractor.RADIUS_LIMIT ||
        attractor.isCollasping
      ) {
        attractor.collapse();
        if (attractor.isDead) {
          attractors = attractors.filter((item) => item.id !== attractor.id);
        }
      }
    });

    // 吸引体相互之间的动作
    for (let i = 0; i < attractors.length; i++) {
      for (let j = 0; j < attractors.length; j++) {
        if (i !== j) {
          const attractorA = attractors[j];
          const attractorB = attractors[i];

          // 吸引体相互吸引
          attractorA.applyAttractForce(attractorB);

          // 两个吸引体靠的太近，则吸引体A吸收吸引体B
          if (attractorA.isNearAnother(attractorB)) {
            attractorA.absorb(attractorB);
            attractors = attractors.filter(
              (attractor) => attractor.id !== attractorB.id
            );
          }
        }
      }
    }

    s.blendMode(s.BLEND);
  };

  // 每点击1次，添加1个吸引体
  const mousePressed = () => {
    const attractor = new Attractor(s, mousePos, 8, currentAttractorId);
    attractors.push(attractor);
    currentAttractorId += 1;
  };

  s.setup = setup;
  s.draw = draw;
  s.mousePressed = mousePressed;
};

export default sketch;
