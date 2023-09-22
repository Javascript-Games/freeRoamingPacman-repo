/*
Large tile map 1000 x 1000 pixels. Ghosts wander around and randomly change directions every 5 seconds. When a ghost is with in 150 pixels of the pacman they start to chase. 

To win collect all diamonds.
*/


function customChar() {
  background(0, 255, 208);
  noStroke();
  
  
  // Rock/Wall
  fill(128,128,128); 
  rect(0, 0, 400, 400);
  noStroke();
  fill(0, 255, 208);
  rect(0,0,100,100);
  rect(350,0,50,50);
  rect(0,350,50,50);
  rect(350,350,50,50);
  fill(138,138,138);
  rect(40, 40, 70, 70);
  rect(170, 250, 80, 80);
  rect(5, 295, 50, 50);
  rect(300, 150, 25, 25);
  game.images.push(get(0,0,width,height));

  background(0, 255, 208);
  // Diamond
  fill(0, 255, 208); // set background of the custom char
  rect(0, 0, 400, 400);
  fill(0,255,255);
  triangle(50, 150, 200, 0, 350, 150);
  fill(0,205,225);
  triangle(50, 150, 200, 400, 350, 150);
  fill(0, 100, 150);
  triangle(200, 400, 50, 150, 0, 150);
  triangle(200, 400, 350, 150, 400, 150);
  fill(0, 230, 255);
  triangle(0, 150, 50, 150, 125, 0);
  fill(0, 100, 150);
  triangle(50, 150, 200, 0, 125, 0);
  fill(0, 100, 150);
  triangle(350, 150, 200, 0, 275, 0);
  fill(0, 230, 255);
  triangle(350, 150, 400, 150, 275, 0);
  game.images.push(get(0,0,width,height));
  
  // Border
  fill(0, 255, 208); // set background of the custom char
  rect(0, 0, 400, 400);
  fill(150, 105, 25);
  rect(0, 0, 400 ,400);
  fill(180, 105, 25);
  rect(75, 100, 50 ,50);
  rect(275, 150, 50 ,50);
  rect(70, 325, 50 ,50);
  fill(100, 255, 100);
  rect(0 ,0 , 400, 75);
  fill(100, 200, 100);
  rect(20, 15 , 10, 10);
  rect(320, 20 , 15, 15);
  rect(190, 30 , 15, 15);
  fill(255);
  rect(0, 0, 400, 4);
  game.images.push(get(0,0,width,height));
  
}

class pacmanObj {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.speed = s;
    this.angleOfRotation = 0;
    this.constRotation = 0.0349066 * 2; // 4 degress
    this.orientationVector = p5.Vector.fromAngle(this.angleOfRotation);
    this.damage = 0;
    
  }
  draw() {
    
    noStroke();
    
    push();
    translate(this.x+ 490, this.y+ 510);
    this.orientationVector = p5.Vector.fromAngle(this.angleOfRotation);
    rotate(this.angleOfRotation);
    fill(255, 255 - (this.damage * 40), 0);
    arc(0 , 0 , 20, 20, PI/4, -PI/4, PIE);
    pop();
    
}

  // Movement based of arrow keys however the pacman doesnt move but the tilemap deos.
  move() {
    if (keyArray[LEFT_ARROW] === 1) {
      this.angleOfRotation -= this.constRotation;
    }
    else if (keyArray[RIGHT_ARROW] === 1) {
      this.angleOfRotation += this.constRotation;
    }
    else if (keyArray[UP_ARROW] === 1) {
      game.xCor -= this.speed * cos(this.angleOfRotation);
      game.yCor -= this.speed * sin(this.angleOfRotation);
      this.y = -1 * game.yCor;
      this.x = -1 * game.xCor;
    }
    else if (keyArray[DOWN_ARROW] === 1) {
      game.xCor += this.speed * cos(this.angleOfRotation);
      game.yCor += this.speed * sin(this.angleOfRotation);
      this.y = -1 * game.yCor;
      this.x = -1 * game.xCor;
    }
  }
  
  //Collision check
  checkCollision() {
    for (var i=0; i<game.objects.length; i++) {
      if (dist(this.x+490, this.y+510, game.objects[i].x, game.objects[i].y) < 15) {
        if (game.objects[i].obj === 2) {
          if(!game.collectedDiamonds.includes(game.objects[i].location)){ // check if the diamond has already been collected
            if (game.currFrame < (frameCount - 50)) {
              game.score++;
              game.collectedDiamonds.push(game.objects[i].location);
              game.currFrame = frameCount;
            }
          }
        }
        else if (game.objects[i].obj === 1 ) {
          if(!game.destroyedRocks.includes(game.objects[i].location)){
            if (keyArray[LEFT_ARROW] === 1) {
              game.xCor -= 1 * 25;
              this.x = -1 * game.xCor;
            }
            else if (keyArray[RIGHT_ARROW] === 1) {
              game.xCor += 1 * 25;
              this.x = -1 * game.xCor;
            }
            else if (keyArray[UP_ARROW] === 1) {
              game.yCor -= 1 * 25;
              this.y = -1 * game.yCor;
            }
            else if (keyArray[DOWN_ARROW] === 1) {
              game.yCor += 1 * 25;
              this.y = -1 * game.yCor;
            }
          
          
            game.destroyedRocks.push(game.objects[i].location);
            this.damage++; // Life of the pacman 
          }
          
        }
      }
    }
  }
} // pacmanObj










