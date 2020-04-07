//eslint-disable-next-line no-unused-vars
class Board {
  constructor(root, state) {
    const { boardX, boardY } = state;
    this.root = root;
    this.data = new Array(boardX * boardY).fill(null);
    this.render(boardX, boardY);
  }

  render(x, y) {
    let cur = this.root.appendChild(document.createElement('div'));
    cur.id = 'board';
    cur.classList.add('section');
    this.data.forEach((val, i) => {
      cur = cur.appendChild(document.createElement('div'));
      cur.setAttribute('data-index', i);
      cur.setAttribute('data-value', val);
      cur.classList.add('slot', i % x % 2 ? 'odd' : 'even');
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
