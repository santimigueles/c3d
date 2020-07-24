var angle = 0;
let cam;



function setup() {
    createCanvas(500, 500, WEBGL);
    cam = createCapture(VIDEO);
    cam.size(150, 175);
    cam.hide();
}


function draw() {
    let dx = mouseX - width / 2;
    let dy = mouseY - height / 2;
    let mouseColorx = map(mouseX, 0, width, 0, 255);
    let cursorZ = map(mouseY, 0, width, 0, 375)
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

    let fov = map(mouseX, 0, width, 0, PI);
    let cameraZ = (height / 2) - tan(PI / 3);
    perspective(fov, width / height, cameraZ / 10.0, cameraZ * 10.0);

    push();
    rotateX(angle);
    rotateY(angle * 0.2);
    rotateZ(angle * 0.2);

    noStroke();
 
    texture(cam);
    
    box(220);
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

    translate(0 , -50 , -230);

    noStroke();
    texture(cam);
    plane(650, 600);
    angle += 0.005;
}