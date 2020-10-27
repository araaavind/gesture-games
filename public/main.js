const modalContainer = document.getElementById('modalContainer');
const tetrisCanvas = document.getElementById('tetrisCanvas');

canvasList = {
    tetrisCard: tetrisCanvas
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