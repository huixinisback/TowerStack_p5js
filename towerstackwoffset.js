let crane, block, joint, joint2;
let blockReady = false;
let rotationDirection = 1;  // 1 or -1
let rotationSpeed = 1;
let maxAngle = 30;  // max swing in degrees
let directionX = 2; // horizontal speed

// all other assets like images, 3d models, music files should be loaded first.
function preload() {
  bg = loadImage('assets/citybackground.png');
  platform = loadImage('assets/towerbase.png')
  tower = loadImage('assets/tower.png');
  towerblock = loadImage('assets/tower.png');
  redcrane = loadImage('assets/crane.png');
}

function setup() {
  new Canvas(800, 600);
  world.gravity.y = 10;

  // tower base (static)
  towerbase = new Sprite(400, 550, 200, 50, 'static'); 
  towerbase.img=platform;
  // crane (static visual or moving object)
  crane = new Sprite(400, 100, 100, 20, 'static');
  crane.img = redcrane;

  // spawn first block
  spawnBlock();
}

function draw() {
  clear();
  background(150);
  image(bg,0,0,800,600)
  // Oscillating rotation
  crane.rotation += rotationSpeed * rotationDirection;

  // Flip direction when reaching max angle
  if (crane.rotation > maxAngle || crane.rotation < -maxAngle) {
    rotationDirection *= -1;
  } 

  // Move crane left and right
  crane.x += directionX;

  // Reverse direction if hitting screen edges
  if (crane.x < 300 || crane.x > 500) {
      directionX *= -1;
  }

  // release block when pressing space
  if (blockReady && kb.presses('space')) {
    joint.remove();  // release the block
    joint2.remove();
    blockReady = false;

    // spawn next block after delay
    setTimeout(spawnBlock, 1000);
  }
}

function spawnBlock() {
  block = new Sprite(crane.x, crane.y + 50, 80, 55);
  block.img = towerblock;
  block.mass = 0.5

  // attach to crane with a DistanceJoint
  joint = new DistanceJoint(crane, block);
  joint.frequency = 0;
  joint.damping = 1;
  joint.springiness = 0.6;
  joint.offsetA.x = -50;
  joint.offsetB.x = -5;
  joint.collideConnected = true;
  joint2 = new DistanceJoint(crane, block);
  joint2.frequency = 0;
  joint2.damping = 1;
  joint2.springiness = 0.6;
  joint2.offsetA.x = 50;
  joint2.offsetB.x = 5 ;
  joint2.collideConnected = true;
  blockReady = true;
}