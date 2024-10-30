var trex ,trex_running, trex_colision;
var suelo,ImagenSuelo;
var sueloInvisible;
var nube, ImagenNube;
var obstaculo, obs1, obs2, obs3, obs4, obs5, obs6;
var puntos = 0;
var JUGAR = 1;
var FIN = 0;
var EstadoJuego = JUGAR;
var GrupoObstaculos, GrupoNubes;
var restart, restartImg, gameOver, gameOverImg;
var jumpSound, dieSound, checkSound;
function preload(){ //funcion para precargar archivos(imagenes, audio y videos)
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");  
  ImagenSuelo = loadImage("ground2.png");
  ImagenNube = loadImage("cloud.png");

  obs1 = loadImage("obstacle1.png");
  obs2 = loadImage("obstacle2.png");
  obs3 = loadImage("obstacle3.png");
  obs4 = loadImage("obstacle4.png");
  obs5 = loadImage("obstacle5.png");
  obs6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  trex_colision = loadImage("trex_collided.png");

  jumpSound = loadSound("jump.mp3"); //loadSound es para cargar archivos de audio
  dieSound = loadSound("die.mp3");
  checkSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(600,200)//canvas crea el area del juego

  
  //crear sprite de Trex
  trex = createSprite(50,180,20,50); 
  trex.addAnimation("running", trex_running); //Asignar la animacion de correr  
  trex.addAnimation("collided", trex_colision); //Asignar la animacion de colisionar
  trex.scale = 0.5; //escala
  

  //crear sprite del suelo
  suelo = createSprite(200,180,400,20);
  suelo.addImage("suelo", ImagenSuelo);

  //crear sprite del suelo invisible
  sueloInvisible = createSprite(200,190,400,10);
  sueloInvisible.visible = false; //cambiar la visibilidad del sprite para que sea falso y asi no verla

  //crear grupos de obstaculos y nubes
  GrupoObstaculos = new Group(); //asi de crea el grupo para los obstaculos
  GrupoNubes = new Group(); //asi de crea el grupo para las nube

  restart = createSprite(300,140);
  restart.addImage(restartImg);

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);

  restart.scale = 0.5;
  gameOver.scale = 0.5;
}

function draw(){
  background("white"); //para poner el color de fondo
  text("Puntuación " + puntos, 500, 50); //asi creamos el texto en el juego  

  //Estados de juego
  if(EstadoJuego === JUGAR){ //condicion para poder crear el estado del juego PLAY (jugar)
    suelo.velocityX = -(6 + puntos/100); //mover el suelo

    //generar puntuación
    puntos = puntos + Math.round(getFrameRate() / 60); //FrameRate se usa para obtener los frames por segundo, lo cual hace que la puntuacion sea lenta
    if(puntos > 0 && puntos % 100 === 0){ //con esta condición checamos que en puntación sea mayor a 0 y que puntuacion obtengamos cada 100 frames lo cual nos ayudara con el sonido
      checkSound.play(); //play nos ayuda a reproducir el sonido cuando se indique
    }

    //reiniciar el suelo
    if(suelo.x < 0){
      suelo.x = suelo.width/2;
    }

  //salto del trex
  if(keyDown("space") && trex.y >= 160){ //condición para detectar el salto con el keyDown
    trex.velocityY = -10;
    jumpSound.play(); //sonido de salto
  }
  //caida/gravedad del trex
  trex.velocityY = trex.velocityY + 0.5;
  
  MostrarNubes();//llamado de la función de nubes

  MostrarObstaculos();//llamado de la función de obstaculos

//cambiar el estado a game over
  if(GrupoObstaculos.isTouching(trex)){ //condicion para cuando el grupo de obstaculos es tocado por el dino
    EstadoJuego = FIN; //cambiamos el juego a fin
    dieSound.play(); //reproducir el sonido de muerte
  }

  gameOver.visible = false; //esconder la imagen del Game Over
  restart.visible = false; //esconder la imagen del Restart
  }
  else if(EstadoJuego === FIN){ //condicion para cambiar el juego el juego a Fin que es el Game Over
    //detener el suelo
    suelo.velocityX = 0; //cambiamos la velocidad a 0 al suelo
    trex.velocityY = 0; //cambiamos la velocidad a 0 del dino

    GrupoObstaculos.setVelocityXEach(0); //detenemos la velocidad del grupo de obstaculos
    GrupoNubes.setVelocityXEach(0); //detenemos la velocidad del grupo de nubes 

    gameOver.visible = true;
    restart.visible = true;

    //cambiar la animación del Trex
    trex.changeAnimation("collided", trex_colision); 

    //establecer lifetime de los obstaculos y nubes para que no sean destruidos despues del fin del juego
    GrupoObstaculos.setLifetimeEach(-1);  
    GrupoNubes.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }
  }

  //evitar que el trex caiga
  trex.collide(sueloInvisible);

  drawSprites();
}

function MostrarNubes(){
  if(frameCount % 60 === 0){ 
  nube = createSprite(600, 100, 40, 10);
  nube.addImage(ImagenNube);
  nube.y = Math.round(random(10,60))
  nube.scale = 0.4;
  nube.velocityX = -(6 + puntos/100);

  //ajustar la profundidad
  nube.depth = trex.depth;
  trex.depth = trex.depth + 1;

  //asignar ciclo de vida
  nube.lifetime = 210;

  //agregar cada nube al grupo
  GrupoNubes.add(nube);
  }
}

function MostrarObstaculos(){
  if(frameCount % 60 === 0){
    obstaculo = createSprite(600, 165, 10, 40);
    obstaculo.velocityX = -(6 + puntos/100);

    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstaculo.addImage(obs1);
      break;
      case 2: obstaculo.addImage(obs2);
      break
      case 3: obstaculo.addImage(obs3);
      break
      case 4: obstaculo.addImage(obs4);
      break
      case 5: obstaculo.addImage(obs5);
      break
      case 6: obstaculo.addImage(obs6);
      break
      default: break;
    }
    //asignar escala y tiempo de vida
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 210;

    //agregar cada obstáculo al grupo
    GrupoObstaculos.add(obstaculo);
  }
}

function reset(){
  EstadoJuego = JUGAR;
  gameOver.visible = false;
  restart.visible = false;

  GrupoObstaculos.destroyEach();
  GrupoNubes.destroyEach();

  trex.changeAnimation("running", trex_running);
  puntos = 0;
}
