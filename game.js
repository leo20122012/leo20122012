const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const speedRange = document.getElementById("speedRange");

const initialCarWidth = 40;
const initialCarHeight = 80;
let carWidth = initialCarWidth;
let carHeight = initialCarHeight;
let carX = (canvas.width - carWidth) / 2;
const carY = canvas.height - carHeight - 10;
const carSpeed = 5;

let obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 80;
let obstacleSpeed = Number(speedRange.value);
let obstacleFrequency = 100; // Frequency to generate obstacles

let frames = 0;
let gameRunning = true;
let score = 0;

document.addEventListener("keydown", moveCar);
document.getElementById("resetButton").addEventListener("click", resetGame);
speedRange.addEventListener("input", adjustSpeed);

function moveCar(e) {
    if (gameRunning) {
        if (e.key === "ArrowLeft" && carX > 0) {
            carX -= carSpeed;
        } else if (e.key === "ArrowRight" && carX < canvas.width - carWidth) {
            carX += carSpeed;
        }
    }
}

function drawCar() {
    ctx.fillStyle = "blue";
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

function generateObstacles() {
    if (frames % obstacleFrequency === 0) {
        const x = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x: x, y: -obstacleHeight });
    }
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function drawObstacles() {
    ctx.fillStyle = "red";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    }
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            carX < obstacles[i].x + obstacleWidth &&
            carX + carWidth > obstacles[i].x &&
            carY < obstacles[i].y + obstacleHeight &&
            carY + carHeight > obstacles[i].y
        ) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    gameRunning = false;
}

function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

function adjustSpeed() {
    obstacleSpeed = Number(speedRange.value);
    carWidth = initialCarWidth / obstacleSpeed; // Adjust car width
    carHeight = initialCarHeight / obstacleSpeed; // Adjust car height
    carX = Math.min(carX, canvas.width - carWidth); // Ensure car stays within canvas
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar();
    generateObstacles();
    moveObstacles();
    drawObstacles();
    score += obstacleSpeed / 10; // Increment score based on speed
    updateScore();

    if (checkCollision()) {
        gameOver();
        return;
    }

    frames++;
    if (gameRunning) {
        requestAnimationFrame(updateGame);
    }
}

function resetGame() {
    carWidth = initialCarWidth;
    carHeight = initialCarHeight;
    carX = (canvas.width - carWidth) / 2;
    obstacles = [];
    frames = 0;
    score = 0; // Reset score
    gameRunning = true;
    adjustSpeed(); // Reset speed and size
    updateGame();
}

updateGame();

document.getElementById('downloadButton').addEventListener('click', function() {
    var zip = new JSZip();
    zip.file("index.html", `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auto Spiel</title>
    <style>
        body {
            text-align: center;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
        }
        canvas {
            border: 2px solid #000;
            display: block;
            margin: 0 auto;
            background-color: #ffffff;
        }
        #resetButton {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #resetButton:hover {
            background-color: #45a049;
        }
        #gameContainer {
            display: inline-block;
            position: relative;
        }
        #scoreDisplay {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 20px;
            font-weight: bold;
            color: black;
        }
        #menu {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 14px;
            text-align: right;
        }
        #menu label, #menu input {
            display: block;
        }
        #instructions {
            font-size: 16px;
            margin-bottom: 20px;
            color: #333;
        }
        #downloadButton {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #008CBA;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #downloadButton:hover {
            background-color: #007BB5;
        }
    </style>
</head>
<body>
    <h1>Auto Spiel</h1>
    <div id="instructions">
        Verwende die Pfeiltasten links und rechts, um das Auto zu bewegen. 
        Vermeide die Hindernisse und sammle Punkte, indem du länger überlebst!
    </div>
    <div id="gameContainer">
        <div id="scoreDisplay">Score: 0</div>
        <div id="menu">
            <label for="speedRange">Geschwindigkeit:</label>
            <input type="range" id="speedRange" min="1" max="10" value="2">
        </div>
        <button id="resetButton">Reset</button>
        <canvas id="gameCanvas" width="300" height="400"></canvas>
    </div>
    <button id="downloadButton">Spiel herunterladen</button>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="game.js"></script>
</body>
</html>
`);
    zip.file("game.js", `const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
const speedRange = document.getElementById("speedRange");

const initialCarWidth = 40;
const initialCarHeight = 80;
let carWidth = initialCarWidth;
let carHeight = initialCarHeight;
let carX = (canvas.width - carWidth) / 2;
const carY = canvas.height - carHeight - 10;
const carSpeed = 5;

let obstacles = [];
const obstacleWidth = 40;
const obstacleHeight = 80;
let obstacleSpeed = Number(speedRange.value);
let obstacleFrequency = 100; // Frequency to generate obstacles

let frames = 0;
let gameRunning = true;
let score = 0;

document.addEventListener("keydown", moveCar);
document.getElementById("resetButton").addEventListener("click", resetGame);
speedRange.addEventListener("input", adjustSpeed);

function moveCar(e) {
    if (gameRunning) {
        if (e.key === "ArrowLeft" && carX > 0) {
            carX -= carSpeed;
        } else if (e.key === "ArrowRight" && carX < canvas.width - carWidth) {
            carX += carSpeed;
        }
    }
}

function drawCar() {
    ctx.fillStyle = "blue";
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

function generateObstacles() {
    if (frames % obstacleFrequency === 0) {
        const x = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x: x, y: -obstacleHeight });
    }
}

function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function drawObstacles() {
    ctx.fillStyle = "red";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    }
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            carX < obstacles[i].x + obstacleWidth &&
            carX + carWidth > obstacles[i].x &&
            carY < obstacles[i].y + obstacleHeight &&
            carY + carHeight > obstacles[i].y
        ) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    gameRunning = false;
}

function updateScore() {
    scoreDisplay.textContent = "Score: " + score;
}

function adjustSpeed() {
    obstacleSpeed = Number(speedRange.value);
    carWidth = initialCarWidth / obstacleSpeed; // Adjust car width
    carHeight = initialCarHeight / obstacleSpeed; // Adjust car height
    carX = Math.min(carX, canvas.width - carWidth); // Ensure car stays within canvas
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCar();
    generateObstacles();
    moveObstacles();
    drawObstacles();
    score += obstacleSpeed / 10; // Increment score based on speed
    updateScore();

    if (checkCollision()) {
        gameOver();
        return;
    }

    frames++;
    if (gameRunning) {
        requestAnimationFrame(updateGame);
    }
}

function resetGame() {
    carWidth = initialCarWidth;
    carHeight = initialCarHeight;
    carX = (canvas.width - carWidth) / 2;
    obstacles = [];
    frames = 0;
    score = 0; // Reset score
    gameRunning = true;
    adjustSpeed(); // Reset speed and size
    updateGame();
}

updateGame();
`);
    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "auto_spiel.zip");
    });
});
