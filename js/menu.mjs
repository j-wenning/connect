class Menu {
  constructor(root){
    this.root = root;
    this.render();
  }

  render() {
    let cur = document.createElement('div');
    this.root.appendChild(cur);
    cur.classList.add("menu");
  }
}
