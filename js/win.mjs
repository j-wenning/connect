// eslint-disable-next-line no-unused-vars
class Win {
  constructor(root, state) {
    this.root = root;
    this.curPlayer = state.curPlayer;
    this.render();
    this.update(state);
  }

  toggle() {
    let cur = document.querySelector('#win').parentElement;
    cur.classList.toggle('closed');
  }

  update(state) {
    const { curPlayer } = state;
    let cur = document.querySelector('#winner');
    if (curPlayer !== this.curPlayer) {
      this.curPlayer = curPlayer;
      cur.textContent = plrToWinStr(this.curPlayer);
    }
  }

  render() {
    let cur = document.querySelector('#win');
    if (cur){
      cur = cur.parentElement;
      cur.innerHTML = '';
    } else {
      cur = this.root.appendChild(document.createElement('div'));
      cur.classList.add('shade', 'closed');
    }
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'win';
    cur.classList.add('overlay');
    cur = cur.appendChild(document.createElement('h1'));
    cur.id = 'winner';
    cur.textContent = plrToWinStr(this.curPlayer);
    cur = cur.parentElement.appendChild(document.createElement('button'));
    cur.id = 'newGameButton';
    cur.textContent = 'new game';
  }
}

function plrToWinStr(player) {
  if (player === null) return "Draw!";
  return `Player ${player + 1} Wins!`;
}
