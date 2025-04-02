// Get the buttons and canvas
const boyBtn = document.getElementById('boyBtn');
const girlBtn = document.getElementById('girlBtn');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let character = { gender: '', x: 400, y: 300, width: 50, height: 50, color: '' };

// Set the character color based on gender choice
boyBtn.addEventListener('click', () => {
    character.gender = 'Boy';
    character.color = 'blue'; // Set color for the boy
    startGame();
});

girlBtn.addEventListener('click', () => {
    character.gender = 'Girl';
    character.color = 'pink'; // Set color for the girl
    startGame();
});

// Function to start the game and hide customization screen
function startGame() {
    document.querySelector('.container').style.display = 'none';
    canvas.style.display = 'block';
    canvas.width = 800;  // Ensuring canvas has the correct width
    canvas.height = 600; // Ensuring canvas has the correct height
    gameLoop();
}

// Update player movement
function update() {
    // Move with arrow keys
    if (keys.up) character.y -= 5;
    if (keys.down) character.y += 5;
    if (keys.left) character.x -= 5;
    if (keys.right) character.x += 5;
}

// Draw player character
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height); // Draw the character
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Handle key events for movement
const keys = { up: false, down: false, left: false, right: false };

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.up = true;
    if (e.key === 'ArrowDown') keys.down = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.up = false;
    if (e.key === 'ArrowDown') keys.down = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});
