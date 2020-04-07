// eslint-disable-next-line no-unused-vars
class HUD {
  constructor(root, state) {
    this.root = root;
    this.players = state.scores.map((val, i) => ({
      id: i,
      score: val,
      token: state.tokens[i]
    }));
    this.curPlayer = this.curTime = null;
    this.render();
    this.update(state.tokens[state.curPlayer], state.curTime);
  }

  update(player, time) {
    let cur;
    if (this.curPlayer !== player) {
      this.curPlayer = player;
      cur = document.querySelector('#stateToken').classList;
      cur.replace(cur[cur.length - 1], player);
    }
    if (this.curTime !== time) {
      this.curTime = time;
      cur = document.querySelector('#stateToken');
      cur.textContent = msToSecStr(this.curTime);
    }
  }

  render() {
    let cur = this.root.appendChild(document.createElement('div'));
    cur.id = 'hud';
    cur.classList.add('section');
    this.players.forEach(val => {
      cur = cur.appendChild(document.createElement('div'));
      cur.id = `score${val.id}`;
      cur.classList.add('score');
      cur = cur.appendChild(document.createElement('h1'));
      cur.textContent = `Player ${val.id + 1}`;
      cur = cur.parentElement;
      cur = cur.appendChild(document.createElement('h2'));
      cur.textContent = `[${val.score}]`
      cur = cur.parentElement;
      cur = cur.appendChild(document.createElement('div'));
      cur.classList.add('score-token', val.token);
      cur = cur.parentElement.parentElement;
    });
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'states';
    cur.classList.add('section');
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'stateToken';
    cur.classList.add('state-token', this.curPlayer);
    cur = cur.parentElement;
    cur = cur.appendChild(document.createElement('h1'));
    cur.id = 'stateTime';
    cur.classList.add('state-time');
    cur.textContent = msToSecStr(this.curTime);
  }
}

function msToSecStr(ms) {
  if (ms === null) return '';
  return (ms / 100).toFixed(2).replace('.', ':');
}
