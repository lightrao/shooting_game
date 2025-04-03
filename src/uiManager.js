// --- DOM Element References ---
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restart-button');
const pauseButton = document.getElementById('pause-button');
const pausedMessage = document.getElementById('paused-message');

// --- UI Update Functions ---
export function updateScoreDisplay(score) {
    scoreDisplay.textContent = `Score: ${score}`;
}

export function updateMissedDisplay(missedCount, missLimit) {
    missedDisplay.textContent = `Missed: ${missedCount} / ${missLimit}`;
}

export function showGameOver(finalScore) {
    // Optionally display final score in the message
    gameOverMessage.querySelector('h2').textContent = `Game Over! Score: ${finalScore}`;
    gameOverMessage.classList.remove('hidden');
    pauseButton.disabled = true; // Disable pause when game over
}

export function hideGameOver() {
    gameOverMessage.classList.add('hidden');
    pauseButton.disabled = false; // Re-enable pause button
}

export function showPausedMessage() {
    pausedMessage.classList.remove('hidden');
    pauseButton.textContent = 'Resume';
}

export function hidePausedMessage() {
    pausedMessage.classList.add('hidden');
    pauseButton.textContent = 'Pause';
}

// --- Event Listener Setup ---
export function setupButtonListeners(startGameCallback, togglePauseCallback) {
    restartButton.addEventListener('click', startGameCallback);
    pauseButton.addEventListener('click', togglePauseCallback);
}

export function setupCanvasClickListener(canvas, clickCallback) {
     canvas.addEventListener('pointerdown', clickCallback);
}
