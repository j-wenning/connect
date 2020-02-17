class GameBoard {
  constructor(boardY, boardX, tokens, currentPlayer, incrementPlayer, winCondition, winSequence) {
    this.hovered = null;
    this.boardY = boardY;
    this.boardX = boardX;
    this.tokens = tokens;
    this.currentPlayer = currentPlayer;
    this.incrementPlayer = incrementPlayer;
    this.winCondition = winCondition;
    this.winSequence = winSequence;
    this.grid = this.createGrid(boardY, boardX);
  }

  // GAME LOGIC
  createGrid(boardY, boardX) {
    let grid = [];

    for (let y = 0; y < boardY; ++y) {
      grid.push([]);
      for (let x = 0; x < boardX; ++x) {
        grid[y][x] = new Token(EMPTY, x, boardY, boardX);
        // set rounded corners for board
        if(boardX === 1) {
          if (y === 0 && x === 0)
            grid[y][x].elem.classList.add("top");
          else if (y === boardY - 1 && x === boardX - 1)
            grid[y][x].elem.classList.add("bottom");
        }
        else if (boardY === 1) {
          if (y === 0 && x === 0)
            grid[y][x].elem.classList.add("left");
          else if (y === boardY - 1 && x === boardX - 1)
            grid[y][x].elem.classList.add("right");
        }
        else {
          if (y === 0 && x === 0)
            grid[y][x].elem.classList.add("bottom-left");
          else if (y === 0 && x === boardX - 1)
            grid[y][x].elem.classList.add("bottom-right");
          else if (y === boardY - 1 && x === 0)
            grid[y][x].elem.classList.add("top-left");
          else if (y === boardY - 1 && x === boardX - 1)
            grid[y][x].elem.classList.add("top-right");
        }
      }
    }
    return grid;
  }

  placeToken(x, val) {
    let y = 0;

    while (this.checkAt(y, x)) {
      if (this.updateToken(y, x, val)) {
        if(this.checkAdj(y, x))
          this.winSequence();
        else if (this.checkStale())
          this.winSequence(true);
        this.incrementPlayer("current");
        this.hover(x);
        // primarily for mobile
        setTimeout(()=>this.unHover(), 1000);
        return true;
      }
      ++y;
    }

    return false;
  }

  checkAt(y, x) {
    return y < this.boardY && x < this.boardX
        && y >= 0 && x >=0;
  }

  checkAdj(y, x) {
    let count = 1;
    let highest = 1;
    function compareAndReset() {
      if(count > highest) {
        highest = count;
      }
      count = 1;
    }
    // pos (+) slant
    count += this.checkDir(y, x, 1, -1);
    count += this.checkDir(y, x, -1, 1);
    compareAndReset();
    // neg (-) slant
    count += this.checkDir(y, x, 1, 1);
    count += this.checkDir(y, x, -1, -1);
    compareAndReset();
    // vertical
    count += this.checkDir(y, x, 1, 0);
    count += this.checkDir(y, x, -1, 0);
    compareAndReset();
    // horizontal
    count += this.checkDir(y, x, 0, -1);
    count += this.checkDir(y, x, 0, 1);
    compareAndReset();
    return highest >= this.winCondition.val;
  }

  checkDir(y1, x1, yDir, xDir) {
    const y2 = y1 + yDir;
    const x2 = x1 + xDir;

    if(this.checkAt(y2, x2))
      if(this.grid[y1][x1].val === this.grid[y2][x2].val)
        return 1 + this.checkDir(y2, x2, yDir, xDir);
    return 0;
  }

  checkStale() {
    for(let x = 0; x < this.boardX; x++)
      if(this.grid[this.boardY-1][x].val === EMPTY)
        return false;
    return true;
  }

  // BOARD DISPLAY
  highlight(y, x) {
    const elem = this.grid[y][x].elem;

    if (this.grid[y][x].val === EMPTY) {
      if (this.hovered)
        this.hovered.classList.remove("highlight");
      elem.classList.add("highlight");
      this.hovered = elem;
      return true;
    }
    return false;
  }

  unHover() {
    if (this.hovered)
      this.hovered.classList.remove("highlight");
    this.hovered = null;
  }

  hover(x, y = 0) {
    while (this.checkAt(y, x)) {
      console.log(y);
      if (this.highlight(y, x))
        return true;
      ++y;
    }
    return false;
  }

  changeTokens(tokens) {
    this.tokens = tokens;
    this.updateTokens();
  }

  resize() {
    const gameBoard = document.querySelector("#gameBoard");
    const wH = window.innerHeight;
    const wW = window.innerWidth;
    const bSize = (wW < wH ? wW : wH) * (wW > 1000 ? 1 : 0.75);
    let bH;
    let bW;

    if(this.boardX < this.boardY) {
      bH = bSize;
      bW = (bSize / this.boardY) * this.boardX;
    } else {
      bH = (bSize / this.boardX) * this.boardY;
      bW = bSize;
    }
    gameBoard.setAttribute("style",
      `height: ${bH}px;
      width: ${bW}px;`);
  }

  displayGrid() {
    const gameBoard = document.querySelector("#gameBoard");

    gameBoard.innerHTML = "";
    for(let y = this.boardY - 1; y >= 0; --y)
      for(let x = 0; x < this.boardX; ++x)
        gameBoard.appendChild(this.grid[y][x].elem);
    this.resize();
  }

  updateToken(y, x, val) {
    const token = this.grid[y][x];
    let updated = false;

    if (token.val === EMPTY && typeof val === typeof Number()) {
      token.val = val;
      updated = true;
    }
    if (token.val !== EMPTY)
      token.elem.classList.replace(
                            token.elem.classList.item(1),
                            this.tokens[token.val]);
    return updated;
  }

  updateTokens() {
    for(let y = 0; y < this.boardY; ++y)
      for(let x = 0; x < this.boardX; ++x)
        this.updateToken(y, x);
  }
}
