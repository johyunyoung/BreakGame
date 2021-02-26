const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const leftField = document.querySelector(".leftField");
const rightField = document.querySelector(".rightField");

const isMobile = /Mobi/i.test(window.navigator.userAgent);

let x = canvas.width/2;
let y = canvas.height-30;
let dx = Math.random() + 2;
let dy = -Math.random() * 2 - 1;
const ballRadius = 10;
const paddleHeight = 10;
let paddleWidth = 175;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 4;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let stage = 1;

let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

let SPEED = 1;
let COLOR = "#0095DD";
let PADDLE_COLOR = "#0095DD";

function changePaddleColor(){
    PADDLE_COLOR = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
}

function changeBallColor(){
    COLOR = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    changePaddleColor();
                    score++;
                    if(score / stage == brickColumnCount * brickRowCount){
                        for(let c = 0; c < brickColumnCount; c++) {
                            bricks[c] = [];
                            for(let r = 0; r < brickRowCount; r++) {
                                bricks[c][r] = {
                                    x: 0,
                                    y: 0,
                                    status: 1
                                };
                            }
                        }
                        x = canvas.width/2;
                        y = canvas.height-30;
                        if(dy > 0) dy *= -1;
                        stage++;
                        paddleWidth -= 20
                        if(paddlewidth < 65) {
                            paddlewidth += paddlewidth;
                        }
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = PADDLE_COLOR;
                ctx.fill();
                ctx.closePath();                
            }
        }
    }
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
    ctx.fillStyle = PADDLE_COLOR;
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    x += dx * SPEED;
    y += dy * SPEED;

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        changeBallColor();
    }

    if(y + dy < ballRadius) {
        dy = -dy;
        changeBallColor();
    } else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            changeBallColor();
            if(SPEED < 2.25){
                SPEED += 0.05;
            }
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

if(isMobile) {
    canvas.style.width = "100%";
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
leftField.addEventListener("touchstart", handleLeftStart, false);
leftField.addEventListener("touchend", handleLeftEnd, false);

rightField.addEventListener("touchstart", handleRightStart, false);
rightField.addEventListener("touchend", handleRightEnd, false);


setInterval(draw, 10);