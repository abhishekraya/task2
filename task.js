const board = document.getElementById("canvas");
const ctx = board.getContext("2d");

let homeHealth = 100;
let score=0;

//Board
let tileSize = 15;
let rows = 15;
let columns = 15;

board.width = window.innerWidth-100;
board.height = window.innerHeight-100 ;

ctx.fillStyle="white";
ctx.fillText("Home Health: ",0,0);


//Ship
let shipX = board.width / 2;
let shipY = board.height - tileSize * 5;
let shipVelocityX = 2 * tileSize;
let shipVelocityY = tileSize;
let shipWidth = tileSize * 2;
let shipHeight = tileSize * 3;
let shipImage = new Image();
shipImage.src = "spaceship.png"

let homeImage = new Image();
homeImage = "home.jpg";

let ship = {
  x: shipX,
  y: shipY,
  img: shipImage,
  width: shipWidth,
  height: shipHeight
}

let home = {
  x: 0,
  y: board.height-30,
  img: homeImage,
  width: board.width,
  height: 30
}

//Aliens
let alienArray = [];
let alienX = tileSize;
let alienY = tileSize;
let alienWidth = tileSize * 3;
let alienHeight = tileSize * 3;


let alienRows = Math.floor(Math.random() * 6 + 2);
let alienColumns = Math.floor(Math.random() * 8 + 5);
let alienCount = 0;
let alienVelocityX = 3;

//Bullets
let bulletArray = [];
let bulletVelocityY = -10;



window.onload = function () {
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keydown", shootBullet);
  // createAlien();
  gameUpdate();
}



function gameUpdate() {
  requestAnimationFrame(gameUpdate);
  ctx.clearRect(0, 0, board.width, board.height);

  //Board
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, board.width, board.height);

  //SpaceShip
  ctx.drawImage(ship.img, ship.x, ship.y, ship.width, ship.height);
  
  //Home
  ctx.fillStyle="blue";
  ctx.fillRect(home.x,home.y,home.width,home.height);
  ctx.fillStyle="white";
  ctx.font="30px Algerian";
  ctx.fillText("HOME",board.width/2-15,home.y+28)
  // ctx.drawImage(home.img, home.x, home.y, home.width, home.height);


  //Rendering Aliens

  for (let i = 0; i < alienArray.length; i++) {
    let aliens = alienArray[i];
    aliens.x += alienVelocityX;
    //if alien touch border of canvas
    if (aliens.x + aliens.width >= board.width || aliens.x <= 0) {
      alienVelocityX *= -1;
      aliens.x += alienVelocityX * 2;

      for (let j = 0; j < alienArray.length; j++) {
        alienArray[j].y += alienHeight;
      }
      if (aliens.y === board.height) {
        gameOver();
      }
    }

    if (aliens.alive) {
      ctx.fillStyle = "red";
      ctx.fillRect(aliens.x, aliens.y, aliens.width, aliens.height);
    }
  }

  //Bullets
  for (let i = 0; i < bulletArray.length; i++) {
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

    //collision detection
    for (let i = 0; i < alienArray.length; i++) {
      let alien = alienArray[i];
      if (!bullet.used && alien.alive && collision(bullet, alien)) {
        bullet.used = true;
        alien.alive = false;
        alienArray.splice(i, 1);
        score++;
        alienCount--;

      }
    }

  }

  //Removing used bullets
  while (bulletArray.length > 0 && (bulletArray[0].bulletUsed || bulletArray[0].y < 0)) {
    bulletArray.shift();
  }
  //Removing aliens
  for (i = alienArray.length - 1; i >= 0; i--) {
    if (alienArray[i].y >= board.height - tileSize * 7) {
      alienArray[i].alive = false;
      alienArray.splice(i, 1);
      alienCount--;
      homeHealth--;
    }
  }
  if (alienCount === 0) {
    alienArray = [];
    bulletArray = [];
    createAlien();
    alienRows = Math.floor(Math.random() * 3 + 2);
    alienColumns = Math.floor(Math.random() * 5 + 5);
  }

  document.getElementById('health').innerHTML = `Home Health: ${homeHealth}`;
  document.getElementById('score').innerHTML = `Score: ${score}`;
  if (homeHealth <= 0) {
    gameOver();
  }

}

function moveShip(e) {
  if (e.key === "ArrowLeft" && ship.x > 0) {
    ship.x -= shipVelocityX;
  }
  else if (e.key === "ArrowRight" && shipX < board.width - ship.width) {
    ship.x += shipVelocityX;
  }
  else if (e.key === "ArrowUp" && ship.y > 0) {
    ship.y -= shipVelocityY;
  }
  else if (e.key === "ArrowDown" && shipX < board.height - ship.height) {
    ship.y += shipVelocityY;
  }


}
//Creating Alien Ships using Array
function createAlien() {
  for (let i = 0; i < alienColumns; i++) {
    for (let j = 0; j < alienRows; j++) {
      let aliens = {
        x: alienX + i * alienWidth,
        y: alienY + j * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true
      }
      alienArray.push(aliens);
    }
  }
  alienCount = alienArray.length;
}

//Shooting bullet iff spacebar is pressed
function shootBullet(e) {
  if (e.key === " ") {
    let bullet = {
      x: ship.x + ship.width / 2 - 3,
      y: ship.y,
      width: tileSize / 2,
      height: tileSize / 2,
      bulletUsed: false
    }
    bulletArray.push(bullet);
  }

}

function collision(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

}

function gameOver() {
  alert("Game Over click ok to restart");
  alienArray = [];
  bulletArray = [];
  score = 0;
  homeHealth = 100;
  location.reload();
}

