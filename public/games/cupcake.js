let ccCanvas = document.getElementById('cupcake');
let ccContext = ccCanvas.getContext('2d');

let catcherOne, catcherTwo, catcherThree, catcherFour, background, blood, tile, food, fruit;
let eatingSound, droppingSound;

// Global Variables
let score, level, animation, foodTimer, fruitTimer, gameover, intervalVarCc, paused, foodList, tileList, fruitList, foodDrop;
let tileObject, catcher, foodObject, fruitObject;

let gestureControlCc = false;
let cupcakeControlSelection = document.getElementById('cupcakeControlSelection');
function switchToGestureCc(btn) {
    btn.classList.toggle("fa-toggle-on");
    btn.classList.toggle("fa-toggle-off");
    let loader = document.getElementById('gestureLoaderCupcake');
    if (gestureControlCc) {
        cupcakeControlSelection.textContent = "Turn ON voice control ";
        cupcakeControlSelection.appendChild(btn);
        gestureControlCc = false;
        document.getElementById('cupcake').removeEventListener("mousedown", clickHandlerCc);
        loader.style.display = "block";
        ccContext.clearRect(0, 0, ccCanvas.width, ccCanvas.height);
        ccContext.strokeStyle = "#FFFFFF";
        ccContext.textAlign = "center";
        ccContext.strokeText("Loading...", ccCanvas.width / 2, ccCanvas.height / 2);
        destroyGestureCc() // here
            .then(() => {
                loader.style.display = "none";
                ccContext.clearRect(0, 0, ccCanvas.width, ccCanvas.height);
                initGameCc();
            });
    }
    else {
        cupcakeControlSelection.textContent = "Turn OFF voice control ";
        cupcakeControlSelection.appendChild(btn);
        gestureControlCc = true;
        document.getElementById('cupcake').removeEventListener("mousedown", clickHandlerCc);
        loader.style.display = "block";
        ccContext.clearRect(0, 0, ccCanvas.width, ccCanvas.height);
        ccContext.strokeStyle = "#FFFFFF";
        ccContext.textAlign = "center";
        ccContext.strokeText("Loading...", ccCanvas.width / 2, ccCanvas.height / 2);
        initGestureCc() // here
            .then(() => {
                loader.style.display = "none";
                ccContext.clearRect(0, 0, ccCanvas.width, ccCanvas.height);
                initGameCc();
                document.removeEventListener("keydown", keydownHandlerCc);
                document.removeEventListener("keyup", keyupHandlerCc);
            });
    }
}

