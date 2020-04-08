// eslint-disable-next-line no-unused-vars
class HUD {
  constructor(root, state) {
    const { curPlayer, curTime, scores, tokens } = state;
    this.root = root;
    this.curPlayer = curPlayer;
    this.curTime = curTime;
    this.scores = [...scores];
    this.tokens = [...tokens];
    this.render();
    this.update(state);
  }

  update(state) {
    const { curPlayer, curTime, scores, tokens } = state;
    let cur;
    if (this.scores.toString() !== state.scores.toString()) {
      this.scores = [...scores];
      this.scores.forEach((val, i) => {
        cur = document.querySelector(`#score${i} h2`);
        cur.textContent = `[${val}]`;
      });
    }
    if (this.tokens.toString() !== state.tokens.toString()) {
      this.tokens = [...tokens];
      this.tokens.forEach((val, i) => {
        cur = document.querySelector(`#score${i} div`).classList;
        cur.replace(cur[cur.length - 1], val);
      });
    }
    if (curPlayer !== this.curPlayer) {
      this.curPlayer = curPlayer;
      console.log(curPlayer)
      cur = document.querySelector('#stateToken').classList;
      cur.replace(cur[cur.length - 1], this.tokens[this.curPlayer]);
    }
    if (curTime !== this.curTime) {
      this.curTime = curTime;
      cur = document.querySelector('#stateTime');
      cur.textContent = msToSecStr(this.curTime);
    }
  }

  render() {
    let cur = document.querySelector('#hud');
    if (cur) cur.innerHTML = '';
    else {
      cur = this.root.appendChild(document.createElement('div'));
      cur.id = 'hud';
      cur.classList.add('section');
    }
    cur = cur.appendChild(document.createElement('button'));
    cur.id = 'openMenuButton';
    cur.classList.add('menu-button');
    cur.textContent = 'open';
    cur = cur.parentElement;
    this.scores.forEach((val, i) => {
      cur = cur.appendChild(document.createElement('div'));
      cur.id = `score${i}`;
      cur.classList.add('score');
      cur = cur.appendChild(document.createElement('h1'));
      cur.textContent = `Player ${i + 1}`;
      cur = cur.parentElement;
      cur = cur.appendChild(document.createElement('h2'));
      cur.textContent = `[${val}]`
      cur = cur.parentElement;
      cur = cur.appendChild(document.createElement('div'));
      cur.classList.add('score-token', 'token', this.tokens[i]);
      cur = cur.parentElement.parentElement;
    });
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'states';
    cur.classList.add('section');
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'stateToken';
    cur.classList.add('state-token', 'token', this.tokens[this.curPlayer]);
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
