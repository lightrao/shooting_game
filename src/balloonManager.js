import * as THREE from 'three';
import * as Constants from './constants.js';
import * as GameState from './gameState.js'; // Needed for checking game state

let activeBalloons = []; // Internal list of balloon meshes

export function createAndAddBalloon(scene) {
    if (GameState.getIsGameOver() || GameState.getIsPaused()) return null;

    const material = Constants.BALLOON_MATERIALS[Math.floor(Math.random() * Constants.BALLOON_MATERIALS.length)];
    const balloon = new THREE.Mesh(Constants.BALLOON_GEOMETRY, material.clone()); // Clone material if changing properties later

    // Initial position
    balloon.position.x = (Math.random() - 0.5) * Constants.SPAWN_AREA.width;
    balloon.position.y = -Constants.SPAWN_AREA.height / 2 - 1; // Start below view
    balloon.position.z = (Math.random() - 0.5) * Constants.SPAWN_AREA.depth;

    // Custom data
    balloon.userData = {
        isBalloon: true,
        driftSpeedX: (Math.random() * (Constants.DRIFT_SPEED_X_RANGE.max - Constants.DRIFT_SPEED_X_RANGE.min)) + Constants.DRIFT_SPEED_X_RANGE.min,
        driftSpeedZ: (Math.random() * (Constants.DRIFT_SPEED_Z_RANGE.max - Constants.DRIFT_SPEED_Z_RANGE.min)) + Constants.DRIFT_SPEED_Z_RANGE.min
        // TODO: Add drift change logic here if desired
    };

    activeBalloons.push(balloon);
    scene.add(balloon);
    return balloon; // Return the created balloon if needed elsewhere
}

export function updateBalloonPositions(scene) {
    if (GameState.getIsPaused() || GameState.getIsGameOver()) return; // Don't move if paused or game over

    for (let i = activeBalloons.length - 1; i >= 0; i--) {
        const balloon = activeBalloons[i];

        // Move up
        balloon.position.y += Constants.BALLOON_SPEED;

        // Apply drift
        balloon.position.x += balloon.userData.driftSpeedX;
        balloon.position.z += balloon.userData.driftSpeedZ;

        // TODO: Implement boundary checks for drift if needed

        // Check if missed
        if (balloon.position.y > Constants.DESPAWN_Y) {
            removeBalloon(balloon, scene); // Remove the missed balloon
            GameState.incrementMissed(); // Increment missed count via gameState
        }
    }
}

export function removeBalloon(balloon, scene) {
    scene.remove(balloon);
    activeBalloons = activeBalloons.filter(b => b !== balloon);

    // Optional cleanup (important for complex scenes/long play)
    // if (balloon.geometry) balloon.geometry.dispose();
    // if (balloon.material) balloon.material.dispose();
}

export function removeAllBalloons(scene) {
     activeBalloons.forEach(balloon => scene.remove(balloon));
     activeBalloons = [];
}

export function getActiveBalloons() {
    return activeBalloons; // Provide access to the list if needed (e.g., for raycasting)
}