function initGameCc() {
    catcherOne = new Image();
    catcherTwo = new Image();
    catcherThree = new Image();
    catcherFour = new Image();
    background = new Image();
    blood = new Image();
    tile = new Image();
    food = new Image();
    fruit = new Image();

    score = 0;
    level = 100;
    animation = 0;
    foodTimer = 0;
    fruitTimer = 0;
    gameover = false;
    foodList = [];
    tileList = [];
    fruitList = [];
    foodDrop = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];

    tileObject = {
        'height': 20,
        'width': 50
    };

    catcher = {
        'x': 100,
        'y': 350,
        'width': 30,
        'height': 50,
        'jump': 0, // How many pixels will it go up?
        'onair': false, // Whether the catcher is already in the air
        'jumpUnit': 5, // Go up or down per frame
        'spd': 0,
        'leftPressed': false,
        'rightPressed': false,
        'gravity': 10,
        'safe': true
    };

    foodObject = {
        'height': 50,
        'width': 50,
        'spd': 3
    };

    fruitObject = {
        'height': 40,
        'width': 40,
        'spd': 3
    };

    eatingSound = new sound("assets/sound/cupcake/eat.mp3");
    droppingSound = new sound("assets/sound/cupcake/drop.mp3");

    document.getElementById('cupcake').addEventListener("mousedown", clickHandlerCc);
    document.addEventListener("keydown", keydownHandlerCc);
    document.addEventListener("keyup", keyupHandlerCc);

    background.onload = function () {
        blood.onload = function () {
            catcherOne.onload = function () {
                catcherTwo.onload = function () {
                    catcherThree.onload = function () {
                        catcherFour.onload = function () {
                            food.onload = function () {
                                tile.onload = function () {
                                    fruit.onload = function () {

                                        ccContext.drawImage(background, 0, 0, 500, 500);
                                        ccContext.strokeStyle = "#FFFFFF";
                                        ccContext.font = "30px Calibri";
                                        ccContext.textAlign = "center";
                                        ccContext.strokeText("Click here to start the game", ccCanvas.width / 2, ccCanvas.height / 2);

                                        drawObject = function (object, x, y, width, height) {
                                            ccContext.drawImage(object, x, y, width, height);
                                        }

                                        food_catcher_collision = function (f) {
                                            return ((f.x < catcher.x + catcher.width) &&
                                                (catcher.x < f.x + foodObject.width) &&
                                                (f.y < catcher.y + catcher.height) &&
                                                (catcher.y < f.y + foodObject.height));
                                        }

                                        food_tile_collision = function (f, t) {
                                            return ((f.x < t.x + tileObject.width) &&
                                                (t.x < f.x + foodObject.width) &&
                                                (f.y < t.y + tileObject.height) &&
                                                (t.y < f.y + foodObject.height));
                                        }

                                        fruit_catcher_collision = function (f) {
                                            return ((f.x < catcher.x + catcher.width) &&
                                                (catcher.x < f.x + fruitObject.width) &&
                                                (f.y < catcher.y + catcher.height) &&
                                                (catcher.y < f.y + fruitObject.height));
                                        }

                                        catcher_tile_collision = function (t) {
                                            return ((catcher.x <= t.x + tileObject.width) &&
                                                (t.x <= catcher.x + catcher.width) &&
                                                (catcher.y + catcher.height <= t.y));
                                        }


                                        jump = function () {
                                            // Moving up
                                            if (catcher.jump > 0 && catcher.onair) {
                                                catcher.y -= catcher.jumpUnit;
                                                catcher.jump -= catcher.jumpUnit;
                                            }
                                            if (catcher.jump <= 0 && catcher.jump > -100 && catcher.onair) {
                                                catcher.y += catcher.jumpUnit;
                                                catcher.jump -= catcher.jumpUnit;
                                            }
                                            if (catcher.jump <= -100 && catcher.onair) {
                                                catcher.onair = false;
                                            }
                                        }

                                        updateFoodPosition = function () {
                                            for (let i in foodList) {
                                                if (foodList[i].y > 500) {
                                                    foodList.splice(i, 1);
                                                }
                                                else {
                                                    foodList[i].y += foodObject.spd;
                                                }
                                            }
                                        }

                                        updateFruitPosition = function () {
                                            for (let i in fruitList) {
                                                if (fruitList[i].y > 500) {
                                                    fruitList.splice(i, 1);
                                                }
                                                else {
                                                    fruitList[i].y += fruitObject.spd;
                                                }
                                            }
                                        }

                                        updateCatcherPosition = function () {
                                            if (catcher.leftPressed && catcher.x > 0) {
                                                catcher.x += catcher.spd;
                                            }
                                            if (catcher.rightPressed && catcher.x < 500 - catcher.width) {
                                                catcher.x += catcher.spd;
                                            }
                                            if (catcher.y > 450) {
                                                gameover = true;
                                                catcher.y = 450;
                                                droppingSound.play();
                                            }
                                        }

                                        gameOver = function () {
                                            cupcakeControlSelection.style.display = "block";
                                            ccContext.save();
                                            ccContext.globalAlpha = 0.6;
                                            drawObject(blood, 100, 100, 300, 300);
                                            ccContext.globalAlpha = 1.0;
                                            ccContext.strokeStyle = "#FFFFFF";
                                            ccContext.font = "30px Calibri"
                                            ccContext.strokeText("Game Over", ccCanvas.width / 2, (ccCanvas.height / 2) - 20);
                                            ccContext.strokeText("Click to restart", ccCanvas.width / 2, (ccCanvas.height / 2) + 20);
                                            ccContext.restore();
                                            clearInterval(intervalVarCc);
                                        }

                                        updatePosition = function () {
                                            if (!paused) {
                                                ccContext.clearRect(0, 0, 500, 500);
                                                ccContext.drawImage(background, 0, 0, 500, 500);
                                                foodTimer++;
                                                fruitTimer++;

                                                if (foodTimer > level) {
                                                    foodList.push({ 'x': foodDrop[Math.round(Math.random() * 9)], 'y': 0 });
                                                    foodTimer = 0;
                                                }

                                                if (fruitTimer > 3 * level) {
                                                    fruitList.push({ 'x': foodDrop[Math.round(Math.random() * 9)], 'y': -25 });
                                                    fruitTimer = 0;
                                                }

                                                for (let i in fruitList) {
                                                    if (fruit_catcher_collision(fruitList[i])) {
                                                        droppingSound.play();
                                                        gameover = true;
                                                    }
                                                }

                                                if (gameover) {
                                                    if (catcher.y >= 450)
                                                        drawObject(catcherThree, catcher.x, catcher.y + 20, 50, 30);
                                                    else
                                                        drawObject(catcherOne, catcher.x, catcher.y, 30, 50);
                                                    gameOver();
                                                }

                                                else if (catcher.onair) {
                                                    drawObject(catcherFour, catcher.x, catcher.y, catcher.width, catcher.height);
                                                }
                                                else if (animation == 0) {
                                                    drawObject(catcherOne, catcher.x, catcher.y, catcher.width, catcher.height);
                                                    animation = 1;
                                                }
                                                else if (animation == 1) {
                                                    drawObject(catcherTwo, catcher.x, catcher.y, catcher.width, catcher.height);
                                                    animation = 0;
                                                }

                                                for (let i in foodList) {
                                                    drawObject(food, foodList[i].x, foodList[i].y, foodObject.width, foodObject.height);
                                                }

                                                for (let i = 0; i < tileList.length; i++) {
                                                    drawObject(tile, tileList[i].x, tileList[i].y, tileObject.width, tileObject.height);
                                                }

                                                for (let i in fruitList) {
                                                    drawObject(fruit, fruitList[i].x, fruitList[i].y, fruitObject.width, fruitObject.height);
                                                }

                                                for (let i in foodList) {
                                                    if (food_catcher_collision(foodList[i])) {
                                                        score++;
                                                        eatingSound.play();
                                                        if (score % 2 == 0)
                                                            level--;
                                                        foodList.splice(i, 1);
                                                    }
                                                }
                                                for (let i in foodList) {
                                                    for (let j in tileList) {
                                                        if (food_tile_collision(foodList[i], tileList[j])) {
                                                            tileList.splice(j, 1);
                                                        }
                                                    }
                                                }

                                                if (!catcher.onair) {
                                                    for (let i in tileList) {
                                                        if (catcher_tile_collision(tileList[i])) {
                                                            catcher.safe = true;
                                                            break;
                                                        }
                                                        catcher.safe = false;
                                                    }
                                                    if (!catcher.safe) {
                                                        catcher.y += catcher.gravity;
                                                    }
                                                }

                                                drawObject(food, 440, 10, 20, 20);
                                                ccContext.fillStyle = "#FFFFFF";
                                                ccContext.font = "20px Calibri";
                                                ccContext.fillText(score, 470, 27);
                                                ccContext.fillText("Level " + (100 - level + 1), 40, 27);
                                                updateFruitPosition();
                                                updateFoodPosition();
                                                updateCatcherPosition();
                                                jump();
                                            }
                                            else {
                                                ccContext.save();
                                                ccContext.strokeStyle = "#FFFFFF";
                                                ccContext.font = "30px Calibri"
                                                ccContext.strokeText("Game Paused", ccCanvas.width / 2, ccCanvas.height / 2);
                                                ccContext.restore();
                                            }
                                        }

                                        startGame = function () {
                                            cupcakeControlSelection.style.display = "none";

                                            score = 0;
                                            level = 100;
                                            catcher.y = 350;
                                            catcher.x = 100;
                                            catcher.onair = false;
                                            catcher.leftPressed = false;
                                            catcher.rightPressed = false;
                                            catcher.safe = true;
                                            animation = 0;
                                            foodTimer = 0;
                                            paused = false;
                                            gameover = false;
                                            tileList = [];
                                            foodList = [];
                                            fruitList = [];

                                            for (let i = 0; i <= 9; i++) {
                                                tileList.push({ 'x': i * 50, 'y': 400 });
                                            }

                                            intervalVarCc = setInterval(updatePosition, 10); // 100 fps game
                                        }
                                    }
                                    fruit.src = "assets/img/cupcake/fruit.png";
                                }
                                tile.src = "assets/img/cupcake/tile.png";
                            }
                            food.src = "assets/img/cupcake/food.png";
                        }
                        catcherFour.src = "assets/img/cupcake/catcher4.png";
                    }
                    catcherThree.src = "assets/img/cupcake/catcher3.png";
                }
                catcherTwo.src = "assets/img/cupcake/catcher2.png";
            }
            catcherOne.src = "assets/img/cupcake/catcher1.png";
        }
        blood.src = "assets/img/cupcake/blood.png";
    }
    background.src = "assets/img/cupcake/b8.png";
}

