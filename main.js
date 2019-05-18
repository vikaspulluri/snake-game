const constants = {
	CANVAS_BORDER_COLOR: 'black',
	CANVAS_BACKGROUND_COLOR: 'white',
};

let dx = 0;
let dy = -8;
let score = 0;

const canvas = document.getElementById('snake-game');

const ctx = canvas.getContext('2d');

ctx.fillStyle = constants.CANVAS_BACKGROUND_COLOR;
ctx.strokestyle = constants.CANVAS_BORDER_COLOR;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeRect(0, 0, canvas.width, canvas.height);


let snake = [
	{x: 200, y: 200},
	{x: 192, y: 200},
	{x: 184, y: 200}
];


function drawSnakeSegment(part) {
	ctx.fillStyle = 'lightblue';
	ctx.strokestyle = 'darkblue';
	ctx.fillRect(part.x, part.y, 8, 8);
	ctx.strokeRect(part.x, part.y, 8, 8);
}

function drawSnake() {
	snake.forEach(drawSnakeSegment);
};
drawSnake();
function advanceSnake() {
	const head = {x: snake[0].x + dx, y: snake[0].y + dy};
	snake.unshift(head);
	const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
	if (didEatFood) {
		score += 10;
    	document.getElementById('score').innerHTML = score;
		createFood();
	} else {
		snake.pop();
	}
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}
createFood();
(function main() {
	if(didGameEnd()) { return;}
  setTimeout(function onTick() {
  	changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, 100)
})();

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  const keyPressed = event.keyCode;
  const goingUp = dy === -8;
  const goingDown = dy === 8;
  const goingRight = dx === 8;
  const goingLeft = dx === -8;
  if (changingDirection) return;
  changingDirection = true;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -8;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -8;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 8;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingDown) {
    dx = 0;
    dy = 8;
  }
}

document.addEventListener('keydown', changeDirection);

function randomEight(min, max) {
  return Math.round((Math.random() * (max-min) + min) / 10) * 8;
}

function createFood() {
  foodX = randomEight(0, canvas.width - 8);
  foodY = randomEight(0, canvas.height - 8);
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY
    if (foodIsOnSnake)
      createFood();
  });
}

function drawFood() {
 ctx.fillStyle = 'red';
 ctx.strokestyle = 'darkred';
 ctx.fillRect(foodX, foodY, 8, 8);
 ctx.strokeRect(foodX, foodY, 8, 8);
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    const didCollide = snake[i].x === snake[0].x &&
      snake[i].y === snake[0].y
    if (didCollide) return true
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 8;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 8;
  return hitLeftWall || 
         hitRightWall || 
         hitToptWall ||
         hitBottomWall;
}