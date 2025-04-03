import * as THREE from 'three';
import * as SceneSetup from './src/sceneSetup.js';
import * as Constants from './src/constants.js';
import * as UIManager from './src/uiManager.js';
import * as GameState from './src/gameState.js';
import * as BalloonManager from './src/balloonManager.js';

// --- Initialization ---
const canvas = document.getElementById('game-canvas');
if (!canvas) {
    console.error("Canvas element not found!");
} else {
    const { scene, camera, renderer, raycaster, pointer } = SceneSetup.initThreeScene(canvas);

    // --- Game Logic Functions ---
    function startGame() {
        GameState.resetGame();
        BalloonManager.removeAllBalloons(scene); // Clear any previous balloons

        // Stop existing spawn interval if any
        const currentIntervalId = GameState.getSpawnIntervalId();
        if (currentIntervalId) {
            clearInterval(currentIntervalId);
        }

        // Start new spawn interval
        const newIntervalId = setInterval(() => BalloonManager.createAndAddBalloon(scene), Constants.BALLOON_SPAWN_RATE);
        GameState.setSpawnIntervalId(newIntervalId);
    }

    function stopSpawning() {
        const intervalId = GameState.getSpawnIntervalId();
        if (intervalId) {
            clearInterval(intervalId);
            GameState.setSpawnIntervalId(null);
        }
    }

    function resumeSpawning() {
         // Clear static balloons before resuming (as per original pause logic)
        BalloonManager.removeAllBalloons(scene);

        if (!GameState.getSpawnIntervalId() && !GameState.getIsGameOver()) {
             const newIntervalId = setInterval(() => BalloonManager.createAndAddBalloon(scene), Constants.BALLOON_SPAWN_RATE);
             GameState.setSpawnIntervalId(newIntervalId);
        }
    }

    function togglePause() {
        GameState.togglePauseState(stopSpawning, resumeSpawning);
    }

    function handleCanvasClick(event) {
        if (GameState.getIsGameOver() || GameState.getIsPaused()) return;

        // Calculate pointer position
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(BalloonManager.getActiveBalloons());

        if (intersects.length > 0) {
            let clickedBalloon = intersects[0].object;
             // Ensure we get the balloon mesh if it's part of a group
            while (clickedBalloon && !clickedBalloon.userData.isBalloon) {
                 clickedBalloon = clickedBalloon.parent;
            }
            if (clickedBalloon && clickedBalloon.userData.isBalloon) {
                BalloonManager.removeBalloon(clickedBalloon, scene);
                GameState.incrementScore();
                // TODO: Add 3D pop effect
            }
        }
    }

    // --- Setup UI Listeners ---
    UIManager.setupButtonListeners(startGame, togglePause);
    UIManager.setupCanvasClickListener(canvas, handleCanvasClick);

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        // Update game elements only if not paused/game over
        if (!GameState.getIsPaused() && !GameState.getIsGameOver()) {
            BalloonManager.updateBalloonPositions(scene);
        }

        // Always render
        renderer.render(scene, camera);
    }

    // --- Start Game ---
    startGame(); // Initial game start
    animate();   // Start the rendering loop
}
