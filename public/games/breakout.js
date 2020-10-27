let ctx = document.getElementById('ctx').getContext('2d');
let WIDTH = 500;
let HEIGHT = 500;
let numOfEnemies, enemyList, score, intervalVar, running, hitCount;
ctx.font = '20px Calibri';
ctx.fillText("Click me to start the game", 150, 250);

let ball = {
    x: 0,
    y: 0,
    radius: 5,
    color: 'blue',
    spdX: -3,
    spdY: -3
};

let base = {
    x: 0,
    y: 400,
    height: 20,
    width: 100,
    color: 'red',
    pressingLeft: false,
    pressingRight: false,
    lives: 3
};

let enemy = {
    height: 20,
    width: 40,
    color: 'orange'
};

running = false;
document.getElementById('ctx').onmousedown = function () {
    if (running) {
        clearInterval(intervalVar);
    }
    startGame();
}

document.onkeydown = function (event) {
    if (event.keyCode == 37) {
        base.pressingLeft = true;
        base.pressingRight = false;
    }
    else if (event.keyCode == 39) {
        base.pressingLeft = false;
        base.pressingRight = true;
    }
}

document.onkeyup = function (event) {
    if (event.keyCode == 37) {
        base.pressingLeft = false;
    }
    else if (event.keyCode == 39) {
        base.pressingRight = false;
    }
}

testCollision = function (base, ball) {
    return ((base.x < ball.x + ball.radius) &&
        (ball.x < base.x + base.width) &&
        (base.y < ball.y + ball.radius) &&
        (ball.y < base.y + base.height));
}

testCollisionEnemy = function (e, ball) {
    return ((e.x < ball.x + ball.radius) &&
        (ball.x < e.x + enemy.width) &&
        (e.y < ball.y + ball.radius) &&
        (ball.y < e.y + enemy.height));
}

drawBall = function () {
    ctx.save();
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
}

drawBase = function () {
    ctx.save();
    ctx.fillStyle = base.color;
    ctx.fillRect(base.x, base.y, base.width, base.height);
    ctx.restore();
}

drawEnemy = function (e, i) {
    ctx.save();
    ctx.fillStyle = enemy.color;
    ctx.fillRect(e.x, e.y, enemy.width, enemy.height);
    ctx.restore();
}

updateBarPosition = function () {
    if (base.pressingLeft) {
        base.x = base.x - 5;
    }
    else if (base.pressingRight) {
        base.x = base.x + 5;
    }
    if (base.x < 0) {
        base.x = 0;
    }
    if (base.x > WIDTH - base.width) {
        base.x = WIDTH - base.width;
    }
}

updateBallPosition = function () {
    ball.x += ball.spdX;
    ball.y += ball.spdY;
    if (ball.x > WIDTH || ball.x < 0) {
        hitCount++;
        if (hitCount % 20 == 0) {
            if (ball.spdX < 0)
                ball.spdX = -(Math.abs(ball.spdX) + 1);
            else
                ball.spdX += 1;
        }
        ball.spdX = -ball.spdX;
    }
    if (ball.y < 0) {
        hitCount++;
        if (hitCount % 20 == 0) {
            if (ball.spdY < 0)
                ball.spdY = -(Math.abs(ball.spdY) + 1);
            else
                ball.spdY += 1;
        }
        ball.spdY = -ball.spdY;
    }
    if (ball.y > HEIGHT) {
        hitCount++;
        if (hitCount % 20 == 0) {
            if (ball.spdY < 0)
                ball.spdY = -(Math.abs(ball.spdY) + 1);
            else
                ball.spdY += 1;
        }
        ball.spdY = -ball.spdY;
        base.lives--;
    }
}

isGameOver = function () {
    if (base.lives < 0 || score == 330) {
        clearInterval(intervalVar);
        running = false;
        ctx.fillText('Game Over! Click to restart', 150, 250);
    }
}

update = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    enemyList.forEach(drawEnemy);
    drawBall();
    drawBase();

    if (testCollision(base, ball)) {
        ball.spdY = -ball.spdY;
    }

    for (key in enemyList) {
        if (testCollisionEnemy(enemyList[key], ball)) {
            delete enemyList[key];
            ball.spdY = -ball.spdY;
            score += 5;
        }
    }

    ctx.fillText("Score: " + score, 5, 490);
    ctx.fillText("Lives: " + base.lives, 430, 490);
    isGameOver();
    updateBarPosition();
    updateBallPosition();
}

startGame = function () {
    base.x = 150;
    ball.x = base.x + 100;
    ball.y = base.y - 100;
    numOfEnemies = 0;
    let enemyX = 5;
    let enemyY = 5;
    score = 0;
    base.lives = 3;
    enemyList = []; //5+40 = 45
    running = true;
    hitCount = 0;
    ball.spdX = -3;
    ball.spdY = -3;
    for (let i = 1; i <= 6; i++) {
        enemyX = 5;
        for (let j = 1; j <= 11; j++) {
            enemyList[numOfEnemies] = { x: enemyX, y: enemyY };
            numOfEnemies++;
            enemyX += 45;
        }
        enemyY += 25;
    }
    intervalVar = setInterval(update, 10);
}