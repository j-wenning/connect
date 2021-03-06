// eslint-disable-next-line no-unused-vars
class Board {
  constructor(root, state) {
    const { boardX, boardY, tokens } = state;
    this.root = root;
    this.data = new Array(boardX * boardY).fill(null);
    this.tokens = [...tokens];
    this.board = { x: boardX, y: boardY }
    this.aspect = { x: null, y: null }
    this.winCon = state.winCon;
    this.highlight = null;
    this.players = state.scores.length;
    this.render();
    this.update(state);
  }

  checkDir(i1, yDir, xDir) {
    const { x } = this.board;
    const i2 = i1 + xDir + yDir * x;
    const isInBounds = i1 % x + xDir === i2 % x;
    if (isInBounds && !isNaN(this.data[i2]) && this.data[i1] === this.data[i2]) {
      return 1 + this.checkDir(i2, yDir, xDir);
    }
    return 0;
  }

  checkForWin(index) {
    const { x } = this.board;
    let count = 1; // diagonal
    count += this.checkDir(index, 1, 1);
    count += this.checkDir(index, -1, -1);
    if (count >= this.winCon) return 'win';
    count = 1; // antidiagonal
    count += this.checkDir(index, 1, -1);
    count += this.checkDir(index, -1, 1);
    if (count >= this.winCon) return 'win';
    count = 1; // vertical
    count += this.checkDir(index, 1, 0);
    count += this.checkDir(index, -1, 0);
    if (count >= this.winCon) return 'win';
    count = 1; // horizontal
    count += this.checkDir(index, 0, -1);
    count += this.checkDir(index, 0, 1);
    if (count >= this.winCon) return 'win';
    // stalemate
    for (let i = 0; i < x; ++i) {
      if (this.data[i] === null) return 'next';
    }
    return 'stalemate';
  }

  updateSlot(index, val = null) {
    const { x } = this.board;
    let cur;
    if (index === null && this.highlight !== null) {
      cur = document.querySelector(`.slot[data-index="${this.highlight}"]`);
      if (cur) {
        cur.classList.remove('highlighted-slot');
        this.highlight = null;
        return 'removed';
      } return false;
    }
    index = index % x;
    if (this.data[index] !== null) return false;
    while(this.data[index + x] === null) index += x;
    cur = document.querySelector(`.slot[data-index="${index}"]`);
    if (val === 'highlight') {
      if (index !== this.highlight) {
        cur.classList.add('highlighted-slot');
        cur = document.querySelector(`.slot[data-index="${this.highlight}"]`);
        if (cur) cur.classList.remove('highlighted-slot');
        this.highlight = index;
        return 'highlight';
      }
      return false;
    } else if (!isNaN(Number(val))) {
      cur.classList.add(this.tokens[val]);
      this.data[index] = val;
      cur.setAttribute('data-value', val);
      return this.checkForWin(index);
    }
    return true;
  }

  clearSlots(players) {
    const { x } = this.board;
    const start = this.data.length - x;
    let cur;
    let swapVal1;
    let swapVal2;
    for (let col = start; col < this.data.length; ++col) {
      for (let i = col; i >= 0; i -= x) {
        if (this.data[i] >= players) {
          this.data[i] = null;
          cur = document.querySelector(`.slot[data-index="${i}"]`);
          cur.setAttribute('data-value', null);
          cur = cur.classList;
          cur.remove(cur[cur.length - 1]);
        }
        if (this.data[i] !== null) {
          cur = i;
          while (i + x < this.data.length && this.data[i + x] === null) i += x;
          if (cur !== i) {
            [this.data[cur], this.data[i]] = [this.data[i], this.data[cur]];
            cur = document.querySelector(`.slot[data-index="${cur}"]`);
            swapVal2 = cur.getAttribute('data-value');
            cur.setAttribute('data-value', null);
            cur = cur.classList;
            swapVal1 = cur[cur.length - 1];
            cur.remove(swapVal1);
            cur = document.querySelector(`.slot[data-index="${i}"]`);
            cur.setAttribute('data-value', swapVal2);
            cur.classList.add(swapVal1);
          }
        }
      }
    }
  }

  update(state) {
    const { tokens, winCon } = state;
    const { x, y } = this.board;
    let cur;
    if (window.innerWidth !== this.aspect.x
      || window.innerHeight !== this.aspect.y) {
      cur = document.querySelector('#board');
      const wH = window.innerHeight * 0.75;
      const wW = window.innerWidth;
      const bSize = wW < wH ? wW : Math.max(wH, 375) * 0.75;
      let bH;
      let bW;
      if (x < y) {
        bH = bSize;
        bW = (bSize / y) * x;
      } else {
        bH = (bSize / x) * y;
        bW = bSize;
      }
      cur.setAttribute('style', `height: ${bH}px; width: ${bW}px;`);
      this.aspect.x = window.innerWidth;
      this.aspect.y = window.innerHeight;
    }
    if (tokens.toString() !== this.tokens.toString()) {
      this.tokens = [...tokens];
      cur = document.getElementsByClassName('slot');
      [...cur].forEach(val => {
        if (val.getAttribute('data-value') !== 'null') {
          cur = val.classList;
          cur.replace(cur[cur.length - 1], this.tokens[val.getAttribute('data-value')]);
        }
      });
    }
    if (this.winCon !== winCon) this.winCon = winCon;
    if (this.players !== state.scores.length) {
      if (this.players > state.scores.length) {
        this.clearSlots(state.scores.length);
      }
      this.players = state.scores.length;
      cur = document.querySelector('#board');
      if (this.players > 3) cur.classList.add('lowered');
      else cur.classList.remove('lowered');
    }
  }

  render() {
    const { x, y } = this.board;
    let cur = document.querySelector('#board');
    if (cur) cur.innerHTML = '';
    else {
      cur = this.root.appendChild(document.createElement('div'));
      cur.id = 'board';
    }
    this.data.forEach((val, i) => {
      cur = cur.appendChild(document.createElement('div'));
      cur.setAttribute('data-index', i);
      cur.setAttribute('data-value', val);
      cur.classList.add('slot', 'token', i % x % 2 ? 'odd' : 'even');
      if (x === 1 && y === 1) cur.classList.add('around');
      else if (x === 1 || y === 1) {
        if (i === 0) cur.classList.add(x === 1 ? 'top' : 'left');
        else if (i === this.data.length - 1) cur.classList.add(x === 1 ? 'bottom' : 'right');
      } else {
        if (i === 0) cur.classList.add('top', 'left');
        else if ((i + 1) / x === 1) cur.classList.add('top', 'right');
        else if (i + x === this.data.length) cur.classList.add('bottom', 'left');
        else if (i === this.data.length - 1) cur.classList.add('bottom', 'right');
      }
      cur.setAttribute('style', `flex-basis: ${100 / x}%;`);
      cur = cur.parentElement;
    });
  }
}
