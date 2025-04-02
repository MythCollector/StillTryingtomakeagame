const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const gravity = 0.5; // Strength of gravity
const groundLevel = 550; // Where the ground is

let blockAmount = 5; // Control how many blocks you want
let characters = [];

for (let i = 0; i < blockAmount; i++) {
  characters.push({
    x: 100 + i * 60,  // Start with some spacing
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

function update() {
  characters.forEach((character, index) => {
    // Apply gravity if there's no solid block below
    let grounded = false;

    // Check for stacking on other blocks
    for (let i = 0; i < characters.length; i++) {
      if (i !== index) {
        const other = characters[i];

        // Check if the character is right above another one
        if (
          character.x < other.x + other.width &&
          character.x + character.width > other.x &&
          character.y + character.height <= other.y &&
          character.y + character.height + character.velocityY >= other.y
        ) {
          character.y = other.y - character.height;
          character.velocityY = 0;
          grounded = true;
          break;
        }
      }
    }

    // If not stacked, apply gravity
    if (!grounded) {
      character.velocityY += gravity;
      character.y += character.velocityY;
    }

    // Check collision with the ground
    if (character.y + character.height > groundLevel) {
      character.y = groundLevel - character.height;
      character.velocityY = 0;
      grounded = true;
    }

    character.isOnGround = grounded;

    // Allow only the selected character to move left/right & jump
    if (index === selectedIndex) {
      if (keys["ArrowUp"] && character.isOnGround) {
        character.velocityY = -10; // Jump
      }
      if (keys["ArrowLeft"]) character.x -= 2;
      if (keys["ArrowRight"]) character.x += 2;
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
    ctx.fillRect(char.x, char.y, char.width, char.height); // Draw square

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
