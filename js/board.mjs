// eslint-disable-next-line no-unused-vars
class Board {
  constructor(root, state) {
    const { boardX, boardY, tokens } = state;
    this.root = root;
    this.data = new Array(boardX * boardY).fill(null);
    this.tokens = tokens;
    this.ratio = { x: boardX, y: boardY }
    this.winCon = state.winCon;
    this.render();
  }

  checkDir(i1, yDir, xDir) {
    const { x } = this.ratio;
    const i2 = i1 + xDir + yDir * x;
    const isInBounds = i1 % x + xDir === i2 % x;
    if (isInBounds && !isNaN(this.data[i2]) && this.data[i1] === this.data[i2]) {
      return 1 + this.checkDir(i2, yDir, xDir);
    }
    return 0;
  }

  checkForWin(index) {
    const { x } = this.ratio;
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

  updateSlot(index, val) {
    const { x } = this.ratio;
    let cur;
    index = index % x;
    if (this.data[index] !== null) return false;
    while(this.data[index + x] === null) index += x;
    if (!isNaN(Number(val))) {
      cur = document.querySelector(`.slot[data-index="${index}"]`);
      cur.classList.add(this.tokens[val]);
      this.data[index] = val;
      cur.setAttribute('data-value', val);
      return this.checkForWin(index);
    } else if (val === 'hover') {
      // do hover stuff
    } else if (val === 'unhover') {
      // remove hover stuff
    }
    return true;
  }

  update() {
    let cur = document.getElementsByClassName('slot');
    [...cur].forEach(val => {
        if(val.getAttribute('data-value') !== 'null') {
          cur = val.classList;
          cur.replace(cur[cur.length - 1], this.tokens[val.getAttribute('data-value')]);
        }
    });
  }

  render() {
    const { x, y } = this.ratio;
    let cur = document.querySelector('#board');
    if (cur) cur.innerHTML = '';
    else {
      cur = this.root.appendChild(document.createElement('div'));
      cur.id = 'board';
      cur.classList.add('section');
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
