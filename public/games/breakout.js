const boCanvas = document.getElementById('breakout')
const boContext = boCanvas.getContext('2d');
let widthBo = 500;
let heightBo = 500;
let numOfEnemiesBo, enemyListBo, scoreBo, intervalVarBo, runningBo, hitCountBo;

let gestureControlBo = false;
let breakoutControlSelection = document.getElementById('breakoutControlSelection');
function switchToGestureBo(btn) {
    btn.classList.toggle("fa-toggle-on");
    btn.classList.toggle("fa-toggle-off");
    let loader = document.getElementById('gestureLoaderBreakout');
    if (gestureControlBo) {
        breakoutControlSelection.textContent = "Turn ON gesture control ";
        breakoutControlSelection.appendChild(btn);
        gestureControlBo = false;
        document.getElementById('breakout').removeEventListener("mousedown", clickHandlerBo);
        loader.style.display = "block";
        boContext.clearRect(0, 0, boCanvas.width, boCanvas.height);
        boContext.textAlign = "center";
        boContext.fillText("Loading...", boCanvas.width/2, boCanvas.height/2);
        document.getElementById('webcam-container').style.display = "none";
        destroyGestureBo()
            .then(() => {
                loader.style.display = "none";
                boContext.clearRect(0, 0, boCanvas.width, boCanvas.height);
                initGameBo();
            });
    }
    else {
        breakoutControlSelection.textContent = "Turn OFF gesture control ";
        breakoutControlSelection.appendChild(btn);
        gestureControlBo = true;
        document.getElementById('breakout').removeEventListener("mousedown", clickHandlerBo);
        loader.style.display = "block";
        boContext.clearRect(0, 0, boCanvas.width, boCanvas.height);
        boContext.textAlign = "center";
        boContext.fillText("Loading...", boCanvas.width/2, boCanvas.height/2);
        document.getElementById('webcam-container').style.display = "block";
        initGestureBo()
            .then(() => {
                loader.style.display = "none";
                boContext.clearRect(0, 0, boCanvas.width, boCanvas.height);
                initGameBo();
                document.removeEventListener("keydown", keydownHandlerBo);
                document.removeEventListener("keyup", keyupHandlerBo);
            });
    }
}

function clickHandlerBo() {
    if (runningBo) {
        clearInterval(intervalVarBo);
    }
    startGameBo();
}

function keydownHandlerBo(event) {
    if (event.code === 37 || event.keyIdentifier === 37 || event.keyCode == 37) {
        baseBo.pressingLeft = true;
        baseBo.pressingRight = false;
    }
    else if (event.code === 39 || event.keyIdentifier === 39 || event.keyCode == 39) {
        baseBo.pressingLeft = false;
        baseBo.pressingRight = true;
    }
}

function keyupHandlerBo(event) {
    if (event.code === 37 || event.keyIdentifier === 37 || event.keyCode == 37) {
        baseBo.pressingLeft = false;
    }
    else if (event.code === 39 || event.keyIdentifier === 39 || event.keyCode == 39) {
        baseBo.pressingRight = false;
    }
}

let ballBo, baseBo, enemyBo;
function initGameBo() {
    boContext.font = '1.25em Calibri';
    boContext.fillStyle = "#ffffff";
    boContext.textAlign = "center";
    boContext.fillText("Click anywhere in the box to start the game", boCanvas.width / 2, boCanvas.height / 2);

    ballBo = {
        x: 0,
        y: 0,
        radius: 5,
        color: '#6ec5ff',
        spdX: -3,
        spdY: -3
    };

    baseBo = {
        x: 0,
        y: 400,
        height: 20,
        width: 100,
        color: '#d6435c',
        pressingLeft: false,
        pressingRight: false,
        lives: 3
    };

    enemyBo = {
        height: 20,
        width: 40,
        color: 'orange'
    };

    runningBo = false;
    document.getElementById('breakout').addEventListener("mousedown", clickHandlerBo);
    document.addEventListener("keydown", keydownHandlerBo);
    document.addEventListener("keyup", keyupHandlerBo);
}