sound = function (src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function clickHandlerCc() {
    if (!gameover) {
        clearInterval(intervalVarCc);
    }
    startGame();
}

function keydownHandlerCc(event) {
    if ((event.code === 37 || event.keyIdentifier === 37 || event.keyCode == 37) && catcher.x > 0) {
        catcher.spd = -5;
        catcher.leftPressed = true;
    }
    if ((event.code === 39 || event.keyIdentifier === 39 || event.keyCode == 39) && catcher.x < 500 - catcher.width) {
        catcher.spd = 5;
        catcher.rightPressed = true;
    }
    if ((event.code === 38 || event.keyIdentifier === 38 || event.keyCode == 38) && !catcher.onair && catcher.y == 350) {
        if (!catcher.onair) {
            catcher.jump = 100;
            catcher.onair = true;
        }
    }
    if (event.code === 32 || event.keyIdentifier === 32 || event.keyCode == 32) {
        if (paused)
            paused = false;
        else
            paused = true;
    }
}

function keyupHandlerCc(event) {
    if (event.code === 37 || event.keyIdentifier === 37 || event.keyCode == 37) {
        catcher.leftPressed = false;
    }
    if (event.code === 39 || event.keyIdentifier === 39 || event.keyCode == 39) {
        catcher.rightPressed = false;
    }
}

function stopGameCc() {
    if (!paused) {
        clearInterval(intervalVarCc);
        paused = true;
    }
    cupcakeControlSelection.style.display = "block";
    ccContext.clearRect(0, 0, ccCanvas.width, ccCanvas.height);
    document.getElementById('cupcake').removeEventListener("mousedown", clickHandlerCc);
    document.removeEventListener("keydown", keydownHandlerCc);
    document.removeEventListener("keyup", keyupHandlerCc);
}

// Teachable Machine
const URL_CUPCAKE = "https://teachablemachine.withgoogle.com/models/DHyx9fKbs/";
let recognizerCupcake;

async function createModelCc() {
    const checkpointURL = URL_CUPCAKE + "model.json";
    const metadataURL = URL_CUPCAKE + "metadata.json";

    const recognizerCupcake = speechCommands.create(
        "BROWSER_FFT",
        undefined,
        checkpointURL,
        metadataURL);

    await recognizerCupcake.ensureModelLoaded();
    return recognizerCupcake;
}


async function initGestureCc() {
    recognizerCupcake = await createModelCc();
    const classLabels = recognizerCupcake.wordLabels();

    recognizerCupcake.listen(result => {
        const scores = result.scores;
        for (let i = 0; i < classLabels.length; i++) {
            if (scores[i] > 0.90) {
                switch (classLabels[i]) {
                    case "_background_noise_":
                        catcher.leftPressed = false;
                        catcher.rightPressed = false;
                        break;
                    case "left":
                        catcher.spd = -5;
                        catcher.leftPressed = true;
                        setTimeout(() => {catcher.leftPressed = false}, 100);
                        break;
                    case "right":
                        catcher.spd = 5;
                        catcher.rightPressed = true;
                        setTimeout(() => {catcher.rightPressed = false}, 100);
                        break;
                    case "jump":
                        if (!catcher.onair) {
                            catcher.jump = 100;
                            catcher.onair = true;
                        }
                        break;
                    case "pause":
                        if (paused)
                            paused = false;
                        else
                            paused = true;
                        break;
                    default:
                        catcher.leftPressed = false;
                        catcher.rightPressed = false;
                        break;
                }
            }
        }
    }, {
        includeSpectrogram: true,
        probabilityThreshold: 0.8,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.5
    });
}

async function destroyGestureCc() {
    if (recognizerCupcake) {
        recognizerCupcake.stopListening();
        recognizerCupcake = undefined;
    }
}