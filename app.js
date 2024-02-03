// Fetch HTML Elements using DOM

const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Game Variables

const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right'
let gameInterval;
let gameSpeedDelay = 200;
gameStarted = false;



// Draw game map, Snake and Food

function draw(){
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw Snake 

function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
};

// Create a Snake or Food 

function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the Position of Snake or Food

function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}


function drawFood(){
    if(gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement); 
    }
}

// Generate Food
function generateFood() {
    const x = Math.floor((Math.random()) * gridSize) + 1;
    const y = Math.floor((Math.random()) * gridSize) + 1;
    return {x, y};
}

// Moving the Snake 

function move() {
    const head = {...snake[0]}; // Spread Operator Duplicates the snake array of Objects

    switch (direction) {
        case 'up':
                head.y--;
                break;
        case 'down':
                head.y++;
                break;
        case 'left':
                head.x--;
                break;
        case 'right':
                head.x++;
                break;
    }

    snake.unshift(head);


    if(head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear Past Interval
        gameInterval = setInterval(()=>{
            move();
            checkCollision(); 
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}


// Start Game Function 

function startGame(){
    gameStarted = true; // Keep track of Game Running or Not 
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress Event Listener 

function handleKeyPress(event) {
    if( 
        (!gameStarted && event.code === 'space') ||
        !gameStarted && event.key === ' '
    ) {
        startGame();
    } else {
        switch(event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break; 
    
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }  else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }  else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length -1;
    score.textContent = currentScore.toString().padStart(3, '0')
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length -1;
    if(currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}
