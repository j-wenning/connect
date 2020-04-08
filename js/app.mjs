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
      winCon: 4
    }
    this.menu = this.hud = this.board = this.win = null;
    this.render();
    document.addEventListener('click', e => this.handleClick(e));
    document.addEventListener('submit', e => this.handleSubmit(e));
    document.addEventListener('mouseover', e => this.handleMouseover(e));
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
    if (this.state.maxTime !== 0) {
      // eslint-disable-next-line no-undef
      if (this.state.curTime >= -TIME_OFFSET * 2) --this.state.curTime;
      else this.setNextPlayer();
      this.update('hud');
    }
  }

  handleClick(e) {
    e = e.target;
    if (e.id === 'openMenuButton' || e.id === 'closeMenuButton') this.menu.toggle();
    else if (e.id === 'newGameButton') {
      // eslint-disable-next-line no-undef
      this.board = new Board(this.root, this.state);
      this.state.curPlayer = 0;
      this.win.toggle();
      this.update('hud');
    }
    else if (e.classList.contains('slot')) {
      const index = Number(e.getAttribute('data-index'));
      switch (this.board.updateSlot(index, this.state.curPlayer)) {
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
    // apply settings from form
  }

  handleMouseover(e) {
    // activate and deactivate hover effects
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
