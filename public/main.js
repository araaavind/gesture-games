const modalContainer = document.getElementById('modalContainer');
const trContainer = document.getElementById('tetrisContainer');
const boContainer = document.getElementById('breakoutContainer');
const ccContainer = document.getElementById('cupcakeContainer');

const canvasList = {
    tetrisCard: trContainer,
    breakoutCard: boContainer,
    cupcakeCard: ccContainer
};

const commands = {
    tetrisCard: { start: undefined, stop: stopGameTr},
    breakoutCard: { start: initGameBo, stop: stopGameBo},
    cupcakeCard: {start: initGameCc, stop: stopGameCc}
}

function openModalContainer(element) {
    modalContainer.style.display = "block";
    window.onclick = (e) => {
        if (e.target == modalContainer) {
            if(commands[element.id].stop) {
                commands[element.id].stop();
            }
            modalContainer.style.display = "none";
            canvasList[element.id].style.display = "none";
        }
    }
}

function openGame(element) {
    openModalContainer(element);
    if(commands[element.id].start) {
        commands[element.id].start();
    }
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