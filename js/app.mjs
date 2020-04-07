//eslint-disable-next-line no-unused-vars
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
    this.render();
  }

  render() {
    //eslint-disable-next-line no-undef
    this.menu = new Menu(this.root, this.state);
    //eslint-disable-next-line no-undef
    this.menu = new Scores(this.root, this.state);
    //eslint-disable-next-line no-undef
    this.board = new Board(this.root, this.state);
  }
}
