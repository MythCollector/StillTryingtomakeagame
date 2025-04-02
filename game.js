const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

const gravity = 0.5;
const groundLevel = 550;

let blockAmount = 5; // Number of blocks
let characters = [];

for (let i = 0; i < blockAmount; i++) {
  characters.push({
    x: 100 + i * 60,  
    y: 100,
    width: 40,
    height: 40,
    color: getRandomColor(),
    velocityY: 0,
    velocityX: 0,
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

// Function to check collisions
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
        return other;
      }
    }
  }
  return null;
}

// Function to find all blocks stacked on a given block
function getStack(character) {
  let stack = [character];
  let checkAbove = true;

  while (checkAbove) {
    checkAbove = false;
    for (let i = 0; i < characters.length; i++) {
      let other = characters[i];
      if (
        other !== character &&
        other.x < character.x + character.width &&
        other.x + other.width > character.x &&
        other.y + other.height === character.y
      ) {
        stack.push(other);
        character = other;
        checkAbove = true;
      }
    }
  }
  return stack;
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

    // Stop at ground level
    if (character.y + character.height > groundLevel) {
      character.y = groundLevel - character.height;
      character.velocityY = 0;
      grounded = true;
    }

    character.isOnGround = grounded;

    // Handle movement & pushing for selected block
    if (index === selectedIndex) {
      let moveX = 0;
      if (keys["ArrowLeft"]) moveX = -2;
      if (keys["ArrowRight"]) moveX = 2;

      if (keys["ArrowUp"] && character.isOnGround) {
        character.velocityY = -10; // Jumping works again!
      }

      if (moveX !== 0) {
        let collision = checkCollision(character, moveX, 0);
        if (!collision) {
          character.x += moveX;
        } else {
          // Push entire stack
          let stack = getStack(collision);
          let totalWeight = stack.length;
          let pushForce = 3 / totalWeight; // More weight = harder to push

          if (Math.abs(moveX) > pushForce) {
            stack.forEach(block => {
              block.x += pushForce * Math.sign(moveX);
            });
            character.x += pushForce * Math.sign(moveX);
          }
        }
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


