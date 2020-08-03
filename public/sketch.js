
function setup() {
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL)
  cnv.position(0,0)
}

function draw() {
  clear()
  translate(width * 0.35, -130)
  rotateY(mouseY)
  rotateX(mouseX)

  noFill()
  stroke(255,150)
  sphere(100, 24)
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
