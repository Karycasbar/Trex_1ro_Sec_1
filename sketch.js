
var trex ,trex_running;
var suelo;
var ImagenSuelo;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png")
  ImagenSuelo = loadImage("ground2.png");
}

function setup(){
  createCanvas(600,200)
  
  //crear sprite de Trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running",trex_running);
  trex.scale = 0.5;
  suelo = createSprite(200,180,400,20);
  suelo.addImage("suelo",ImagenSuelo);
 
}
function draw(){
  background("yellow")
  if(keyDown("space")){
    trex.velocityY = -10;
  }
  trex.velocityY = trex.velocityY + 0.5;
  suelo.velocityX = -2;
  if(suelo.x < 0){
    suelo.x = suelo.width / 2;
  }
  trex.collide(suelo);

  drawSprites()
}
