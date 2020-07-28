var socket;
let video;
let poseNet;
let poses = [];
let poseX, poseY, nPoseX, nPoseY;
let miBoton, opciones;
let parte = 0;
let pg;

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
  createCanvas(window.innerWidth, window.innerHeight)

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

  //setupOsc(12000, 3334);

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
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, 640, 480);
  image(pg, 0, 0, width, height);
  drawKeypoints();
}


function setupOsc(oscPortIn, oscPortOut) {
  socket = io.connect('http://127.0.0.1:8081', {
    port: 8081,
    rememberTransport: false
  });
  socket.on('connect', function() {
    socket.emit('config', {
      server: {
        port: oscPortIn,
        host: '127.0.0.1'
      },
      client: {
        port: oscPortOut,
        host: '127.0.0.1'
      }
    });
  });
  socket.on('message', function(msg) {
    if (msg[0] == '#bundle') {
      for (var i = 2; i < msg.length; i++) {
        receiveOsc(msg[i][0], msg[i].splice(1));
      }
    } else {
      receiveOsc(msg[0], msg.splice(1));
    }
  });
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

          pg.stroke(230, 80, 0);
          pg.strokeWeight(5);
          pg.line(poseX, poseY, nPoseX, nPoseY);

          nPoseX = poseX;
          nPoseY = poseY;

          // socket.emit('message', [poseX, poseY]);
        }
      }
    }
  }
}

function keyPressed() {
  pg.clear();
}
