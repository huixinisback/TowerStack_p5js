let crane, block, joint, joint2, winText;
let apartment;
let blockReady = false;
let rotationDirection = 1;  // 1 or -1
let rotationSpeed = 1;
let maxAngle = 30;  // max swing in degrees
let directionX = 2; // horizontal speed
let toSpawn = true;
let win = false;
let winSound, loseSound;
// all other assets like images, 3d models, music files should be loaded first.
function preload() {
  bg = loadImage('assets/citybackground.png');
  platform = loadImage('assets/towerbase.png')
  tower = loadImage('assets/tower.png');
  towerblock = loadImage('assets/tower.png');
  redcrane = loadImage('assets/crane.png');
  winSound = createAudio('assets/kids-cheering.mp3');
  loseSound = createAudio('assets/fail-sound.mp3');
  dropSound = createAudio('assets/dropping-metal-on-concrete.mp3');
  hitSound = createAudio('assets/metal-crunch.mp3');
}

function setup() {
  new Canvas(800, 600);
  world.gravity.y = 10;

  // tower base (static)
  towerbase = new Sprite(400, 600, 300, 100, 'static'); 
  towerbase.img=platform;
  towerbase.image.scale = 2;
  // crane (static visual or moving object)
  crane = new Sprite(400, 100, 100, 20, 'static');
  crane.img = redcrane;

  apartment = new Group();
  apartment.w = 80;
  apartment.h = 55;
  apartment.bounciness = 0;
  apartment.friction = 10;
  apartment.drag = 0;
  apartment.mass = 10;
  apartment.collider = 'dynamic'; 
  apartment.layer = 100;

  // spawn first block
  spawnBlock();
}

function draw() {
  clear();
  background(150);
  image(bg,0,0,800,600)
  targetHeight();
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
    if(win){
      apartment.removeAll();
      winText.remove();
      win = false;
    }
    dropSound.play();
    joint.remove();  // release the block
    joint2.remove();
    blockReady = false;
    if (!blockReady && !toSpawn){
        toSpawn = true;
        // spawn next block after delay
        setTimeout(spawnBlock, 1000);
    }
  }

  for (let apt of apartment) {
    if (apt.y > 600) {
      loseSound.play();
      joint.remove(); 
      joint2.remove();
      apartment.removeAll();  
      blockReady = false;
      if (!blockReady && !toSpawn){
        toSpawn = true;
        // spawn next block after delay
        setTimeout(spawnBlock, 1000);
      }
      break; // stop checking, we already know we want to clear
    } else if (apt.collides(apartment) && apt.y <250 && !win){
      win = true;
      winSound.play();
      winText = new Sprite(width/2,height/2);
      winText.collider = 'none';
      winText.stroke = 'rgba(0,0,0,0)';
      winText.color = 'rgba(0,0,0,0)';
      winText.text = "You win!";
      winText.textSize = 40;
      winText.textStroke = 'black';
      winText.textColor = 'white'; 
      winText.layer = 1000;
    }else if(apt.collides(apartment)){
      hitSound.play();
    }
  }
}

function spawnBlock() {
  block = new Sprite(crane.x, crane.y + 50);
  block.img = towerblock;
  block.mass = 0.5
  apartment.add(block);

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
  toSpawn = false;
}

function targetHeight(){
  // Draw dotted line
  push();
  stroke('#ffd700');
  strokeWeight(2);
  drawingContext.setLineDash([5, 5]); // 5px dash, 5px gap
  line(width/2 - 100, 200, width/2 + 100, 200);

  // Draw text next to line
  noStroke();
  fill('#ffd700');
  textSize(12);
  textAlign(LEFT, CENTER);
  text("Target Height", width/2 - 200, 200 );
  pop();
}