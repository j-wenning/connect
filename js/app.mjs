// eslint-disable-next-line no-unused-vars
class App {
  constructor(root) {
    this.root = root;
    this.state = {
      boardX: 7,
      boardY: 6,
      scores: [0, 0],
      tokens: ['fox-token', 'falco-token'],
      curPlayer: 0,
      maxTime: null,
      curTime: null,
      winCon: 4,
      curSelect: 0,
      paused: true
    }
    this.menu = this.hud = this.board = this.win = null;
    this.render();
    document.addEventListener('click', e => this.handleClick(e));
    document.addEventListener('submit', e => this.handleSubmit(e));
    document.addEventListener('reset', e => this.handleReset(e));
    document.addEventListener('mousemove', e => this.handleMousemove(e));
    document.addEventListener('input', e => this.handleInput(e));
    window.addEventListener('resize', () => this.handleResize());
    setInterval(() => this.onTick(), 10);
  }

  setNextPlayer() {
    // eslint-disable-next-line no-undef
    this.state.curTime = this.state.maxTime + TIME_OFFSET;
    this.state.curPlayer = (this.state.curPlayer + 1) % this.state.scores.length;
    this.update('hud');
  }

  onTick() {
    if (this.state.maxTime !== null && !this.state.paused) {
      // eslint-disable-next-line no-undef
      if (this.state.curTime >= -TIME_OFFSET * 2) --this.state.curTime;
      else this.setNextPlayer();
      this.update('hud');
    }
  }

  handleClick(e) {
    let cur = e.target;
    if (cur.id === 'openMenuButton' || cur.id === 'closeMenuButton') {
      this.menu.toggle();
      this.state.paused = !this.state.paused;
    }
    else if (cur.id === 'newGameButton') {
      // eslint-disable-next-line no-undef
      this.board = new Board(this.root, this.state);
      this.state.curPlayer = 0;
      this.win.toggle();
      this.state.paused = !this.state.paused;
      this.update('hud');
    } else if (cur.classList.contains('selection-button')) {
      const token = cur.classList[cur.classList.length - 1];
      if (cur.getAttribute('data-value') === null) {
        const old = document.querySelector(`[data-value="${this.state.curSelect}"]`);
        if (old) old.removeAttribute('data-value');
        cur.setAttribute('data-value', this.state.curSelect);
        if (old) old.classList.remove('selected');
        cur.classList.add('selected');
        if (old) old.innerHTML = '&nbsp;&nbsp;';
        cur.textContent = 'P' + (this.state.curSelect + 1);
        this.state.tokens[this.state.curSelect] = token;
        this.update('board, hud');
      }
      this.state.curSelect = (this.state.curSelect + 1) % this.state.scores.length;
    } else if (cur.classList.contains('slot')) {
      cur = Number(cur.getAttribute('data-index'));
      switch (this.board.updateSlot(cur, this.state.curPlayer)) {
        case 'stalemate':
          this.state.curPlayer = null;
          this.update('win');
          this.win.toggle();
          this.state.paused = !this.state.paused;
          break;
        case 'win':
          ++this.state.scores[this.state.curPlayer];
          this.update('win, hud');
          this.win.toggle();
          this.state.paused = !this.state.paused;
          break;
        case 'next':
          this.setNextPlayer();
          break;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.menu.setState(this.state,
      // eslint-disable-next-line no-undef
      () => { this.board = new Board(this.root, this.state); },
      // eslint-disable-next-line no-undef
      () => { this.hud = new HUD(this.root, this.state); }
    );
    this.update('menu, hud, board');
    this.state.curSelect = 0;
    this.menu.toggle();
    this.state.paused = !this.state.paused;
  }

  handleReset(e) {
    e.preventDefault();
    this.menu.update({
      boardX: 7,
      boardY: 6,
      scores: [0, 0],
      maxTime: null,
      winCon: 4
    });
  }

  handleMousemove(e) {
    e = e.target;
    if (e.classList.contains('slot')) {
      this.board.updateSlot(Number(e.getAttribute('data-index')), 'highlight');
    } else this.board.updateSlot(null, null);
  }

  handleInput(e) {
    this.menu.setProp(e.target.id, e.target.value);
    if (e.target.id === 'players') {
      if(this.state.scores.length < e.target.value) {
        this.state.scores.concat(new Array(e.target.value - this.state.scores.length));
      } else this.state.scores.splice(e.target.value - 1);
      this.menu.setState(
        this.state,
        // eslint-disable-next-line no-undef
        () => { this.board = new Board(this.root, this.state); },
        // eslint-disable-next-line no-undef
        () => { this.hud = new HUD(this.root, this.state); }
      );
      this.update('board');
    }
  }

  handleResize() {
    this.update('board');
  }

  update(str) {
    str.split(', ')
      .forEach(item => {
        this[item].update(this.state);
      });
  }

  render() {
    let cur = this.root.appendChild(document.createElement('div'));
    cur.classList.add('background');
    cur = cur.appendChild(document.createElement('img'));
    cur.setAttribute('src', "./assets/images/falco.png");
    cur = cur.parentElement;
    cur = cur.appendChild(document.createElement('img'));
    cur.setAttribute('src', "./assets/images/fox.png");
    // eslint-disable-next-line no-undef
    this.menu = new Menu(this.root, this.state);
    // eslint-disable-next-line no-undef
    this.hud = new HUD(this.root, this.state);
    // eslint-disable-next-line no-undef
    this.board = new Board(this.root, this.state);
    // eslint-disable-next-line no-undef
    this.win = new Win(this.root, this.state);
  }
}