testCollisionBo = function (baseBo, ballBo) {
    return ((baseBo.x < ballBo.x + ballBo.radius) &&
        (ballBo.x < baseBo.x + baseBo.width) &&
        (baseBo.y < ballBo.y + ballBo.radius) &&
        (ballBo.y < baseBo.y + baseBo.height));
}

testCollisionEnemyBo = function (e, ballBo) {
    return ((e.x < ballBo.x + ballBo.radius) &&
        (ballBo.x < e.x + enemyBo.width) &&
        (e.y < ballBo.y + ballBo.radius) &&
        (ballBo.y < e.y + enemyBo.height));
}

drawBallBo = function () {
    boContext.save();
    boContext.fillStyle = ballBo.color;
    boContext.beginPath();
    boContext.arc(ballBo.x, ballBo.y, ballBo.radius, 0, 2 * Math.PI);
    boContext.fill();
    boContext.restore();
}

drawBaseBo = function () {
    boContext.save();
    boContext.fillStyle = baseBo.color;
    boContext.fillRect(baseBo.x, baseBo.y, baseBo.width, baseBo.height);
    boContext.restore();
}

drawEnemyBo = function (e, i) {
    boContext.save();
    boContext.fillStyle = enemyBo.color;
    boContext.fillRect(e.x, e.y, enemyBo.width, enemyBo.height);
    boContext.restore();
}

updateBarPositionBo = function () {
    if (baseBo.pressingLeft) {
        baseBo.x = baseBo.x - 5;
    }
    else if (baseBo.pressingRight) {
        baseBo.x = baseBo.x + 5;
    }
    if (baseBo.x < 0) {
        baseBo.x = 0;
    }
    if (baseBo.x > widthBo - baseBo.width) {
        baseBo.x = widthBo - baseBo.width;
    }
}

updateBallPositionBo = function () {
    ballBo.x += ballBo.spdX;
    ballBo.y += ballBo.spdY;
    if (ballBo.x > widthBo || ballBo.x < 0) {
        hitCountBo++;
        if (hitCountBo % 20 == 0) {
            if (ballBo.spdX < 0)
                ballBo.spdX = -(Math.abs(ballBo.spdX) + 1);
            else
                ballBo.spdX += 1;
        }
        ballBo.spdX = -ballBo.spdX;
    }
    if (ballBo.y < 0) {
        hitCountBo++;
        if (hitCountBo % 20 == 0) {
            if (ballBo.spdY < 0)
                ballBo.spdY = -(Math.abs(ballBo.spdY) + 1);
            else
                ballBo.spdY += 1;
        }
        ballBo.spdY = -ballBo.spdY;
    }
    if (ballBo.y > heightBo) {
        hitCountBo++;
        if (hitCountBo % 20 == 0) {
            if (ballBo.spdY < 0)
                ballBo.spdY = -(Math.abs(ballBo.spdY) + 1);
            else
                ballBo.spdY += 1;
        }
        ballBo.spdY = -ballBo.spdY;
        baseBo.lives--;
    }
}

isGameOverBo = function () {
    if (baseBo.lives <= 0) {
        breakoutControlSelection.style.display = "block";
        clearInterval(intervalVarBo);
        runningBo = false;
        boContext.textAlign = "center";
        boContext.fillText('Game Over! Click to restart', boCanvas.width / 2, boCanvas.height / 2);
    }
    else if (scoreBo == 330) {
        breakoutControlSelection.style.display = "block";
        clearInterval(intervalVarBo);
        runningBo = false;
        boContext.textAlign = "center";
        boContext.fillText('You Won!!\nClick to play again!', boCanvas.width / 2, boCanvas.height / 2);
    }
}

