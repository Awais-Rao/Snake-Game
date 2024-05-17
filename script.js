const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervelId;
let score = 0;



// Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;



const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  // clearing the timer and reloading the page on gameOver
  clearInterval(setIntervelId);
  alert("Game Over! Press OK to reply.... ");
  location.reload();
};

const changeDirection = (e) => {
  //change velocity value based on keypressed
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach( key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key}))
}
)

const initGame = () => {
  if (gameOver) return handleGameOver();
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // checking if snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    // pushing food position into snake body array
    snakeBody.push([foodX, foodY]); 

    //incrementing score by 1
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);

    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;

  }
  // it is changing the s co-ordinates of snake body elements according to their sequence like for 2nd element it put it 2-1 means 1 co-ordinate behind the head and so on.
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY]; //setting forst element of snake bosy to fcurrent snake position
  
  // update snake head based on current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // Adding a div for each part of snake's body
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // checking if head hit the snake body so game is over!
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervelId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);