class chaseState {
  constructor() {
    this.step = new p5.Vector(0,0);
  }
  execute(me) {
   
    
    if (dist(pacman.x + 490, pacman.y + 510, me.position.x, me.position.y) <= 150) {
      this.step.set(pacman.x + 490 - me.position.x, pacman.y + 510 - me.position.y);
      this.step.normalize();
      me.velocity = this.step;
      me.angle = atan2(me.velocity.y, me.velocity.x);
      me.position.add(this.step);
    }
    
  
  }
}



class avoidState {
  constructor() {
    this.oneDegree = PI / 180;
  }
  
  execute(me) {
    for (var i=0; i<game.objects.length; i++) {
           
      if(game.objects[i].obj === 1){
              
        var vec = p5.Vector.sub(game.objects[i].positionition, me.position);

        var angle = me.angle - HALF_PI - vec.heading(); 

        var y = vec.mag() * cos(angle);
      
        if ((y > -1) && (y < 35)) { // -1 instead of 0 to account for cos() = 0

          var x = vec.mag() * sin(angle);
          
          if ((x > 0) && (x < 20)) {
            me.angle += this.oneDegree;
          }
          else if ((x <= 0) && (x > 20)) {
            me.angle -= this.oneDegree;
          }

          me.velocity.x = sin(me.angle);
          me.velocity.y = -cos(me.angle);
        }
      }
    }
    me.position.add(me.velocity);
      
  }
}

class wanderState {
  constructor() {}
  
  execute(me) {   
   
    me.w--;
    if(me.w === 0){
      me.w = 300;
      me.velocity.x = random([-1, 1]); 
      me.velocity.y = random([-1, 1]);
      me.velocity.normalize();
      me.angle = atan2(me.velocity.y, me.velocity.x);
      
    }
    
      me.position.add(me.velocity);
  }
}

class ghostObj{
  constructor (x, y) {
    this.position = new p5.Vector(x, y);
    this.velocity = new p5.Vector(random([-1, 1]), random([-1, 1]));
    this.velocity.normalize();
    this.w = 300; // 60fps = wandering for 5 secs then change direction
    this.speed = 0.5;
    this.angle = atan2(this.velocity.y, this.velocity.x);
    this.dead = false;
    this.damage = false;
    this.state = [new wanderState(), new avoidState(), new chaseState()];
    this.currState = 0;
    this.ghostColor = random([[255,0,0], [255, 184, 255], [100, 100, 255],  [255, 184, 82]]);
    this.showDetBox = 0;
    this.currFrame = 0;
  }
  
  
 draw(){
    if(!this.dead){ // Only draw the alive ghosts
      
      push();
      translate(this.position.x, this.position.y);
      rotate(this.angle);
      
      if(!this.damage){
        fill(this.ghostColor)
        noStroke();
        circle(0, 0, 10);
        rect(0, 0 + 3, 10, 4);
        triangle(0 - 5, 0 + 5, 0- 5, 0 + 10, 0- 1, 0 + 2);
        triangle(0- 2, 0 + 4, 0, 0 + 9, 0+2, 0 + 2);
        triangle(0+ 2, 0 + 5, 0+ 5, 0 + 10, 0+ 5, 0 + 2);
        fill(255);
        circle(0- 2, 0, 2);
        circle(0+ 2, 0, 2);
        fill(0, 0, 255);
        circle(0- 2 + 0.5, 0+0.5, 1);
        circle(0+ 2 + 0.5, 0+0.5, 1);
      }else{
        // Damaged Ghost
        fill(this.ghostColor)
        noStroke();
        circle(0, 0, 10);
        rect(0, 0 + 3, 10, 4);
        triangle(0- 5, 0 + 5, 0- 5, 0 + 10, 0- 1, 0 + 2);
        triangle(0- 2, 0 + 4, 0, 0 + 9, 0+2, 0 + 2);
        triangle(0+ 2, 0 + 5, 0+ 5, 0 + 10, 0+ 5, 0 + 2);
        fill(255, 0, 0);
        circle(0- 2, 0, 2);
        circle(0+ 2, 0, 2);
        fill(0, 0, 255);
        circle(0- 2 + 0.5, 0+0.5, 1);
        circle(0+ 2 + 0.5, 0+0.5, 1);
        noFill(); 
        stroke(255);
        ellipse(0, 0 - 6, 6, 2);
      }
      
      pop();
    }
    
   
  }
  
