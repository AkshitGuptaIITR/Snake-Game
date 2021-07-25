let inputDir = { x: 0, y: 0 };

const foodSound = new Audio("../music/food.mp3");
const gameOverSound = new Audio("../music/gameover.mp3");
const moveSound = new Audio("../music/move.mp3");
const musicSound = new Audio("../music/music.mp3");

let score = 0;
let speed = 0;
let lastPaintTime = 0;
let snakeArr = [
    { x: 13, y: 15 }
];

//Random food generation

let c1 = 2;
let c2 = 16;
let food = { x: Math.round(c1 + (c2 - c1) * Math.random()), y: Math.round(c1 + (c2 - c1) * Math.random()) }

let highScore;
let highScoreVal = 0;

alert("Select The Difficulty Level!")

highScore = localStorage.getItem("highScore");

if (highScore === null) {
    highScoreVal = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreVal));
}
else {
    highScoreVal = JSON.parse(localStorage.getItem(highScore));
    document.getElementById("highScoreBox").innerHTML = "High-Score:" + highScoreVal;
}

function easy() {
    speed = 4;
    window.requestAnimationFrame(main)
    alert("Press any arrow key to begin!")
    musicSound.play()
}

function medium() {
    speed = 6;
    alert("Press any arrow key to begin!")
    musicSound.play()
    window.requestAnimationFrame(main)
}

function hard() {
    speed = 8;
    alert("Press any arrow key to begin!")
    window.requestAnimationFrame(main)
    musicSound.play()
}

function main(ctime) {

    window.requestAnimationFrame(main);

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(sarr) {

    //For Checking the snake collide with the body

    for (let i = 1; i < sarr.length; i++) {
        if (sarr[i].x === sarr[0].x && sarr[i].y === sarr[0].y) {
            return true;
        }
    }

    // For checking the snake collision with the walls

    if (sarr[0].x >= 18 || sarr[0].y >= 18 || sarr[0].x <= 0 || sarr[0].y <= 0) {
        return true;
    }
}

function gameEngine() {
    //Updating the Snake array and food variable;
    if (isCollide(snakeArr)) {
        score = 0;
        document.getElementById("scoreBox").innerHTML = "Score:" + score;
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        snakeArr = [{ x: 13, y: 13 }];
        if (confirm('Game Over! Do you want to restart the game?')) {
            food = { x: Math.round(c1 + (c2 - c1) * Math.random()), y: Math.round(c1 + (c2 - c1) * Math.random()) };
            inputDir = { x: 0, y: 0 };
            snakeArr = [{ x: 13, y: 13 }];
            musicSound.play();
        } else {
            musicSound.pause();
            inputDir = { x: 0, y: 0 }
            snakeArr = [{ x: 1, y: 1 }]
            food = { x: -1, y: -1 }
        }
    }

    //Logic for food

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > highScoreVal) {
            highScoreVal = score;
            localStorage.setItem("highScoreVal", JSON.stringify(highScoreVal));
            document.getElementById("highScoreBox").innerHTML = "High-Score:" + highScoreVal;
        }
        document.getElementById("scoreBox").innerHTML = "Score:" + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) }
    }

    //Moving the snake

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Displaying the Snake

    document.getElementById("board").innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        document.getElementById("board").appendChild(snakeElement);
    })

    // Display the food

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    document.getElementById("board").appendChild(foodElement);
}

//This will help to make the code reactive with the keys and play different sounds
// This will change direction of snake.

window.addEventListener('keydown', (e) => {
    // inputDir = { x: 0, y: 1 };
    switch (e.key) {
        case "ArrowUp":
            moveSound.play();
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            moveSound.play();
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowRight":
            moveSound.play();
            inputDir.x = 1;
            inputDir.y = 0;
            break;

        case "ArrowLeft":
            moveSound.play();
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
})