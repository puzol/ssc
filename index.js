document.addEventListener("DOMContentLoaded", () => {
  const players = Array.from(document.querySelectorAll(".player"));
  if (players.length !== 2) return;

  const [a, b] = players.map(createPlayer);
  wirePlayer(players[0], a, b);
  wirePlayer(players[1], b, a);
});

function createPlayer(playerEl) {
  let score = 0;
  const undoStack = [];
  const redoStack = [];

  const scoreEl = playerEl.querySelector(".player-score");

  function render() {
    scoreEl.textContent = String(score).padStart(3, "0");
  }

  function applyDelta(delta) {
    score += delta;
    undoStack.push(delta);
    redoStack.length = 0;
    render();
  }

  function undo() {
    if (undoStack.length === 0) return;
    const delta = undoStack.pop();
    score -= delta;
    redoStack.push(delta);
    render();
  }

  function redo() {
    if (redoStack.length === 0) return;
    const delta = redoStack.pop();
    score += delta;
    undoStack.push(delta);
    render();
  }

  return { applyDelta, undo, redo, render };
}

function wirePlayer(playerEl, selfState, opponentState) {
  playerEl.querySelectorAll(".score-value").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = Number(btn.dataset.value);
      if (!Number.isFinite(v)) return;
      selfState.applyDelta(v);
    });
  });

  playerEl.querySelectorAll(".foul-value").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = Number(btn.dataset.value);
      if (!Number.isFinite(v)) return;
      opponentState.applyDelta(v);
    });
  });

  playerEl.querySelector(".undo-button").addEventListener("click", () => {
    selfState.undo();
  });
  playerEl.querySelector(".redo-button").addEventListener("click", () => {
    selfState.redo();
  });

  selfState.render();
}
