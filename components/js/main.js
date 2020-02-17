const EMPTY = null;
const TIME_OFFSET = 35;
const TOKENS = [
  "fox-token",
  "falco-token",
  "slippy-token",
  "krystal-token",
  "andross-token",
  "peppy-token"
]; // new tokens must also be added to css
const PLAYERS = [];
for(let i = 0; i < TOKENS.length; ++i)
  PLAYERS.push(`Player ${i + 1}`);

const game = new GameManager();
