let maskImage;
let confettiGraphics;
let confettiParticles;
let mic;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create equilateral triangle mask
  let maskGraphics = createGraphics(width, height);
  maskGraphics.clear();
  maskGraphics.stroke(255);
  let a = width / 2;
  let a3 = a * sqrt(3);
  maskGraphics.triangle(0, height - a3, 2 * a, height - a3, a, height);
  maskImage = createImage(width, height);
  maskImage.copy(maskGraphics, 0, 0, width, height, 0, 0, width, height);

  // Create confetti graphics buffer
  confettiGraphics = createGraphics(width, height);
  confettiGraphics.noStroke();
  confettiParticles = new ParticleSystem(width / 2, height);

  // Set up microphone input
  mic = new p5.AudioIn();
  mic.start();

  imageMode(CENTER);
  angleMode(DEGREES);
  rectMode(CENTER);
}

function draw() {
  background('#25194C');

  // Get masked image
  let img = confettiGraphics.get();
  img.mask(maskImage);

  // Update particle system
  confettiParticles.run();

  // Add particle if volume is high enough
  if (mic.getLevel() > 0.02) {
    confettiParticles.addParticle();
  }

  // Kaleidoscope drawing
  translate(width / 2, height / 2);
  for (let i = 0; i < 3; i++) {
    image(img, 0, -height / 2);
    push();
    rotate(60);
    scale(-1, 1);
    image(img, 0, -height / 2);
    pop();
    rotate(120);
  }
}

// Particle and ParticleSystem classes would need to be added below.
// Let me know if you want help writing those too.
