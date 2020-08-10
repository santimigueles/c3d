//Imporamos las libreras de OSC
import oscP5.*;
import netP5.*;

//El x e y de nuestra parte del cuerpo detectada
float x,y,x1,y1;

//Creo los objetos de las librerias
OscP5 oscP5;
NetAddress myRemoteLocation;

void setup() {
  size(640,480);
  // Seteamos el puerto en el que se recibe la data de la web 
  oscP5 = new OscP5(this,3334);
}


void draw() {
  background(0);
  //Dibujamos un circulo blanco
  fill(255);
  ellipse(x, y, 100, 100);
  fill(0);
  text("I'm Processing", x-40, y);
  
  ellipse(x1, y1, 100, 100);
  fill(0);
  text("I'm Processing2", x-40, y1);
}

//Aca se recibe la data de OSC
void oscEvent(OscMessage theOscMessage) {
  if(theOscMessage.checkAddrPattern("/poses/0/keypoints/nose/")==true){
     x = theOscMessage.get(0).floatValue();
     y = theOscMessage.get(1).floatValue();
  }
}
