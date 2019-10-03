let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeTop = new Image();
let pipeBottom = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeTop.src = "images/pipeNorth.png";
pipeBottom.src = "images/pipeSouth.png";

let gap = 200;
let pipeBottomOffset;

let bX = 10;
let bY = 150;

let gravity = 1.5;

let score = 0;

let flySound = new Audio();
let scoreSound = new Audio();

flySound.src = "sounds/fly.mp3";
scoreSound.src = "sounds/score.mp3";

document.addEventListener("keydown", moveUp);
document.addEventListener("keyup", moveUp);
document.addEventListener("click", moveUp);

function moveUp() {
    bY -= 25;
    flySound.play();
}

let pipe = [];

pipe[0] = {
    x : cvs.width,
    y : 0
};

let finishGame = false;

function drawFrame() {
    ctx.drawImage(bg,0,0);

    for (let i = 0; i < pipe.length; i++) {
        pipeBottomOffset = pipeTop.height + gap;
        ctx.drawImage(pipeTop, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeBottom, pipe[i].x,pipe[i].y + pipeBottomOffset);

        pipe[i].x--;

        if ( pipe[i].x === 125 ) {
            let randomPipePosition = Math.floor(Math.random()*pipeTop.height)-pipeTop.height;
            pipe.push({
                x : cvs.width,
                y : randomPipePosition
            });
        }

        let isBirdAfterPipeStart = bX + bird.width >= pipe[i].x;
        let isBirdBeforePipeEnd = bX <= pipe[i].x + pipeTop.width;
        let isBirdPassingPipe = isBirdAfterPipeStart && isBirdBeforePipeEnd;
        let isBirdTouchingFloor = bY + bird.height >= cvs.height - fg.height;
        let isBirdAtPipeTop = bY <= pipe[i].y + pipeTop.height;
        let isBirdAtPipeBottom = bY + bird.height >= pipe[i].y + pipeBottomOffset;
        let isBirdTouchingPipe = isBirdPassingPipe && ( isBirdAtPipeTop || isBirdAtPipeBottom);
        let birdHasCollision = isBirdTouchingPipe || isBirdTouchingFloor;

        if (birdHasCollision) {
            finishGame = true;
            location.reload();
        }

        let pipePassed = pipe[i].x === 5;
        if (pipePassed) {
            score++;
            scoreSound.play();
        }

        if (score === 10) {
            finishGame = true;
            drawBirthdayCard();
        }
    }

    ctx.drawImage(fg,0,cvs.height - fg.height);
    ctx.drawImage(bird, bX, bY);

    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px sans";
    ctx.fillText("Очки : "+score,10,cvs.height-20);

    if (!finishGame) {
        requestAnimationFrame(drawFrame);
    }
}

function drawBirthdayCard() {
    let title = "Дорогой друг!";
    let text = "Приходи ко мне на ДР";

    ctx.drawImage(bg,0,0);
    ctx.fillText("Победа!",10,30);
    ctx.fillText(title,10,70);
    ctx.fillText(text,10,100);
}

drawFrame();