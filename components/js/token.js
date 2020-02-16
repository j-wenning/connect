class Token {
  constructor(val, x, h, w) {
    this.val = val;
    this.elem = this.createElement(x, h, w);
  }

  createElement(x, h, w) {
    const elem = document.createElement("div");

    elem.setAttribute("style", `flex-basis: ${100 / w}%;`)
    elem.setAttribute("data-x", x);
    elem.classList.add("token", "empty", x % 2 ? "odd" : "even");
    return elem;
  }
}
