const modalContainer = document.getElementById('modalContainer');
const tetrisCanvas = document.getElementById('tetrisCanvas');
const breakoutCanvas = document.getElementById('breakoutCanvas');

canvasList = {
    tetrisCard: tetrisCanvas,
    breakoutCard: breakoutCanvas
};

function openModalContainer() {
    modalContainer.style.display = "block";
    window.onclick = (e) => {
        if (e.target == modalContainer) {
            stopGame();
            modalContainer.style.display = "none";
            tetrisCanvas.style.display = "none";
        }
    }
}

function openGame(element) {
    openModalContainer();
    canvasList[element.id].style.display = "block";
}

const games = document.getElementsByClassName('games');
for(let i = 0; i < games.length; i++) {
    games[i].addEventListener("mouseenter", (e) => {
        games[i].firstElementChild.style.filter = "brightness(50%)";
    });
    games[i].addEventListener("mouseleave", (e) => {
        games[i].firstElementChild.style.filter = "brightness(100%)";
    });
}