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
    this.playerCount = {count: 2};
    this.tokens = [];
    this.time = this.timeLimit = 0;
    this.paused = true;
    this.timeActive = false;

    this.setBoardData(6, 7, 4);
    this.setPlayerCount(this.playerCount.count);
    this.reset();

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
    const players = document.querySelector("#players");
    let element;
    let data;

    board.innerHTML = "";
    players.innerHTML = "";
    for(let i = 0; i < TOKENS.length; ++i) {
      if(i > 0) {
        element = players.appendChild(document.createElement("option"));
        element.setAttribute("value", i + 1);
        element.innerText = i + 1;
      }
      element = board.appendChild(document.createElement("button"));
      element.classList.add("select", "ui-token", TOKENS[i]);
      element.setAttribute("data-selected", i < this.playerCount.count ? i + 1 : EMPTY);
      element.appendChild(document.createElement("span"));
      if(i < this.playerCount.count) {
        data = element.getAttribute("data-selected");
        if (data !== `${EMPTY}`)
          element.firstElementChild.textContent = `P${data}`;
      }
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
    this.paused = !this.paused;
    document.querySelector("#selectModal").classList.toggle("hidden");
  }

  onClick(e) {
    const target = e.target;

    if(target.classList.contains("select"))
      this.selectToken(target);
    else if(target.classList.contains("token")) {
      if (this.gameBoard
          .placeToken(Number(target.getAttribute("data-x")), this.currentPlayer))
        this.resetTime();
    }
    else if(target.classList.contains("reset")) {
      this.restart();
      if(target.parentElement.tagName !== "FORM")
        this.toggleWinModal();
    }
    else if (target.id === "restartButton") {
      this.reset();
      this.toggleWinModal();
    }
    else if(target.id === "closeSelectButton"
         || target.classList.contains("ui-token")) {
      this.toggleSelectModal();
    }
  }

  resetTokens() {
    this.tokens.length = this.playerCount.count;
    for(let i = 0; i < this.playerCount.count; ++i)
      this.tokens[i] = TOKENS[i];
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
    let reset = false;

    e.preventDefault();
    if(data.get("y"))
      reset = !!(this.boardY = Number(data.get("y")));
    if(data.get("x"))
      reset = !!(this.boardX = Number(data.get("x")));
    if(data.get("win"))
      this.winCondition = Number(data.get("win"));
    if(data.get("time"))
      this.setTimeLimit(Number(data.get("time")));
    if(pCount > this.playerCount.count)
      this.setPlayerCount(pCount);
    else if (pCount < this.playerCount.count)
      reset = !(this.setPlayerCount(pCount));
    if(reset)
      this.reset();
    else
      this.createScoreboard();
    this.scoreboard.setToken(this.tokens[this.currentPlayer]);
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
      this.gameBoard.updateTokens();
    }
  }

  setPlayerCount(count) {
    this.currentPicking = 0;
    this.playerCount.count = count;
    this.resetTokens();
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
        this.currentPlayer = (this.currentPlayer + 1) % this.playerCount.count;
        this.scoreboard.setToken(this.tokens[this.currentPlayer]);
      break;
      case "picking":
        this.currentPicking = (this.currentPicking + 1) % this.playerCount.count;
      break;
    }

  }

  winSequence(stalemate) {
    this.scoreboard.incrementScore(this.currentPlayer);
    this.toggleWinModal(stalemate);
  }
}
