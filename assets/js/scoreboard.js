class Scoreboard {
  constructor(playerCount) {
    this.scores = []
    this.scores.length = playerCount;
    this.scores.fill(0);
    this.displayScores();
    this.createTime();
  }

  incrementScore(player) {
    ++this.scores[player];
    this.displayScores();
  }

  displayScores() {
    const board = document.querySelector("#scoreBoardTop .col")

    board.innerHTML = "";
    for(let i = 0; i < this.scores.length; ++i)
      board.appendChild(this.createScore(i));
  }

  createScore(player) {
    const score = document.createElement("div");

    score.classList.add("player");
    score.appendChild(document.createElement("p"))
      .classList.add("name");
    score.appendChild(document.createElement("p"))
      .classList.add("score");
    score.firstElementChild.textContent = `${PLAYERS[player]}`;
    score.lastElementChild.textContent = this.scores[player];
    return score;
  }

  setToken(name) {
    const token = document.querySelector("#token");

    token.classList.replace(token.classList.item(1), name);
  }

  displayTime(time, timeLimit, timeActive) {
    const span = document.querySelector("#time");

    if(timeActive) {
      span.parentElement.classList.remove("hidden");
      if(time >= 0 && time <= timeLimit - TIME_OFFSET)
        span.textContent = time;
    } else span.parentElement.classList.add("hidden");
  }

  createTime() {
    const board = document.querySelector("#scoreBoardBot .col")

    board.innerHTML = "";
    board.appendChild(document.createElement("div"))
      .setAttribute("id", "token");
    board.appendChild(document.createElement("div"))
      .appendChild(document.createElement("span"))
      .setAttribute("id", "time");
    board.firstElementChild.classList.add("token", "empty");
    board.lastElementChild.classList.add("timer");
  }
}
