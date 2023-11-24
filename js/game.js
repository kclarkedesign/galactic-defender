// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Player's spaceship
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
};

// Projectile class
class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 10;
    this.speed = 7;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y -= this.speed;
  }
}

// Enemy class
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.speed = 2;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }
}

let projectiles = [];
let enemies = [];
let lastTime = 0;

// Control the player
function handlePlayerControls() {
  if (rightPressed && player.x < canvas.width - player.width) {
    player.x += player.speed;
  } else if (leftPressed && player.x > 0) {
    player.x -= player.speed;
  }
}

// Draw the player
function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Shoot a projectile
function shoot() {
  const projectile = new Projectile(player.x + player.width / 2, player.y);
  projectiles.push(projectile);
}

// Spawn enemies
function spawnEnemies(timestamp) {
  if (timestamp - lastTime > 1000) {
    enemies.push(new Enemy(Math.random() * (canvas.width - 40), 0));
    lastTime = timestamp;
  }
}

// Detect collisions
function detectCollisions() {
  projectiles.forEach((projectile, pIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        projectile.x < enemy.x + enemy.width &&
        projectile.x + projectile.width > enemy.x &&
        projectile.y < enemy.y + enemy.height &&
        projectile.y + projectile.height > enemy.y
      ) {
        // Collision detected
        setTimeout(() => {
          enemies.splice(eIndex, 1);
          projectiles.splice(pIndex, 1);
        }, 0);
      }
    });
  });
}

// Keyboard event listeners
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = true;
  }
  if (event.code === "Space") {
    shoot();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = false;
  }
});

// Game loop
function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handlePlayerControls();
  drawPlayer();

  spawnEnemies(timestamp);
  enemies.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });

  projectiles.forEach((projectile, index) => {
    projectile.update();
    projectile.draw();
    if (projectile.y + projectile.height < 0) {
      projectiles.splice(index, 1);
    }
  });

  detectCollisions();
}

gameLoop(0); // Start the game loop
