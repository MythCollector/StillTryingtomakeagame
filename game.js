const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const gravity = 0.5; // Strength of gravity
const groundLevel = 550; // Where the ground is

let characters = [
  { x: 100, y: 100, width: 40, height: 40, color: "red", velocityY: 0 },
  { x: 200, y: 100, width: 40, height: 40, color: "blue", velocityY: 0 },
  { x: 300, y: 100, width: 40, height: 40, color: "green", velocityY: 0 }
];

let selectedIndex = 0;
const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

document.addEventListener("keypress", (e) => {
  if (e.key === " ") {
    selectedIndex = (selectedIndex + 1) % characters.length;
  }
});

function update() {
  characters.forEach((character, index) => {
    // Apply gravity to ALL characters
    character.velocityY += gravity;
    character.y += character.velocityY;

    // Collision detection with ground and stacking
    if (character.y + character.height > groundLevel) {
      character.y = groundLevel - character.height; // Prevent falling below ground
      character.velocityY = 0; // Stop vertical movement

      // Stack characters on top of each other if they overlap
      for (let i = 0; i < characters.length; i++) {
        if (i !== index) {
          const other = characters[i];
          // Check for overlap
          if (character.x < other.x + other.width &&
            character.x + character.width > other.x &&
            character.y + character.height > other.y &&
            character.y < other.y + other.height) {
            // Stack character on top of the other
            character.y = other.y - character.height;
            character.velocityY = 0;
          }
        }
      }
    }

    // Allow only the selected character to move left/right & jump
    if (index === selectedIndex) {
      if (keys["ArrowUp"] && character.y === groundLevel) {
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
    ctx.fillRect(char.x, char.y, char.width, char.height); // Draw as square (rectangle)

    if (index === selectedIndex) {
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
