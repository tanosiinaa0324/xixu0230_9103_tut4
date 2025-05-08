let maskImage;
let confettiGraphics;
let confettiParticles;
let mic;
  
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // equilateral triangle mask, big enough to cover the canvas
  let maskGraphics = createGraphics(width, height);
  maskGraphics.clear();
  maskGraphics.stroke(255); // extra pixel to leave no gaps
  let a = width/2, a3 = a * sqrt(3);
  maskGraphics.triangle(0, height-a3, 2 * a, height-a3, a, height);
  maskImage = createImage(width, height);
  maskImage.copy(maskGraphics, 0, 0, width, height, 0, 0, width, height);
  
  // draw confetti particle system on to this offscreen graphics buffer
  confettiGraphics = createGraphics(width, height);
  confettiGraphics.noStroke();
  confettiParticles = new ParticleSystem(width / 2, height);

  // set up audio input
  mic = new p5.AudioIn();
  mic.start();
  
  // drawing conveniences needed later
  imageMode(CENTER);
  angleMode(DEGREES);
  rectMode(CENTER);
}

function draw() {
  background('#25194C');
  
  // have to convert p5.Graphics to p5.Image to use mask()
  let img = confettiGraphics.get();
  img.mask(maskImage);
  
  // update motion for particle system
  confettiParticles.run();
  
  // add a particle if the volume from the mic is loud enough
  if (mic.getLevel() > 0.02) {
    confettiParticles.addParticle();
  }
  
  // do kaleidescope effect:
  // - draw masked image (triangle)
  // - rotate another 60 degrees around the middle of canvas
  // - flip image and draw again (scale)
  // - rotate 120 degrees and do it again
  // (repeat 3x to cover whole circle, 360 degrees)
  translate(width/2, height/2);
  for (let i = 0; i < 3; i++) {
    image(img, 0, -height/2);
    // mirror the image directly next to this
    push();
    rotate(60);
    scale(-1, 1);
    image(img, 0, -height/2);
    pop();
    // rotate before doing the next pair
    rotate(120);
  }
}
/*
 * standard particle system adapted from:
 * https://p5js.org/examples/simulate-particle-system.html
 */
class Particle {

  constructor(position, col) {
    this.color = col;
    this.acceleration = createVector(0, -0.05);
    this.velocity = createVector(random(-1, 1), random(-3, 0));
    this.position = position.copy();
    this.size = random(12, 30);
    this.angularVelocity = random(-0.05, 0.05);
    this.rotation = 0;
    this.lifespan = 255;
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    // move / do motion
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.rotation += this.angularVelocity;
    this.lifespan -= 2;
  }

  display() {
    // draw on screen
    confettiGraphics.push();
    confettiGraphics.fill(this.color);
    confettiGraphics.translate(this.position.x, this.position.y);
    confettiGraphics.rotate(this.rotation);
    
    // TODO replace with images?
    confettiGraphics.rect(0, 0, this.size, this.size);
    confettiGraphics.pop();
  }

  isDead() {
    return this.lifespan < 0;
  }

}

class ParticleSystem {

  constructor(x, y) {
    this.origin = createVector(x, y);
    this.particles = [];
    
    // array of brand colors
    this.colors = [color('#25194C'), color('#FFC743'), color('#FA7500'), color('#FF4FA6'), color('#F7F2D6'), color('#F7BAD1')];
  }

  addParticle() {
    // create a particle in the middle
    // with a random color from the this.colors array
    this.particles.push(new Particle(this.origin, random(this.colors)));
  }

  run() {
    confettiGraphics.clear();
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}