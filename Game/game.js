const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const finish = document.getElementById("finish");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const lapText = document.getElementById("lap");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");

const finalTime = document.getElementById("finalTime");
const finalScore = document.getElementById("finalScore");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const gasButton = document.getElementById("gasButton");
const brakeButton = document.getElementById("brakeButton");


/* =========================
   CANVAS
========================= */

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =========================
   GAME STATE
========================= */

let gameRunning = false;

let startTime = 0;

let elapsedTime = 0;

let score = 0;

let currentLap = 1;

const totalLaps = 3;


/* =========================
   CONTROLS
========================= */

let leftPressed = false;
let rightPressed = false;
let gasPressed = false;
let brakePressed = false;


/* =========================
   CAR
========================= */

const car = {
    x: 0,
    y: 0,

    width: 42,
    height: 70,

    speed: 0,

    maxSpeed: 10,

    acceleration: 0.18,

    braking: 0.30,

    friction: 0.05,

    steering: 5
};


/* =========================
   ROAD
========================= */

let roadOffset = 0;


/* =========================
   RESET GAME
========================= */

function resetGame() {

    car.x = canvas.width / 2;

    car.y = canvas.height - 130;

    car.speed = 0;

    roadOffset = 0;

    score = 0;

    currentLap = 1;

    elapsedTime = 0;

    lapText.textContent =
        "1/" + totalLaps;

    timerText.textContent =
        "0.0";

    scoreText.textContent =
        "0";
}


/* =========================
   START GAME
========================= */

function startGame() {

    resetGame();

    menu.style.display = "none";

    finish.style.display = "none";

    gameRunning = true;

    startTime = performance.now();

    requestAnimationFrame(gameLoop);
}


/* =========================
   FINISH GAME
========================= */

function finishGame() {

    gameRunning = false;

    finalTime.textContent =
        elapsedTime.toFixed(1);

    finalScore.textContent =
        score;

    finish.style.display = "flex";
}


/* =========================
   UPDATE GAME
========================= */

function updateGame() {

    /* ACCELERATION */

    if (gasPressed) {

        car.speed +=
            car.acceleration;
    }


    /* BRAKING */

    if (brakePressed) {

        car.speed -=
            car.braking;
    }


    /* FRICTION */

    if (!gasPressed && !brakePressed) {

        car.speed -=
            car.friction;
    }


    /* SPEED LIMIT */

    car.speed = Math.max(
        0,
        Math.min(
            car.speed,
            car.maxSpeed
        )
    );


    /* STEERING */

    if (leftPressed) {

        car.x -=
            car.steering *
            (car.speed / car.maxSpeed + 0.3);
    }

    if (rightPressed) {

        car.x +=
            car.steering *
            (car.speed / car.maxSpeed + 0.3);
    }


    /* ROAD SIZE */

    const roadWidth =
        Math.min(
            canvas.width * 0.65,
            500
        );

    const roadLeft =
        canvas.width / 2 -
        roadWidth / 2;

    const roadRight =
        canvas.width / 2 +
        roadWidth / 2;


    /* ROAD LIMIT */

    if (
        car.x <
        roadLeft + car.width / 2
    ) {

        car.x =
            roadLeft + car.width / 2;
    }


    if (
        car.x >
        roadRight - car.width / 2
    ) {

        car.x =
            roadRight - car.width / 2;
    }


    /* ROAD MOVEMENT */

    roadOffset += car.speed;


    if (roadOffset >= 80) {

        roadOffset = 0;

        score++;

        scoreText.textContent =
            score;
    }


    /* TIMER */

    elapsedTime =
        (performance.now() -
        startTime) / 1000;

    timerText.textContent =
        elapsedTime.toFixed(1);


    /* SIMPLE LAP SYSTEM */

    const calculatedLap =
        Math.floor(
            elapsedTime / 10
        ) + 1;


    if (
        calculatedLap >
        currentLap
    ) {

        currentLap =
            calculatedLap;

        if (
            currentLap <= totalLaps
        ) {

            lapText.textContent =
                currentLap +
                "/" +
                totalLaps;
        }


        if (
            currentLap >
            totalLaps
        ) {

            finishGame();
        }
    }
}


/* =========================
   DRAW ROAD
========================= */

