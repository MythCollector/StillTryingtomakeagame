const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const gravity = 0.5; // Strength of gravity
const groundLevel = 550; // Where the ground is

let characters = [
  { x: 100, y: 100, color: "red", velocityY: 0 },
  { x: 200, y: 100, color: "blue", velocityY: 0 },
  { x: 300, y: 100, color: "green", velocityY: 0 }
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
  let character = characters[selectedIndex];

  // Apply gravity
  character.velocityY += gravity;
  character.y += character.velocityY;

  // Prevent falling below ground
  if (character.y > groundLevel) {
    character.y = groundLevel;
    character.velocityY = 0; // Stop falling when on ground
  }

  // Movement
  if (keys["ArrowUp"] && character.y === groundLevel) {
    character.velocityY = -10; // Jump
  }
  if (keys["ArrowLeft"]) character.x -= 2;
  if (keys["ArrowRight"]) character.x += 2;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ground
  ctx.fillStyle = "black";
  ctx.fillRect(0, groundLevel + 20, canvas.width, 30);

  characters.forEach((char, index) => {
    ctx.fillStyle = char.color;
    ctx.beginPath();
    ctx.arc(char.x, char.y, 20, 0, Math.PI * 2);
    ctx.fill();

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
