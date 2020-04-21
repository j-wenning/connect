// eslint-disable-next-line no-unused-vars
class Menu {
  constructor(root, state) {
    const { boardX, boardY, scores, maxTime, winCon } = state;
    this.root = root;
    this.boardX = boardX;
    this.boardY = boardY;
    this.players = scores.length;
    this.maxTime = maxTime;
    this.winCon = winCon;
    this.render();
    this.update(state);
  }

  setState(state, resetBoard, resetHud) {
    let isNewSize = false;
    if (this.boardX !== state.boardX) {
      state.boardX = this.boardX;
      isNewSize = true;
    }
    if (this.boardY !== state.boardY) {
      state.boardY = this.boardY;
      isNewSize = true;
    }
    if (this.players !== state.scores.length) {
      const prevLength = state.scores.length;
      state.scores.length = this.players;
      if (prevLength < state.scores.length) {
        state.scores.fill(0, prevLength);
        if (state.curPlayer >= state.scores.length) state.curPlayer = 0;
      }
      [...document.getElementsByClassName('selection-button')]
        .forEach((elem, index) => {
          if (index < state.scores.length) {
            elem.setAttribute('data-value', index)
            elem.textContent = 'P' + (index + 1);
            elem.classList.add('selected');
          } else {
            elem.removeAttribute('data-value');
            elem.classList.remove('selected');
            elem.innerHTML = '&nbsp;&nbsp;'
          }
        });
      // eslint-disable-next-line no-undef
      state.tokens = [...TOKENS];
      state.tokens.length = state.scores.length;
      resetHud();
    }
    if (this.maxTime !== state.maxTime) {
      state.maxTime = this.maxTime ? this.maxTime * 100 : null;
      state.curTime = this.maxTime ? this.maxTime * 100 : null;
    }
    if (this.winCon !== state.winCon) state.winCon = this.winCon;
    if (isNewSize) {
      resetBoard();
    }
  }

  setProp(prop, val) {
    val = Number(val);
    if (prop === 'maxTime') val = val ? Math.abs(val) : null;
    else val = val ? Math.abs(val) : 1;
    this[prop] = val;
    document.querySelector(`#${prop}`).value = val;
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
    if (this.players !== scores.length) {
      cur = document.querySelector('#players');
      cur.value = scores.length;
      this.players = scores.length;
    }
    if (this.maxTime !== maxTime) {
      cur = document.querySelector('#maxTime');
      cur.value = Number(maxTime) ? maxTime / 100 : null;
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
    cur.classList.add('overlay');
    cur = cur.appendChild(document.createElement('button'))
    cur.id = 'closeMenuButton';
    cur.classList.add('menu-button');
    cur.textContent = 'close';
    cur = cur.parentElement.appendChild(document.createElement('div'));
    cur.id = 'selection';
    // eslint-disable-next-line no-undef
    TOKENS.forEach((token, index) => {
      cur = cur.appendChild(document.createElement('button'));
      cur.classList.add('selection-button', 'token', token);
      if (index < this.players) {
        cur.setAttribute('data-value', index);
        cur.classList.add('selected');
        cur.textContent = 'P' + (index + 1);
      } else {
        cur.innerHTML = '&nbsp;&nbsp;'
      }
      cur = cur.parentElement;
    });
    cur = cur.parentElement;
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'settings';
    cur = cur.appendChild(document.createElement('form'));
    [
      { elem: 'label', for: 'boardX', textContent: 'board width' },
      { elem: 'input', id: 'boardX', type: 'number', value: this.boardX },
      { elem: 'label', for: 'boardY', textContent: 'board height' },
      { elem: 'input', id: 'boardY', type: 'number', value: this.boardY },
      { elem: 'label', for: 'players', textContent: 'player count' },
      { elem: 'select', id: 'players' },
      { elem: 'label', for: 'maxTime', textContent: 'time limit' },
      { elem: 'input', id: 'maxTime', type: 'number', value: this.maxTime, placeholder: '(secs)' },
      { elem: 'label', for: 'winCon', textContent: 'win condition' },
      { elem: 'input', id: 'winCon', type: 'number', value: this.winCon },
      { elem: 'button', id: 'reset', type: 'reset', textContent: 'reset' },
      { elem: 'button', id: 'submit',type: 'submit', textContent: 'submit' }
    ].forEach(item => {
      cur = cur.appendChild(document.createElement(item.elem));
      for (const key in item) {
        if (key === 'textContent') cur.textContent = item[key];
        else if (key !== 'elem') cur.setAttribute(key, item[key]);
      }
      cur = cur.parentElement;
    });
    cur = cur.parentElement.appendChild(document.createElement('p'));
    cur.textContent = 'Enter time limit in seconds, leave empty for no limit.'
    cur = document.querySelector('#players');
    // eslint-disable-next-line no-undef
    for (let i = 2; i <= TOKENS.length; ++i) {
      cur = cur.appendChild(document.createElement('option'));
      cur.value = cur.textContent = i;
      cur = cur.parentElement;
    }
  }
}
