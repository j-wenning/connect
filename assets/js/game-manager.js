class GameManager {
  constructor() {
    this.winSequence = this.winSequence.bind(this);
    this.incrementPlayer = this.incrementPlayer.bind(this);
    this.gameBoard = null;
    this.scoreboard = null;
    this.boardX = null;
    this.boardY = null;
    this.winCondition = null;
    this.currentPlayer = null;
    this.currentPicking = null;
    this.playerCount = null;
    this.tokens = null;
    this.setBoardData(6, 7, 4);
    this.time = this.timeLimit = 0;
    this.setPlayerCount(2);
    this.createSelectModal();
    this.reset();
    this.paused = true;
    this.timeActive = false;
    setInterval(()=>this.decrementTime(), 10);
    document.addEventListener("click", e=>this.onClick(e));
    document.querySelector("form").addEventListener("submit", e=>this.onSubmit(e));
  }

  createGameBoard() {
    this.gameBoard = new GameBoard(
      this.boardY, this.boardX,
      this.tokens,
      this.incrementPlayer, this.currentPlayer,
      this.winCondition, this.winSequence);
    this.gameBoard.displayGrid();
  }

  createScoreboard() {
    this.scoreboard = new Scoreboard(this.playerCount, this.tokens);
  }

  createSelectModal() {
    const board = document.querySelector("#selectModal .row .col");
    let element;

    board.innerHTML = "";
    for(let i = 0; i < TOKENS.length; ++i) {
      element = board.appendChild(document.createElement("button"));
      element.classList.add("select", "token", TOKENS[i]);
      element.setAttribute("data-selected", i < this.playerCount ? i + 1 : EMPTY);
      element.appendChild(document.createElement("span"));
      if(i < this.playerCount)
        element.firstElementChild.textContent = `P${i + 1}`;
    }
  }

  toggleWinModal(stalemate) {
    const modal = document.querySelector("#winModal");
    const p = modal.querySelector("p");
    modal.classList.toggle("hidden");
    if(stalemate)
      p.textContent = "GAME OVER";
    else
      p.textContent = `${PLAYERS[this.currentPlayer]} wins!`;
  }

  toggleSelectModal() {
    this.currentPicking = 0;
    document.querySelector("#selectModal").classList.toggle("hidden");
  }

  onClick(e) {
    const target = e.target;

    if(target.classList.contains("select"))
      this.selectToken(target);
    else if(target.classList.contains("token"))
      this.gameBoard.placeToken(
        Number(target.getAttribute("data-x")), this.currentPlayer);
    else if(target === document.querySelector("#resetButton")) {
      this.restart();
      this.toggleWinModal();
    }
    else if (target === document.querySelector("#restartButton")) {
      this.reset();
      this.toggleWinModal();
    }
  }

  resetTokens() {
    this.tokens = TOKENS.slice(this.playerCount);
  }

  restart() {
    this.currentPicking = 0;
    this.currentPlayer = -1;
    this.createGameBoard();
    this.incrementPlayer("current");
  }

  reset() {
    this.createScoreboard();
    this.restart();
  }

  onSubmit(e) {
    const data = new FormData(e.target);
    let pCount = data.get("players");

    e.preventDefault();
    if(data.get("y"))
      this.boardY = Number(data.get("y"));
    if(data.get("x"))
      this.boardX = Number(data.get("x"));
    if(data.get("win"))
      this.winCondition = Number(data.get("win"));
    if(data.get("time"))
      this.setTimeLimit(Number(data.get("time")));
    if(pCount !== this.playerCount)
      this.setPlayerCount(pCount);
    this.reset();
    e.target.reset();
    document.querySelector("select.setting").value = pCount;
  }

  setBoardData(boardY, boardX, winCondition) {
    this.boardY = boardY;
    this.boardX = boardX;
    this.winCondition = winCondition;
  }

  selectToken(token) {
    const siblings = token.parentElement.children;

    if(token.getAttribute("data-selected") === `${EMPTY}`) {
      for(let i = 0; i < siblings.length; ++i)
        if (Number(siblings[i].getAttribute("data-selected")) === this.currentPicking + 1) {
          siblings[i].setAttribute("data-selected", EMPTY);
          siblings[i].firstElementChild.textContent = "";
        }
      this.tokens[this.currentPicking] = token.classList.item(2);
      token.setAttribute("data-selected", this.currentPicking + 1);
      token.firstElementChild.textContent = `P${this.currentPicking + 1}`;
      this.incrementPlayer("picking");
      this.scoreboard.displayScores();
      this.scoreboard.setToken(this.tokens[this.currentPlayer]);
    }
  }

  setPlayerCount(count) {
    this.resetTokens();
    this.playerCount = count;
    this.createSelectModal();
  }

  resetTime() {
    this.time = this.timeLimit;
  }

  setTimeLimit(timeLimit) {
    if(timeLimit > 0) {
      this.timeLimit = timeLimit * 100 + TIME_OFFSET;
      this.timeActive = true;
    }
    else this.timeActive = false;
    this.resetTime();
  }

  decrementTime() {
    if (!this.paused && this.timeActive)
      if (this.time > -TIME_OFFSET)
        --this.time;
      else {
        this.time = this.timeLimit;
        this.incrementPlayer("current");
      }
    this.scoreboard.displayTime(this.time, this.timeLimit, this.timeActive);
  }

  incrementPlayer(player) {
    switch(player) {
      case "current":
        this.currentPlayer = (this.currentPlayer + 1) % this.playerCount;
        this.scoreboard.setToken(this.tokens[this.currentPlayer]);
      break;
      case "picking":
        this.currentPicking = (this.currentPicking + 1) % this.playerCount;
      break;
    }

  }

  winSequence(stalemate) {
    this.scoreboard.incrementScore(this.currentPlayer);
    this.toggleWinModal(stalemate);
  }
}
