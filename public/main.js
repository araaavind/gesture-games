const modalContainer = document.getElementById('modalContainer');
const trContainer = document.getElementById('tetrisContainer');
const boContainer = document.getElementById('breakoutContainer');

const canvasList = {
    tetrisCard: trContainer,
    breakoutCard: boContainer
};

function openModalContainer() {
    modalContainer.style.display = "block";
    window.onclick = (e) => {
        if (e.target == modalContainer) {
            stopGameTr();
            stopGameBo();
            modalContainer.style.display = "none";
            for(const card in canvasList) {
                canvasList[card].style.display = "none";
            }
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