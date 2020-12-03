//Variables Max
let poseNet;
let poses = [];
let poseX, poseY;
let miBoton = document.querySelector('.empezar');
let opciones = document.querySelector('.selector');
let popup = document.querySelector(".popup")
let parte = 0;
let start = false
let mostrar = false;

//Variables Santi
var angle = 0;
let cam;

opciones.addEventListener('change', (event) => {
   parte = parseInt(event.target.value);
})

function mostrarPop(){
  mostrar = !mostrar;

  if(mostrar){
    popup.style.width = '200px';
    popup.style.opacity = '1';
  } else {
    popup.style.width = '0px';
    popup.style.opacity = '0';
  }
}

function posenetStart() {
  if (!isNaN(parte)) {
    miBoton.style.display = "none";
    opciones.style.display = "none";
    poseNet = ml5.poseNet(cam, modelReady);
    poseNet.on('pose', function(results) {
      poses = results;
    });
  }
  start = true;
}


function setup() {
  createCanvas(500, 500, WEBGL);
  cam = createCapture(VIDEO);
  cam.size(150, 175);
  cam.hide();
}

function draw() {
  if (start) {
    //Espejado de camara
    translate(cam.width, 0);
    scale(-1, 1);

    drawKeypoints();

    //dx -250 a 1020
    //dy -258 a 377
    //mouseColorx 27 650
    //cursorZ -6 a 471
    let dx = poseX;
    let dy = poseY;
    let mouseColorx = map(poseX, 0, width * 0.7, 0, 255);
    let cursorZ = map(poseY, 0, width * 0.7, 0, 375)
    let v = createVector(dx, dy, 0);
    v.div(100);

    ambientLight(255, 100, 50)
    directionalLight(255, 0, 255, dx, dy, 0);
    pointLight(0, 0, 255, 500, 0, 0);
    pointLight(0, 255, 0, 0, 200, 0);
    pointLight(0, 255, 0, 0, -200, 0);
    pointLight(255, mouseColorx, 100, 0, 0, 200);

    background(0);

    translate(0, 0, cursorZ);

    let fov = map(poseX * 3, 0, width, 0, PI);
    let cameraZ = (height / 2) - tan(PI / 3);
    perspective(fov, width / height, cameraZ / 50.0, cameraZ * 50.0);

    push();
    rotateX(angle);
    rotateY(angle * 0.2);
    rotateZ(angle * 0.2);

    noStroke();

    texture(cam);

    ellipsoid(220, 350, 150, 150);
    box(50);
    box(20);
    box(8);
    box(3);
    box(1);
    pop();

    push();
    translate(0, 250, 100);
    rotateX(HALF_PI);

    noStroke();
    texture(cam);
    plane(650, 600);
    pop();

    push();
    translate(0, -350, 100);
    rotateX(HALF_PI);

    noStroke();
    texture(cam)
    plane(650, 600);
    pop();

    push();
    translate(330, -50, 100);
    rotateY(HALF_PI);
    texture(cam);
    noStroke();
    plane(650, 600);
    pop();

    push();
    translate(-330, -50, 100);
    rotateY(HALF_PI);
    texture(cam);
    noStroke();
    plane(650, 600);
    pop();

    translate(0, -50, -230);

    noStroke();
    texture(cam);
    plane(650, 600);
    angle += 0.005;
  }
}

function modelReady() {
  console.log('model ready');
}

function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < min(poses.length, 1); i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        //Muñeca izquierda
        if (j == parte) {
          poseX = keypoint.position.x;
          poseY = keypoint.position.y;
        }
      }
    }
  }
}
