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
  //Helper objects for where the new block should attach to.
  craneside1 = new Sprite(350, 100, 20, 20, 'dynamic');
  craneside2 = new Sprite(450, 100, 20, 20, 'dynamic');
  craneside1.visible = false;
  craneside2.visible = false;
  crane.img = redcrane;
  weldcrane1 = new GlueJoint(craneside1,crane);
  weldcrane2 = new GlueJoint(craneside2,crane);

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
  block = new Sprite(crane.x, crane.y + 60, 80, 55);
  block.img = loadImage('assets/tower.png');

  // attach to crane with a DistanceJoint
  joint = new DistanceJoint(crane, block);
  joint.frequency = 0;
  joint.damping = 0;
  joint.springiness = 0.5;
  joint.offsetA.x = -50;
  joint.offsetB.x = -5;
  joint2 = new DistanceJoint(crane, block);
  joint2.frequency = 0;
  joint2.damping = 0;
  joint2.springiness = 0.5;
  joint2.offsetA.x = 50;
  joint2.offsetB.x = 5 ;
  blockReady = true;
}