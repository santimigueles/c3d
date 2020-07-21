var socket;
let video;
let poseNet;
let poses = [];
let poseX, poseY;
let miBoton;

function posenetStart() {
  miBoton.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
}

function setup() {
  manoX = 0;
  manoY = 0;

  createCanvas(window.innerWidth, window.innerHeight,P2D)

  miBoton = createButton('Empezar');
  miBoton.center();
  miBoton.mousePressed(posenetStart);

  setupOsc(12000, 3334);

  video = createCapture(VIDEO);
  video.size(width,height)
  video.hide();
}

function draw() {
  clear()
  //image(video, width / 2 - 200, 100, 320, 240);
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
        if (j == 9) {
          poseX = keypoint.position.x;
          poseY = keypoint.position.y;
          fill(0, 255, 0);
          ellipse(poseX, poseY, 100, 100);

          socket.emit('message', [poseX, poseY]);
        }
      }
    }
  }
}
