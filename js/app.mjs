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
      curTime: 500,
      winCon: 4,
      curSelect: 0
    }
    this.menu = this.hud = this.board = this.win = null;
    this.render();
    document.addEventListener('click', e => this.handleClick(e));
    document.addEventListener('submit', e => this.handleSubmit(e));
    document.addEventListener('mousemove', e => this.handleMousemove(e));
    document.addEventListener('change', e => this.handleChange(e));
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
    if (this.state.maxTime !== null) {
      // eslint-disable-next-line no-undef
      if (this.state.curTime >= -TIME_OFFSET * 2) --this.state.curTime;
      else this.setNextPlayer();
      this.update('hud');
    }
  }

  handleClick(e) {
    let cur = e.target;
    if (cur.id === 'openMenuButton' || cur.id === 'closeMenuButton') this.menu.toggle();
    else if (cur.id === 'newGameButton') {
      // eslint-disable-next-line no-undef
      this.board = new Board(this.root, this.state);
      this.state.curPlayer = 0;
      this.win.toggle();
      this.update('hud');
    } else if (cur.classList.contains('selection-button')) {
      const token = cur.classList[cur.classList.length - 1];
      if (!this.state.tokens.includes(token)) {
        const old = document.querySelector(`[data-value="${this.state.curSelect}"]`);
        old.removeAttribute('data-value');
        cur.setAttribute('data-value', this.state.curSelect);
        old.textContent = '';
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
          break;
        case 'win':
          ++this.state.scores[this.state.curPlayer];
          this.update('win, hud');
          this.win.toggle();
          break;
        case 'next':
          this.setNextPlayer();
          break;
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleMousemove(e) {
    e = e.target;
    if (e.classList.contains('slot')) {
      this.board.updateSlot(Number(e.getAttribute('data-index')), 'highlight');
    } else this.board.updateSlot(null, null);
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
