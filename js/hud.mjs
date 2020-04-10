// eslint-disable-next-line no-unused-vars
class HUD {
  constructor(root, state) {
    const { curPlayer, maxTime, curTime, scores, tokens } = state;
    this.root = root;
    this.curPlayer = curPlayer;
    this.maxTime = maxTime;
    this.curTime = curTime;
    this.scores = [...scores];
    this.tokens = [...tokens];
    this.render();
    this.update(state);
  }

  update(state) {
    const { curPlayer, maxTime, curTime, scores, tokens } = state;
    let cur;
    if (this.scores.toString() !== scores.toString()) {
      for (let i = 0; i < scores.length; ++i) {
        if (this.scores[i] !== scores[i]) {
          cur = document.querySelector(`#score${i} h2`);
          cur.textContent = `[${scores[i]}]`;
          this.scores[i] = scores[i];
        }
      }
    }
    if (this.tokens.toString() !== tokens.toString()) {
      for (let i = 0; i < tokens.length; ++i) {
        if (this.tokens[i] !== tokens[i]) {
          cur = document.querySelector(`#score${i} div`).classList;
          cur.replace(cur[cur.length - 1], tokens[i]);
          this.tokens[i] = tokens[i];
        }
      }
      cur = true;
    }
    if (curPlayer !== this.curPlayer || cur) {
      this.curPlayer = curPlayer;
      cur = document.querySelector('#stateToken').classList;
      cur.replace(cur[cur.length - 1], this.tokens[this.curPlayer]);
    }
    if (maxTime !== this.maxTime) this.maxTime = maxTime;
    if (curTime !== this.curTime) {
      this.curTime = curTime;
      cur = document.querySelector('#stateTime');
      cur.textContent = msToSecStr(this.curTime, this.maxTime);
    }
  }

  render() {
    let cur = document.querySelector('#hud');
    if (cur) cur.innerHTML = '';
    else {
      cur = this.root.appendChild(document.createElement('div'));
      cur.id = 'hud';
      cur.classList.add('overlay');
    }
    cur = cur.appendChild(document.createElement('button'));
    cur.id = 'openMenuButton';
    cur.classList.add('menu-button');
    cur.textContent = 'menu';
    cur = cur.parentElement.appendChild(document.createElement('div'));
    cur.id = 'scores';
    this.scores.forEach((val, i) => {
      cur = cur.appendChild(document.createElement('div'));
      cur.id = `score${i}`;
      cur.classList.add('score');
      cur = cur.appendChild(document.createElement('h1'));
      cur.textContent = `Player ${i + 1}`;
      cur = cur.parentElement.appendChild(document.createElement('div'));
      cur.classList.add('details');
      cur = cur.appendChild(document.createElement('h2'));
      cur.textContent = `[${val}]`
      cur = cur.parentElement.appendChild(document.createElement('div'));
      cur.classList.add('score-token', 'token', this.tokens[i]);
      cur = cur.parentElement.parentElement.parentElement;
    });
    cur = cur.parentElement.appendChild(document.createElement('div'));
    cur.id = 'states';
    cur = cur.appendChild(document.createElement('div'));
    cur.id = 'stateToken';
    cur.classList.add('state-token', 'token', this.tokens[this.curPlayer]);
    cur = cur.parentElement.appendChild(document.createElement('h1'));
    cur.id = 'stateTime';
    cur.classList.add('state-time');
    cur.textContent = msToSecStr(this.curTime, this.maxTime);
  }
}

function msToSecStr(ms, min) {
  if (ms === null || min === null) return '';
  return (Math.max(0, Math.min(min, ms)) / 100).toFixed(2).replace('.', ':');
}
