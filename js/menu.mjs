// eslint-disable-next-line no-unused-vars
class Menu {
  constructor(root, state) {
    const { boardX, boardY, scores, maxTime, winCon } = state;
    this.root = root;
    this.boardX = boardX;
    this.boardY = boardY;
    this.playerCount = scores.length;
    this.maxTime = maxTime;
    this.winCon = winCon;
    this.render();
    this.update(state);
  }

  toggle() {
    let cur = document.querySelector('#menu').parentElement;
    cur.classList.toggle('closed');
  }

  update(state) {
    const { boardX, boardY, scores, maxTime, winCon } = state;
    let cur;
    if (this.boardX !== boardX) {
      cur = document.querySelector('#boardX');
      cur.value = boardX;
      this.boardX = boardX;
    }
    if (this.boardY !== boardY) {
      cur = document.querySelector('#boardY');
      cur.value = boardY;
      this.boardY = boardY;
    }
    if (this.playerCount !== scores.length) {
      cur = document.querySelector('#players');
      cur.value = scores.length;
      this.playerCount = scores.length;
    }
    if (this.maxTime !== maxTime) {
      cur = document.querySelector('#timeLimit');
      cur.value = maxTime;
      this.maxTime = maxTime;
    }
    if (this.winCon !== winCon) {
      cur = document.querySelector('#winCon');
      cur.value = winCon;
      this.winCon = winCon;
    }
  }

  render() {
    let cur = document.querySelector('#menu');
    if (cur) {
      cur = cur.parentElement;
      cur.innerHTML = '';
    } else {
      cur = this.root.appendChild(document.createElement('div'));
      cur.classList.add('shade');
    }
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'menu';
    cur.classList.add('section');
    cur = cur.appendChild(document.createElement('button'))
    cur.id = 'closeMenuButton';
    cur.classList.add('menu-button');
    cur.textContent = 'close';
    cur = cur.parentElement;
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'selection';
    cur.classList.add('section');
    // eslint-disable-next-line no-undef
    TOKENS.forEach((token, index) => {
      cur = cur.appendChild(document.createElement('button'));
      cur.classList.add('selection-button', 'token', token);
      if (index < this.playerCount) {
        cur.setAttribute('data-value', index);
        cur.textContent = 'P' + (index + 1);
      }
      cur = cur.parentElement;
    });
    cur = cur.parentElement;
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'settings';
    cur.classList.add('section');
    cur = cur.appendChild(document.createElement('form'));
    [
      { elem: 'label', for: 'boardX', textContent: 'x' },
      { elem: 'input', id: 'boardX', type: 'number', value: this.boardX },
      { elem: 'label', for: 'boardY', textContent: 'y' },
      { elem: 'input', id: 'boardY', type: 'number', value: this.boardY },
      { elem: 'label', for: 'players', textContent: 'player count' },
      { elem: 'select', id: 'players' },
      { elem: 'label', for: 'timeLimit', textContent: 'time limit' },
      { elem: 'input', id: 'timeLimit', type: 'number', value: Number(this.maxTime) },
      { elem: 'label', for: 'winCon', textContent: 'win condition' },
      { elem: 'input', id: 'winCon', type: 'number', value: this.winCon },
      { elem: 'button', id: 'reset', type: 'reset', textContent: 'reset' },
      { elem: 'button', id: 'create',type: 'submit', textContent: 'submit' }
    ].forEach(item => {
      cur = cur.appendChild(document.createElement(item.elem));
      for (const key in item) {
        if (key === 'textContent') cur.textContent = item[key];
        else if (key !== 'elem') cur.setAttribute(key, item[key]);
      }
      cur = cur.parentElement;
    });
    cur = document.querySelector('#players');
    // eslint-disable-next-line no-undef
    for (let i = 2; i < TOKENS.length; ++i) {
      cur = cur.appendChild(document.createElement('option'));
      cur.value = cur.textContent = i;
      cur = cur.parentElement;
    }
  }
}
