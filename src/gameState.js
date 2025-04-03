import * as UIManager from './uiManager.js';
import * as Constants from './constants.js';

// --- Game State Variables ---
let score = 0;
let missedCount = 0;
let isGameOver = false;
let isPaused = false;
let spawnIntervalId = null; // Keep track of the spawn interval

// --- State Accessors (Getters) ---
export function getScore() { return score; }
export function getMissedCount() { return missedCount; }
export function getIsGameOver() { return isGameOver; }
export function getIsPaused() { return isPaused; }
export function getSpawnIntervalId() { return spawnIntervalId; }
export function setSpawnIntervalId(id) { spawnIntervalId = id; }

// --- State Modifiers ---
export function resetGame() {
    score = 0;
    missedCount = 0;
    isGameOver = false;
    isPaused = false;
    UIManager.updateScoreDisplay(score);
    UIManager.updateMissedDisplay(missedCount, Constants.MISS_LIMIT);
    UIManager.hideGameOver();
    UIManager.hidePausedMessage(); // Ensure paused message is hidden on start
}

export function incrementScore(points = 1) {
    if (isGameOver || isPaused) return;
    score += points;
    UIManager.updateScoreDisplay(score);
}

export function incrementMissed() {
    if (isGameOver || isPaused) return;
    missedCount++;
    UIManager.updateMissedDisplay(missedCount, Constants.MISS_LIMIT);
    if (missedCount >= Constants.MISS_LIMIT) {
        triggerGameOver();
    }
}

export function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    isPaused = false; // Ensure not paused
    if (spawnIntervalId) {
        clearInterval(spawnIntervalId);
        spawnIntervalId = null;
    }
    UIManager.showGameOver(score); // Pass final score
}

export function togglePauseState(stopSpawningCallback, resumeSpawningCallback) {
    if (isGameOver) return;
    isPaused = !isPaused;

    if (isPaused) {
        UIManager.showPausedMessage();
        stopSpawningCallback(); // Tell main script to stop spawning interval
    } else {
        UIManager.hidePausedMessage();
        resumeSpawningCallback(); // Tell main script to resume spawning
    }
}
