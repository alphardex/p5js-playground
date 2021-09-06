import p5 from "p5";

class Particle {
  s: p5;
  position: p5.Vector;
  velocity: p5.Vector;
  acceleration: p5.Vector;
  mass: number;
  constructor(s: p5, position = s.createVector(0, 0)) {
    this.s = s;
    this.position = position.copy();
    this.velocity = this.s.createVector(0, 0);
    this.acceleration = this.s.createVector(0, 0);
    this.mass = 1;
  }
  // 更新状态
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  // 显示
  display() {
    this.s.circle(this.position.x, this.position.y, 6);
  }
  // 更新并显示
  run() {
    this.update();
    this.display();
  }
  // 施加力
  applyForce(force: p5.Vector) {
    // Newton Law 2: F = ma
    const acceleration = p5.Vector.div(force, this.mass);
    this.acceleration.add(acceleration);
  }
}

class ParticleSystem {
  s: p5;
  particles: Particle[];
  origin: p5.Vector;
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
  // 运行
  run() {
    for (const particle of this.particles) {
      particle.run();
    }
  }
  // 对每个微粒施加力
  applyForce(force: p5.Vector) {
    this.particles.forEach((p) => p.applyForce(force));
  }
  // 对微粒应用吸引力
  applyAttractor(attractor: Attractor) {
    this.particles.forEach((p) => attractor.applyAttract(p));
  }
}

class Attractor {
  s: p5;
  position: p5.Vector;
  gravity: number;
  constructor(s: p5, position = s.createVector(0, 0)) {
    this.s = s;
    this.position = position;
    this.gravity = 0.05;
  }
  // 显示
  display() {
    this.s.circle(this.position.x, this.position.y, 32);
  }
  // 施加引力
  applyAttract(p: Particle) {
    const gravityForce = p5.Vector.sub(this.position, p.position);
    gravityForce.setMag(this.gravity);
    p.applyForce(gravityForce);
  }
}

const sketch = (s: p5) => {
  let ps: ParticleSystem;
  let attractors: Attractor[] = [];
  let mousePos: p5.Vector;

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

    ps.run();

    attractors.forEach((attractor) => {
      attractor.display();
      ps.applyAttractor(attractor);
    });

    s.blendMode(s.BLEND);
  };

  const mousePressed = () => {
    const attractor = new Attractor(s, mousePos);
    attractors.push(attractor);
  };

  s.setup = setup;
  s.draw = draw;
  s.mousePressed = mousePressed;
};

export default sketch;
