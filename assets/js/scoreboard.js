const TIME_OFFSET = 30; // centiseconds

class Scoreboard {
  constructor(gameBoard, players, timeLimit) {
    const aside = document.querySelector("aside");

    this.gameBoard = gameBoard;
    this.scores = [];
    this.players = [];
    this.scores.length = players;
    this.scores = this.scores.fill(0);
    this.paused = true;
    this.timeActive = false;
    for (let player = 0; player < players; ++player)
      this.players.push(`Player ${player + 1}`);
    setInterval(() => this.decrementTime(), 10);
    clearHTML(aside);
    this.element = aside.appendChild(document.createElement("div"));
    this.element.classList.add("container", "scoreboard");
    this.initializeBoard();
    this.updateSlot();
    this.updateScore();
    this.setTimeLimit(timeLimit);
  }

  updateScore() {
    let currentPlayer = this.element.querySelector(".player-card .player-info");
    for (let player = 0; player < this.players.length; ++player) {
      currentPlayer.firstElementChild.textContent = this.players[player];
      currentPlayer.lastElementChild.textContent = this.scores[player];
      currentPlayer = currentPlayer.nextElementSibling;
    }
  }

  updateTime() {
    const time = this.element.querySelector(".time span");
    const s = Math.floor(this.currentTime / 100);
    const cs = this.currentTime < this.timeLimit - TIME_OFFSET  ? this.currentTime % 100 : 0;

    time.textContent = `${Math.floor(s)}.${cs.toString().padStart(2, "0")}s`;
  }

  updateSlot() {
    const slot = this.element.querySelector(".slot");
    slot.classList.replace(slot.classList.item(1), this.gameBoard.pieces[this.gameBoard.currentPlayer]);
  }

  initializeBoard() {
    let currentElement;

    clearHTML(this.element);
    currentElement = this.element.appendChild(document.createElement("div"));
    currentElement.classList.add("container", "player-card");
    for (let player = 0; player < this.players.length; ++player) {
      currentElement = currentElement.appendChild(document.createElement("div"));
      currentElement.classList.add("container", "player-info");
      currentElement.appendChild(document.createElement("span")).classList.add("player");
      currentElement.appendChild(document.createElement("span")).classList.add("score");
      currentElement = currentElement.parentElement;
    }
    currentElement = this.element.appendChild(document.createElement("div"));
    currentElement.classList.add("container", "turn-card");
    currentElement = currentElement.appendChild(document.createElement("div"));
    currentElement.classList.add("container", "turn-item")
    currentElement.appendChild(document.createElement("div")).classList.add("slot", "empty");
    currentElement = currentElement.parentElement;
    currentElement = currentElement.appendChild(document.createElement("div"));
    currentElement.classList.add("container", "turn-item")
    currentElement = currentElement.appendChild(document.createElement("div"));
    currentElement.classList.add("time");
    currentElement.appendChild(document.createElement("span"));
  }

  incrementScore(player = this.gameBoard.currentPlayer) {
    return ++this.scores[player];
  }

  togglePause(force) {
    return this.paused = force ? force : !this.paused;
  }

  setTimeLimit(time) {
    const timeParent = this.element.querySelector(".time").parentElement.classList;
    this.timeLimit = time * 100 + TIME_OFFSET;
    this.resetTime();
    this.timeActive = true;
    if (timeParent.contains("hidden"))
      timeParent.remove("hidden");
    if(this.timeLimit <= TIME_OFFSET) {
      this.timeActive = false;
      if (!timeParent.contains("hidden"))
        timeParent.add("hidden");
    }

    return this.timeLimit;
  }

  resetTime() {
    this.currentTime = this.timeLimit;
    this.updateTime();
    return this.currentTime;
  }

  decrementTime() {
    if (this.timeActive && !this.paused && this.timeLimit > TIME_OFFSET) {
      --this.currentTime;
      if (this.currentTime >= 0)
        this.updateTime();
      if (this.currentTime < -TIME_OFFSET) {
        this.gameBoard.incrementPlayer("current");
        this.resetTime();
      }
    }
    return this.currentTime;
  }
}