  changeState(x) {
    this.currState = x;
  }
  
  checkState(){ // Determines current state
    
    for (var i = 0; i < game.objects.length; i++) {
      if (game.objects[i].obj === 1 && !game.destroyedRocks.includes(game.objects[i].location)) { // Check for rocks
        const distToRock = dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y);
        if (distToRock < 41) {
          this.changeState(1); // Switch to avoidstate
          return; 
        }
      }
    }
    
    
    var distToPac = dist(this.position.x, this.position.y, pacman.x+490, pacman.y+510);
    if(distToPac <= 150){
       this.changeState(2); // Switch to chaseState
    }else{
      this.changeState(0); // Default wanderState
    }
    
    
  }
  
  // Check ghosts collision with walls/borders/pacman/diamonds
  checkCollision(){
    for (var i=0; i<game.objects.length; i++) {
      if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 14) { // diamond and terrain collision
       if (game.objects[i].obj === 3) { // borders
         
          // angle at which collision occured
          var angle = atan2(game.objects[i].y - this.position.y, game.objects[i].x - this.position.x);

          this.velocity.x = cos(angle);
          this.velocity.y = sin(angle);

         this.velocity.normalize();
         
         
          this.position.x-= this.velocity.x * 15;
          this.position.y -= this.velocity.y * 15;

    
        }else if(game.objects[i].obj === 2){ // Diamond
          if(!game.collectedDiamonds.includes(game.objects[i].location)){
            this.dead = true;
          }
        }
      }
    }
    if(dist(pacman.x+490, pacman.y+510, this.position.x, this.position.y) < 12 && !this.dead){ // check pacman collision
       game.gameOver = 1;
    }
    
  }
  
} // ghostObj


class bulletObj {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.fire = 0;
    this.velocityocity = createVector(0, 0); // Initialize velocity vector
  }

  draw() {
    fill(255, 255, 0);
    ellipse(this.x + 490, this.y+ 510, 4, 4);

    if (this.fire) {
      this.x += this.velocityocity.x;
      this.y += this.velocityocity.y;
      
  	
      for (var i = 0; i < ghosts.length; i++) {
        if (!ghosts[i].dead && dist(this.x+490, this.y+510, ghosts[i].position.x, ghosts[i].position.y) < 8) {
          if(!ghosts[i].dead && ghosts[i].damage){
            ghosts[i].dead = true;
            ghostsAlive--;
            this.fire = 0;
          }else{
            ghosts[i].damage = true;
            this.fire = 0;
          }
        }
      }
      for (var j=0; j<game.objects.length; j++) {
        if (!game.destroyedRocks.includes(game.objects[j].location) && dist(this.x+490, this.y+510, game.objects[j].x, game.objects[j].y) < 14) { // diamond and terrain collision
           if (game.objects[j].obj === 1) { // Wall/borders
               game.destroyedRocks.push(game.objects[j].location);
               this.fire = 0;
         
           }
        }
      }
      
    }
    
    
  }
} // bulletObj





// objectObj is for the objects in the tilemap
class objectObj {
constructor(x, y, o, l) {
    this.x = x;
    this.y = y;
    this.positionition = new p5.Vector(this.x, this.y);
    this.obj = o;
    this.location = l;
  }
} // objectObj


