const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const gravity = 0.5;
const groundLevel = 550;

let blockAmount = 5; // Change this to add more blocks
let characters = [];

for (let i = 0; i < blockAmount; i++) {
  characters.push({
    x: 100 + i * 60,  
    y: 100,
    width: 40,
    height: 40,
    color: getRandomColor(),
    velocityY: 0,
    isOnGround: false
  });
}

let selectedIndex = 0;
const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

document.addEventListener("keypress", (e) => {
  if (e.key === " ") {
    selectedIndex = (selectedIndex + 1) % characters.length;
  }
});

function getRandomColor() {
  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function checkCollision(character, dx, dy) {
  for (let i = 0; i < characters.length; i++) {
    if (characters[i] !== character) {
      const other = characters[i];

      if (
        character.x + dx < other.x + other.width &&
        character.x + dx + character.width > other.x &&
        character.y + dy < other.y + other.height &&
        character.y + dy + character.height > other.y
      ) {
        return true; // Collision detected
      }
    }
  }
  return false;
}

function update() {
  characters.forEach((character, index) => {
    let grounded = false;

    // Apply gravity if not on top of another block
    if (!checkCollision(character, 0, character.velocityY + 1)) {
      character.velocityY += gravity;
    } else {
      character.velocityY = 0;
      grounded = true;
    }
    character.y += character.velocityY;

    // Prevent falling through ground
    if (character.y + character.height > groundLevel) {
      character.y = groundLevel - character.height;
      character.velocityY = 0;
      grounded = true;
    }

    character.isOnGround = grounded;

    // Allow only the selected character to move left/right & jump
    if (index === selectedIndex) {
      if (keys["ArrowUp"] && character.isOnGround) {
        character.velocityY = -10;
      }
      if (keys["ArrowLeft"] && !checkCollision(character, -2, 0)) {
        character.x -= 2;
      }
      if (keys["ArrowRight"] && !checkCollision(character, 2, 0)) {
        character.x += 2;
      }
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = "black";
  ctx.fillRect(0, groundLevel + 20, canvas.width, 30);

  characters.forEach((char, index) => {
    ctx.fillStyle = char.color;
    ctx.fillRect(char.x, char.y, char.width, char.height);

    if (index === selectedIndex) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 3;
      ctx.strokeRect(char.x, char.y, char.width, char.height);
    }
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
