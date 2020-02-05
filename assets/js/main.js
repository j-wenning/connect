const EMPTY = -1;
const NON_PLAYER = -1;

function clearHTML(element) {
  element.innerHTML = "";
}

class GameManager{
  constructor() {
    this.gameBoard = new GameBoard();
    this.settingsButton = document.getElementById("settingsButton");
    this.boardResetButton = document.getElementById("boardResetButton");
    this.settingsButton.addEventListener("click", e=>this.newBoardCallback(e));
    this.boardResetButton.addEventListener("click", e=>this.clearBoard(e));
  }
  clearBoardCallback(e){
    return this.clearBoard()
  }
  clearBoard() {
    return this.gameBoard.resetBoard();
  }
  newBoardCallback(e) {
    const boardX = Number(document.getElementById("gridSizeX").value);
    const boardY = Number(document.getElementById("gridSizeY").value);
    const winCondition = Number(document.getElementById("winCondition").value);
    const players = Number(document.getElementById("playerCount").value);
    const timeLimit = Number(document.getElementById("timeLimit").value);
    return this.newBoard(boardX, boardY, winCondition, players, timeLimit);
  }
  newBoard(boardX, boardY, winCondition, players, timeLimit) {
    return this.gameBoard = new GameBoard(boardX, boardY, winCondition, players, timeLimit);
  }
}

const gameManager = new GameManager();
