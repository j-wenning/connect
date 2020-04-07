// eslint-disable-next-line no-unused-vars
class Win {
  constructor(root, state) {
    this.root = root;
    this.curPlayer = null;
    this.render();
    this.update(state);
  }

  update(state) {
    const { curPlayer } = state;
    let cur = document.querySelector('#winner');
    if(curPlayer !== this.curPlayer) {
      this.curPlayer = curPlayer;
      cur.textContent = plrToWinStr(this.curPlayer);
    }
  }

  render() {
    let cur = this.root.appendChild(document.createElement('div'));
    cur.classList.add('shade');
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'win';
    cur.classList.add('section');
    cur = cur.appendChild(document.createElement('h1'));
    cur.id = 'winner';
    cur.textContent = plrToWinStr(this.curPlayer);
    cur = cur.parentElement;
    cur = cur.appendChild(document.createElement('button'));
    cur.id = 'newGameButton';
    cur.textContent = 'new game';
  }
}

function plrToWinStr(player) {
  if (player === null) return "Game Over.";
  return `Player ${player + 1} Wins!`;
}
