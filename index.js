const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const leftField = document.querySelector(".leftField");
const rightField = document.querySelector(".rightField");

let x = canvas.width/2;
let y = canvas.height-30;
let dx = -2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;

let SPEED = 1;
let COLOR = "#0095DD";

function changeColor(){
    COLOR = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
    console.log(ctx.fillStyle);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = COLOR;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    x += dx * SPEED;
    y += dy * SPEED;

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        changeColor();
    }

    if(y + dy < ballRadius) {
        dy = -dy;
        changeColor();
    } else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            changeColor();
            SPEED += 0.2;
            console.log(SPEED);
        } else {
            // alert("GAME OVER");
            document.location.reload();
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
}

function keyDownHandler(event) {
    if(event.keyCode === 39) {
        rightPressed = true;
    } else if(event.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(event) {
    if(event.keyCode === 39) {
        rightPressed = false;
    } else if(event.keyCode === 37) {
        leftPressed = false;
    }
}

function handleLeftStart() {
    leftPressed = true;
}

function handleLeftEnd() {
    leftPressed = false;
}

function handleRightStart() {
    rightPressed = true;
}

function handleRightEnd() {
    rightPressed = false;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
leftField.addEventListener("touchstart", handleLeftStart, false);
leftField.addEventListener("touchend", handleLeftEnd, false);

rightField.addEventListener("touchstart", handleRightStart, false);
rightField.addEventListener("touchend", handleRightEnd, false);

setInterval(draw, 10);