var database,lastPlayed,playedTime;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, restart, gameOver_image, restart_image;

var bg;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOver_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
  bg = loadImage("bg1.png");

}

function setup() {
  database = firebase.database();
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(200, 180, 800, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  gameOver = createSprite(270, 80);
  restart = createSprite(270, 120);
  gameOver.addImage("gameOver", gameOver_image);
  gameOver.scale = 0.5;
  restart.addImage("restart", restart_image);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  score = 0;

}

function draw() {
 background(bg);

  database.ref('LastPlayed').on("value",readTime);
  
  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);

    camera.position.x = camera.position.x+10;

    if(trex.x % 100===0){
      ground.x = trex.x+600;
      invisibleGround.x = trex.x+100;
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

  console.log(trex.y);

    
    if (keyDown("space")) {
      trex.velocityY = -10;
    }  
    

    trex.velocityY = trex.velocityY + 0.45


    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }

  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    gameOver.x = trex.x+215;
    restart.x = trex.x+215;

    console.log(gameState);
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  textSize(15);
  fill(0);
  text("Score: " + score, trex.x+400, 120);

  textSize(20);
  text("Trex Game",trex.x+170,50);

  trex.collide(invisibleGround);
  trex.x = camera.position.x-200;


  drawSprites();

  fill(0);
  textSize(12);
console.log(lastPlayed);
  if(lastPlayed>=12){
  text("Last Played: "+lastPlayed%12 + " PM",trex.x+350,80);
  }else if(lastPlayed===0){
    text("Last Played: 12AM",trex.x+350,80);
  }else{
    text("Last Played: "+lastPlayed + " AM",trex.x+350,80);


   
  }
}

function reset() {
  gameState = PLAY;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  ground.x = ground.width / 2;
  ground.velocityX = -4;


  score = 0;

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.x = trex.x+700;

    //assign lifetime to the variable
    cloud.lifetime = 120;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.x = trex.x+565;

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function readTime(data){

  lastPlayed = data.val();

  database.ref('/').update({
  LastPlayed:hour(),
  
  })
}

