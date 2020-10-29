const startButton = document.getElementById('startTetris');
const gameOverSpan = document.getElementById('tetrisGameOver');
const scoreSpan = document.getElementById('tetrisScore');
const menu = document.getElementById('tetrisMenu');

const tetrisCanvas = document.getElementById('tetris');
const tetrisContext = tetrisCanvas.getContext('2d');
tetrisContext.scale(24, 24);

let gestureControlTetris = false;
function switchToGestureTetris(btn) {
    btn.classList.toggle("fa-toggle-on");
    btn.classList.toggle("fa-toggle-off");
    let tetrisControlSelection = document.getElementById('tetrisControlSelection');
    if (gestureControlTetris) {
        tetrisControlSelection.textContent = "Turn ON voice control ";
        tetrisControlSelection.appendChild(btn);
        gestureControlTetris = false;
    }
    else {
        tetrisControlSelection.textContent = "Turn OFF voice control ";
        tetrisControlSelection.appendChild(btn);
        gestureControlTetris = true;
    }
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
        dropInterval -= rowCount * 10;
        tempInterval = dropInterval;
        rowCount *= 2;
    }
}

function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] &&
                    arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                tetrisContext.fillStyle = colors[value];
                tetrisContext.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);
            }
        });
    });
}

function draw() {
    tetrisContext.fillStyle = '#000';
    tetrisContext.fillRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerDrop(freefall = false) {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
        dropInterval = tempInterval;
    }
    if (freefall) {
        tempInterval = dropInterval;
        dropInterval = 0;
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}


function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
        (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        // arena.forEach(row => row.fill(0));
        // player.score = 0;
        // dropInterval = 1000;
        // updateScore();

        pause = true;
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

let requestIdTetris;
function start() {
    if (!requestIdTetris) {
        requestIdTetris = requestAnimationFrame(update);
    }
    if (pause) {
        menu.style.display = "block";
        startButton.innerHTML = "Play again!";
        gameOverSpan.style.display = "block";
        scoreSpan.style.display = "block";
        scoreSpan.innerHTML = "Your score: " + player.score;
        stop();
    }
}

function stop() {
    if (requestIdTetris) {
        if (gestureControlTetris && recognizerTetris) {
            recognizerTetris.stopListening();
            recognizerTetris = undefined;
        }
        cancelAnimationFrame(requestIdTetris);
        requestIdTetris = undefined;
    }
}

function update(time = 0) {
    requestIdTetris = undefined;
    const deltaTime = time - lastTime;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval && lastTime !== 0) {
        playerDrop();
    }
    lastTime = time;
    draw();
    start();
}

function updateScore() {
    document.getElementById('score').innerText = "Score: " + player.score;
}

function controls(event) {
    if (event.keyIdentifier === 37 || event.code === 37 || event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyIdentifier === 39 || event.code === 39 || event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyIdentifier === 40 || event.code === 40 || event.keyCode === 40) {
        playerDrop();
    } else if (event.keyIdentifier === 81 || event.code === 81 || event.keyCode === 81) {
        playerRotate(-1);
    } else if (event.keyIdentifier === 87 || event.code === 87 || event.keyCode === 87) {
        playerRotate(1);
    }
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

let arena, player;
let dropCounter, dropInterval, lastTime, tempInterval;
let pause;

// Teachable Machine
// const URL_TETRIS = "https://teachablemachine.withgoogle.com/models/40cl_JDZd/";
const URL_TETRIS = "https://teachablemachine.withgoogle.com/models/SvcOta5m-/";
let recognizerTetris;

async function createModel() {
    const checkpointURL = URL_TETRIS + "model.json"; // model topology
    const metadataURL = URL_TETRIS + "metadata.json"; // model metadata

    const recognizerTetris = speechCommands.create(
        "BROWSER_FFT", // fourier transform type, not useful to change
        undefined, // speech commands vocabulary feature, not useful for your models
        checkpointURL,
        metadataURL);

    // check that model and metadata are loaded via HTTPS requests.
    await recognizerTetris.ensureModelLoaded();

    return recognizerTetris;
}

async function initGesture() {
    recognizerTetris = await createModel();
    const classLabels = recognizerTetris.wordLabels();

    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizerTetris.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        for (let i = 0; i < classLabels.length; i++) {
            if (scores[i] > 0.90) {
                switch (classLabels[i]) {
                    case "_background_noise_":
                        break;
                    case "drop":
                        playerDrop(true);
                        break;
                    case "left":
                        playerMove(-1);
                        break;
                    case "right":
                        playerMove(1);
                        break;
                    case "rotate":
                        playerRotate(1);
                        break;
                    default:
                        break;
                }
            }
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.25 // probably want between 0.5 and 0.75. More info in README
    });

    // Stop the recognition in 5 seconds.
    // setTimeout(() => recognizerTetris.stopListening(), 5000);
}

function initGame() {
    document.addEventListener('keydown', controls);

    player = {
        pos: { x: 0, y: 0 },
        matrix: null,
        score: 0,
    };
    arena = createMatrix(20, 25);

    dropCounter = 0;
    dropInterval = tempInterval = 1000;
    lastTime = 0;
    pause = false;

    playerReset();
    updateScore();
    draw();
}

function startGameTetris() {
    initGame();
    if (gestureControlTetris) {
        let loader = document.getElementById('gestureLoaderTetris');
        loader.style.display = "block";
        startButton.innerHTML = "Loading...";
        startButton.disabled = true;
        startButton.style.backgroundColor = "#ccc";
        startButton.style.cursor = "default"
        initGesture()
            .then(() => {
                loader.style.display = "none";
                start();
                menu.style.display = "none";
                startButton.disabled = false;
                startButton.style.backgroundColor = "#f3c4df";
                startButton.style.cursor = "pointer";
            });
    } else {
        start();
        menu.style.display = "none";
    }
}

function stopGameTr() {
    stop();
    initGame();
    arena.forEach(row => row.fill(0));
    menu.style.display = "block";
    startButton.innerHTML = "Play!";
    gameOverSpan.style.display = "none";
    scoreSpan.style.display = "none";
    document.removeEventListener('keydown', controls);
}