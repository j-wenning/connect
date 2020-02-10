class Token {
  constructor(val, x, h, w) {
    this.val = val;
    this.elem = this.createElement(x, h, w);
  }

  createElement(x, h, w) {
    const elem = document.createElement("div");

    elem.setAttribute("data-x", x);
    elem.setAttribute(
      "style", `width: ${100 / w}%; height: ${100 / h}%;`);
    elem.classList.add("token", "empty");
    return elem;
  }
}
