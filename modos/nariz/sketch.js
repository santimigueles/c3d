let video;
let poseNet;
let poses = [];
let poseX, poseY, nPoseX, nPoseY;
let miBoton, opciones;
let parte = 0;
let pg;
let colorPicker
let popup = document.querySelector(".popup")
let mostrar = false;


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
  if(opciones.value() != 'Seleccionar...'){
    miBoton.hide();
    opciones.hide();
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function(results) {
      poses = results;
    });
  }
}

function setup() {
  let cnv = createCanvas(window.innerWidth, window.innerHeight)
  cnv.style('pointer-events', 'none')

  pixelDensity(1);
  pg = createGraphics(width, height);

  let miDiv = createDiv()
  miDiv.addClass('selector')

  miBoton = createButton('Empezar');
  miBoton.mousePressed(posenetStart);

  opciones = createSelect();
  opciones.option('Seleccionar...')
  opciones.option('nariz')
  opciones.option('mano izquierda')
  opciones.option('mano derecha')
  opciones.changed(cambioDeteccion)

  miDiv.child(opciones)
  miDiv.child(miBoton)

  colorPicker = createColorPicker('#ed225d');
  colorPicker.position(width - 150, height - 50);


  video = createCapture(VIDEO);
  video.size(width, height)
  video.hide();
}

function cambioDeteccion() {
  let val = opciones.value();
  switch (val) {

    case 'nariz':
      parte = 0;
      break;

    case 'mano izquierda':
      parte = 9;
      break;

    case 'mano derecha':
      parte = 10;
      break;

    default:
      parte = 0;
      break;
  }
}

function draw() {
  push()
  pixelDensity(3.0)
  textSize(15)
  fill(50,50,50,150)
  text('Color', width - 145, height - 45)
  pop()
  translate(video.width, 0);
  scale(-1, 1);
  //image(video, 0, 0, 640, 480);
  image(pg, 0, 0, width, height);
  drawKeypoints();
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
        //Aca se elige con que parte del cuerpo se controla el sketch
        if (j == parte) {
          poseX = keypoint.position.x;
          poseY = keypoint.position.y;

          pg.stroke(colorPicker.value());
          pg.strokeWeight(5);
          pg.line(poseX, poseY, nPoseX, nPoseY);

          nPoseX = poseX;
          nPoseY = poseY;
        }
      }
    }
  }
}

function keyPressed() {
  pg.clear();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
