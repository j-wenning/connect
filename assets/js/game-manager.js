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
    this.tokens = null;
    this.setBoardData(6, 7, 4);
    this.setTokens()
    this.tokens = TOKENS.slice(players.length);
    this.time = this.timeLimit = 0;
    this.players = [1, 2, 3, 4, 5, 6];
    this.setPlayerCount(2)
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
      this.tokensTaken,
      this.incrementPlayer, this.currentPlayer,
      this.winCondition, this.winSequence);
    this.gameBoard.displayGrid();
  }

  createScoreboard() {
    this.scoreboard = new Scoreboard(this.players, this.playerCount);
  }

  toggleWinModal(stalemate) {
    const modal = document.querySelector("#winModal");
    const p = modal.querySelector("p");
    modal.classList.toggle("hidden");
    if(stalemate)
      p.textContent = "GAME OVER";
    else
      p.textContent = `Player ${this.players[this.currentPlayer]} wins!`;
  }

  toggleSelectModal() {
    document.querySelector("#selectModal").classList.toggle("hidden");
  }

  onClick(e) {
    const target = e.target;

    if(target.classList.contains("token"))
      this.gameBoard.placeToken(
        Number(target.getAttribute("data-x")), this.currentPlayer);
    if(target === document.querySelector("#resetButton")) {
      this.restart();
      this.toggleWinModal();
    }
    if (target === document.querySelector("#restartButton")) {
      this.reset();
      this.toggleWinModal();
    }
  }

  restart() {
    this.currentPlayer = -1;
    this.createGameBoard();
    this.incrementPlayer();
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

  setPlayerCount(count) {
    this.tokensTaken = this.tokens.slice(0, count);
    this.tokensAvail = this.tokens.slice(count);
    this.playerCount = count;
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
        this.incrementPlayer();
      }
    this.scoreboard.displayTime(this.time, this.timeLimit, this.timeActive);
  }

  incrementPlayer() {
    this.currentPlayer = (this.currentPlayer + 1) % this.playerCount;
    this.scoreboard.setToken(this.tokensTaken[this.currentPlayer]);
  }

  winSequence(stalemate) {
    this.scoreboard.incrementScore(this.currentPlayer);
    this.toggleWinModal(stalemate);
  }
}
