import oscP5.*;
import netP5.*;

float x,y;

OscP5 oscP5;
NetAddress myRemoteLocation;

void setup() {
  size(500,500);
  //frameRate(25);
  /* start oscP5, listening for incoming messages at port 12000 */
  oscP5 = new OscP5(this,3334);

  myRemoteLocation = new NetAddress("127.0.0.1",12000);
}


void draw() {
  background(0);
  
  fill(255);
  ellipse(x, y, 100, 100);
  fill(0);
  text("I'm Processing", x-40, y);
}


void mousePressed() {
  /* createan osc message with address pattern /test */
  OscMessage myMessage = new OscMessage("/test");
  
  myMessage.add(123); /* add an int to the osc message */
  myMessage.add(456); /* add a second int to the osc message */

  /* send the message */
  oscP5.send(myMessage, myRemoteLocation); 
}


/* incoming osc message are forwarded to the oscEvent method. */
void oscEvent(OscMessage theOscMessage) {
 

  if(theOscMessage.checkAddrPattern("/test")==true){
     x = theOscMessage.get(0).floatValue();
     y = theOscMessage.get(1).floatValue();
    // println("X: " + x);
     //println("Y: " + y);
  }
}
