// eslint-disable-next-line no-unused-vars
class Menu {
  constructor(root, state) {
    this.root = root;
    this.state = state;
    this.render();
  }

  toggle() {
    let cur = document.querySelector('#menu').parentElement;
    cur.classList.toggle('closed');
  }

  update() {}

  render() {
    let cur = this.root.appendChild(document.createElement('div'));
    cur.classList.add('shade');
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
      cur.classList.add('selection-button', token);
      cur.setAttribute('data-index', index)
      cur = cur.parentElement;
    });
    cur = cur.parentElement;
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'settings';
    cur.classList.add('section');
    cur = cur.appendChild(document.createElement('form'));
    [
      { elem: 'label', for: 'boardX', textContent: 'x' },
      { elem: 'input', id: 'boardX', type: 'text' },
      { elem: 'label', for: 'boardY', textContent: 'y' },
      { elem: 'input', id: 'boardY', type: 'text' },
      { elem: 'label', for: 'players', textContent: 'player count' },
      { elem: 'select', id: 'players', val: 2 },
      { elem: 'label', for: 'timeLimit', textContent: 'time limit' },
      { elem: 'input', id: 'timeLimit', type: 'number' },
      { elem: 'label', for: 'winCon', textContent: 'win condition' },
      { elem: 'input', id: 'winCon', type: 'number'},
      { elem: 'button', id: 'reset', type: 'reset', textContent: 'reset' },
      { elem: 'button', id: 'create',type: 'submit', textContent: 'submit' }
    ].forEach(item => {
      cur = cur.appendChild(document.createElement(item.elem));
      for (const key in item) {
        if (key === 'textContent') cur.textContent = item[key];
        else if (key !== 'elem') cur.setAttribute(key, item[key]);
      }
      cur = cur.parentElement;
    })
  }
}
