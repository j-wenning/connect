//eslint-disable-next-line no-unused-vars
class App {
  constructor(root) {
    this.root = root;
    this.settings = {
      boardX: 10,
      boardY: 10
    }
    //eslint-disable-next-line no-undef
    this.menu = new Menu(root, this.settings);
    //eslint-disable-next-line no-undef
    this.board = new Board(root, this.settings);
  }
}