updateBo = function () {
    boContext.clearRect(0, 0, widthBo, heightBo);
    enemyListBo.forEach(drawEnemyBo);
    drawBallBo();
    drawBaseBo();

    if (testCollisionBo(baseBo, ballBo)) {
        ballBo.spdY = -ballBo.spdY;
    }

    for (key in enemyListBo) {
        if (testCollisionEnemyBo(enemyListBo[key], ballBo)) {
            delete enemyListBo[key];
            ballBo.spdY = -ballBo.spdY;
            scoreBo += 5;
        }
    }

    boContext.textAlign = "left";
    boContext.fillText("Score: " + scoreBo, 10, 490);
    boContext.textAlign = "right";
    boContext.fillText("Lives: " + baseBo.lives, 490, 490);
    isGameOverBo();
    updateBarPositionBo();
    updateBallPositionBo();
}

startGameBo = function () {
    breakoutControlSelection.style.display = "none";
    baseBo.x = 200;
    ballBo.x = baseBo.x + 45;
    ballBo.y = baseBo.y - 5;
    numOfEnemiesBo = 0;
    let enemyX = 5;
    let enemyY = 5;
    scoreBo = 0;
    baseBo.lives = 3;
    enemyListBo = []; //5+40 = 45
    runningBo = true;
    hitCountBo = 0;
    ballBo.spdX = -3;
    ballBo.spdY = -3;
    for (let i = 1; i <= 6; i++) {
        enemyX = 5;
        for (let j = 1; j <= 11; j++) {
            enemyListBo[numOfEnemiesBo] = { x: enemyX, y: enemyY };
            numOfEnemiesBo++;
            enemyX += 45;
        }
        enemyY += 25;
    }
    intervalVarBo = setInterval(updateBo, 10);
}

function stopGameBo() {
    if (runningBo) {
        clearInterval(intervalVarBo);
        runningBo = false;
    }
    breakoutControlSelection.style.display = "block";
    boContext.clearRect(0, 0, boCanvas.width, boCanvas.height);
    document.getElementById('breakout').removeEventListener("mousedown", clickHandlerBo);
    document.removeEventListener("keydown", keydownHandlerBo);
    document.removeEventListener("keyup", keyupHandlerBo);
}

// const URL_BREAKOUT = "https://teachablemachine.withgoogle.com/models/IYkVLncj7/";
const URL_BREAKOUT = "https://teachablemachine.withgoogle.com/models/W2Mslt6GM/";
let modelBo, webcamBo, labelContainerBo, maxPredictionsBo, requestIdBo;

// Load the image model and setup the webcam
async function initGestureBo() {
    const modelURL = URL_BREAKOUT + "model.json";
    const metadataURL = URL_BREAKOUT + "metadata.json";

    modelBo = await tmImage.load(modelURL, metadataURL);
    maxPredictionsBo = modelBo.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcamBo = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcamBo.setup(); // request access to the webcam
    await webcamBo.play();
    document.getElementById("webcam-container").appendChild(webcamBo.canvas);
    window.requestAnimationFrame(loopBo);

    if (!requestIdBo) {
        requestIdBo = window.requestAnimationFrame(loopBo);
    }
}

async function destroyGestureBo() {
    await webcamBo.stop();
    if (requestIdBo) {
        window.cancelAnimationFrame(requestIdBo);
        requestIdBo = undefined;
        modelBo = undefined;
        maxPredictionsBo = undefined;
        webcamBo = undefined
    }
}

async function loopBo() {
    webcamBo.update(); // update the webcam frame
    await predictBo();
    if (requestIdBo)
        requestIdBo = window.requestAnimationFrame(loopBo);
}

// run the webcam image through the image model
async function predictBo() {
    // predict can take in an image, video or canvas html element
    const prediction = await modelBo.predict(webcamBo.canvas);
    for (let i = 0; i < maxPredictionsBo; i++) {
        if (prediction[i].probability > 0.95) {
            switch (prediction[i].className) {
                case "left":
                    baseBo.pressingLeft = true;
                    baseBo.pressingRight = false;
                    break;
                case "right":
                    baseBo.pressingLeft = false;
                    baseBo.pressingRight = true;
                    break;
                case "idle":
                    baseBo.pressingLeft = false;
                    baseBo.pressingRight = false;
                    break;
                default:
                    break;
            }
        }
    }
}