function drawRoad() {

    const width =
        canvas.width;

    const height =
        canvas.height;


    /* ROAD WIDTH */

    const roadWidth =
        Math.min(
            width * 0.65,
            500
        );


    const roadLeft =
        width / 2 -
        roadWidth / 2;


    /* GRASS */

    ctx.fillStyle =
        "#3d8b35";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* ROAD */

    ctx.fillStyle =
        "#333333";

    ctx.fillRect(
        roadLeft,
        0,
        roadWidth,
        height
    );


    /* ROAD EDGES */

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        roadLeft,
        0,
        7,
        height
    );

    ctx.fillRect(
        roadLeft +
        roadWidth -
        7,
        0,
        7,
        height
    );


    /* CENTER ROAD MARKINGS */

    ctx.fillStyle =
        "#ffd928";


    for (
        let y = -80 + roadOffset;
        y < height;
        y += 80
    ) {

        ctx.fillRect(
            width / 2 - 4,
            y,
            8,
            45
        );
    }
}


/* =========================
   DRAW CAR
========================= */

function drawCar() {

    const x =
        car.x -
        car.width / 2;

    const y =
        car.y;


    /* SHADOW */

    ctx.fillStyle =
        "rgba(0,0,0,0.4)";

    ctx.fillRect(
        x + 4,
        y + 5,
        car.width,
        car.height
    );


    /* CAR BODY */

    ctx.fillStyle =
        "#e21b23";

    ctx.fillRect(
        x,
        y,
        car.width,
        car.height
    );


    /* FRONT WINDOW */

    ctx.fillStyle =
        "#9de7ff";

    ctx.fillRect(
        x + 7,
        y + 10,
        car.width - 14,
        18
    );


    /* REAR WINDOW */

    ctx.fillRect(
        x + 7,
        y + 36,
        car.width - 14,
        15
    );


    /* WHEELS */

    ctx.fillStyle =
        "#111111";


    ctx.fillRect(
        x - 5,
        y + 10,
        6,
        18
    );

    ctx.fillRect(
        x + car.width - 1,
        y + 10,
        6,
        18
    );


    ctx.fillRect(
        x - 5,
        y + 45,
        6,
        18
    );

    ctx.fillRect(
        x + car.width - 1,
        y + 45,
        6,
        18
    );
}


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    updateGame();

    drawRoad();

    drawCar();


    requestAnimationFrame(
        gameLoop
    );
}


/* =========================
   TOUCH BUTTON SYSTEM
========================= */

function setupHoldButton(
    button,
    setter
) {

    button.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();

            setter(true);
        }
    );


    button.addEventListener(
        "pointerup",
        event => {

            event.preventDefault();

            setter(false);
        }
    );


    button.addEventListener(
        "pointercancel",
        event => {

            event.preventDefault();

            setter(false);
        }
    );


    button.addEventListener(
        "pointerleave",
        event => {

            event.preventDefault();

            setter(false);
        }
    );
}


/* =========================
   TOUCH CONTROLS
========================= */

setupHoldButton(
    leftButton,
    value => {
        leftPressed = value;
    }
);


setupHoldButton(
    rightButton,
    value => {
        rightPressed = value;
    }
);


setupHoldButton(
    gasButton,
    value => {
        gasPressed = value;
    }
);


setupHoldButton(
    brakeButton,
    value => {
        brakePressed = value;
    }
);


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowLeft"
        ) {
            leftPressed = true;
        }


        if (
            event.key === "ArrowRight"
        ) {
            rightPressed = true;
        }


        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {
            gasPressed = true;
        }


        if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {
            brakePressed = true;
        }
    }
);


document.addEventListener(
    "keyup",
    event => {

        if (
            event.key === "ArrowLeft"
        ) {
            leftPressed = false;
        }


        if (
            event.key === "ArrowRight"
        ) {
            rightPressed = false;
        }


        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "w"
        ) {
            gasPressed = false;
        }


        if (
            event.key === "ArrowDown" ||
            event.key.toLowerCase() === "s"
        ) {
            brakePressed = false;
        }
    }
);


/* =========================
   START / RESTART
========================= */

startButton.addEventListener(
    "click",
    startGame
);


restartButton.addEventListener(
    "click",
    startGame
);


/* =========================
   INITIALIZE
========================= */

resetGame();
