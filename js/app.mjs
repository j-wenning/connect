// eslint-disable-next-line no-unused-vars
class App {
  constructor(root) {
    this.root = root;
    this.state = {
      boardX: 10,
      boardY: 10,
      scores: [0, 0],
      tokens: ['fox-token', 'falco-token'],
      curPlayer: 0,
      curTime: 500
    }
    this.menu = this.scores = this.board = this.win = null;
    this.render();
    document.addEventListener('click', e => this.handleClick(e));
    document.addEventListener('submit', e => this.handleSubmit(e));
    document.addEventListener('mouseover', e => this.handleMouseover(e));
  }

  handleClick(e) {
    e = e.target;
    if (e.id === 'openMenuButton' || e.id === 'closeMenuButton') this.menu.toggle();
    else if (e.classList.contains('slot')) {
      this.board.updateSlot(e.getAttribute('data-index'), this.state.curPlayer);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    // apply settings from form
  }

  handleMouseover(e) {
    // activate and deactivate hover effects
  }

  update() {
    ('menu, scores, board, win')
      .split(', ')
      .forEach(item => {
        this[item].update();
      });
  }

  render() {
    // eslint-disable-next-line no-undef
    this.menu = new Menu(this.root, this.state);
    // eslint-disable-next-line no-undef
    this.scores = new HUD(this.root, this.state);
    // eslint-disable-next-line no-undef
    this.board = new Board(this.root, this.state);
    // eslint-disable-next-line no-undef
    this.win = new Win(this.root, this.state);
  }
}