// gameObj houses the tile map and the methos to draw the map
class gameObj {
  constructor() {
  this.tilemap = [
  "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
  "r                                                r",
  "r     w       w                w                 r",
  "r                   w       c                    r",
  "r      g                                  w      r",
  "r                  g                     g       r",
  "r      c                      w                  r",
  "r                                     w          r",
  "r           w         w                          r",
  "r    c                        w               w  r",
  "r                                       c        r",
  "r                         w                      r",
  "r    w         g                                 r",
  "r                                 g              r",
  "r             w                          w       r",
  "r      c                 w                       r",
  "r                  w              w              r",
  "r    g                                           r",
  "r                c      w                        r",
  "r                                       w        r",
  "r     w                                          r",
  "r               w        c                 g     r",
  "r                                 w              r",
  "r    w     c                                     r",
  "r                        w             c         r",
  "r        w        w                              r",
  "r                      c                 w       r",
  "r                               c                r",
  "r   w       g             w                      r",
  "r                w                      g        r",
  "r       c                       w                r",
  "r                                             w  r",
  "r                     w                          r",
  "r   w      w         c                           r",
  "r                                w               r",
  "r                                                r",
  "r     c            w                   w  c      r",
  "r              c         w                       r",
  "r                                                r",
  "r       w                       c        w       r",
  "r              g                                 r",
  "r                  c                             r",
  "r                                g               r",
  "r         w            w                         r",
  "r                                                r",
  "r            c                                   r",
  "r  w     g                        w              r",
  "r           w            w                w      r",
  "r                                                r",
  "r                             w      c           r",
  "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr"];
    
  this.gameOver = -1;
  this.score = 0;
  this.currFrame = 0;
  this.yCor = 0;
  this.xCor = 0;
  this.objects = [];
  this.collectedDiamonds = [];
  this.destroyedRocks = [];
  this.ghostSetup = true;
  this.images = [];
  } // gameObj constructor
  initialize() {
    for (var i=0; i<this.tilemap.length; i++) {
      for (var j = 0; j < this.tilemap[i].length; j++) {
      switch (this.tilemap[i][j]) {
        case 'w': 
            this.objects.push(new objectObj(j*20+10, i*20+10, 1, i*50+j));
        break;
        case 'r':
            this.objects.push(new objectObj(j*20+10, i*20+10, 3, i*50+j));
        break;
        case 'g':
            ghosts.push(new ghostObj(j*20 + 10, i*20 + 17));
        break;
        case 'c': 
            this.objects.push(new objectObj(j*20+10,i*20+10, 2, i*50+j));
        break;
        }
      }
    }
  }
    drawBackground() {
    
        for (var i = 0; i < this.tilemap.length; i++) {
          for (var j = 0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
              case 'w':
                if(!game.destroyedRocks.includes(i*50 + j)){
                  image(game.images[0], j * 20, i * 20, 20, 20);
                }
                break;
              case 'r':
                image(game.images[2], j * 20, i * 20, 20, 20);
                break;
              case 'c':
                if(!game.collectedDiamonds.includes(i*50 + j)){ // Only draw the diamonds that havent been collected.
                  image(game.images[1], j * 20, i * 20, 20, 20);
                }
                break;
            }
          }
        }
      }
} // gameObj

function checkFire() {
  if (keyArray[32] === 1) {
    if (currFrameCount < (frameCount - 10)) {
      currFrameCount = frameCount;
      bullets[bulletIndex].fire = 1;
      bullets[bulletIndex].x = pacman.x;
      bullets[bulletIndex].y = pacman.y;
      
      var dir = p5.Vector.fromAngle(pacman.angleOfRotation);

      dir.setMag(5);
      
      bullets[bulletIndex].velocityocity = dir;
      bulletIndex++;
      if (bulletIndex > bullets.length - 1) {
        bulletIndex = 0;
      }
    }
  }
} // func checkFire


function keyPressed() {
  keyArray[keyCode] = 1;
} // func keyreleased
function keyReleased() {
  keyArray[keyCode] = 0;
} // func keyReleased


var game;
var pacman;
var diamond;
var keyArray = [];
var ghostsAlive ;
var bullets = [];
var bulletIndex = 0;
var currFrameCount = 0;

function setup() {
  createCanvas(400,400);
  
  game = new gameObj();
  pacman = new pacmanObj(0, 0, 1.5);
  customChar();
  rectMode(CENTER);
  ghosts = [];
  game.initialize();
  game.gameOver = 0;
  ghostsAlive = ghosts.length;
  // Initialize bullets 
  for(var i = 0; i < 20; i++){
    append(bullets, new bulletObj());
  }
}


// Main game loop
function draw() {
  if (game.gameOver === -1) {
    game.initialize();
    game.gameOver = 0;
  }
  else if (game.gameOver === 0) {
    
    if(game.collectedDiamonds.length === 20){ // Winning condition
      game.gameOver = 3;
    }
    
    if(pacman.damage == 3){
       game.gameOver = 1;
     }
    
    background(0, 255, 208);
    push();
    translate(game.xCor-290, game.yCor-310);
    game.drawBackground();
    pacman.draw();
    pacman.move();
    pacman.checkCollision();
    for(var i = 0; i < ghosts.length; i ++){
      ghosts[i].draw();
      ghosts[i].state[ghosts[i].currState].execute(ghosts[i]);
      ghosts[i].checkCollision();
      ghosts[i].checkState();
    }
    
    checkFire();
    for (i =0; i<bullets.length; i++) {
      if (bullets[i].fire === 1) {
        bullets[i].draw();
      }
    }
    
    pop();
    
    
    fill(255, 0, 0);
    text(game.score, 350, 10);
    
  }else if(game.gameOver === 3){
    fill(255, 200, 255);
    textSize(40); 
    textAlign(CENTER);
    text("You Win", 200, 200);
  }
  else {
    fill(255, 0, 0);
    textSize(40);
    text("Game Over", 100, 200);
  }
}