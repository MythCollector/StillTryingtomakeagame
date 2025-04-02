const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

type Character = {
  x: number;
  y: number;
  color: string;
};

let characters = [
  { x: 100, y: 100, color: "red" },
  { x: 200, y: 100, color: "blue" },
  { x: 300, y: 100, color: "green" }
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
  if (keys["ArrowUp"]) character.y -= 2;
  if (keys["ArrowDown"]) character.y += 2;
  if (keys["ArrowLeft"]) character.x -= 2;
  if (keys["ArrowRight"]) character.x += 2;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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


