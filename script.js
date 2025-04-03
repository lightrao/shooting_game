import * as THREE from 'three';

// --- DOM Elements ---
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restart-button');
const pauseButton = document.getElementById('pause-button');
const pausedMessage = document.getElementById('paused-message');
const canvas = document.getElementById('game-canvas');

// --- Game State ---
let score = 0;
let missedCount = 0;
const missLimit = 5;
let isGameOver = false;
let isPaused = false;
let balloons = []; // Array to hold active balloon meshes
const balloonSpawnRate = 1000; // ms
let spawnIntervalId = null;

// --- Three.js Setup ---
let scene, camera, renderer, raycaster, pointer;
let ambientLight, directionalLight;

// --- Balloon Properties ---
const balloonGeometry = new THREE.SphereGeometry(0.5, 32, 16); // Size 0.5 radius
const balloonMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xff0000 }), // Red
    new THREE.MeshStandardMaterial({ color: 0x0000ff }), // Blue
    new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // Green
    new THREE.MeshStandardMaterial({ color: 0xffff00 }), // Yellow
    new THREE.MeshStandardMaterial({ color: 0xffc0cb })  // Pink
];
const balloonSpeed = 0.02; // Units per frame in 3D space
const spawnArea = { width: 10, height: 10, depth: 5 }; // Define spawn area dimensions
const despawnY = 10; // Y position where balloons are considered missed

function initThree() {
    // Scene
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x87CEEB); // Set background color if needed (or use CSS)

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15; // Move camera back

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); // Use alpha for CSS background
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lighting
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft white light
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Stronger directional light
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Raycaster for clicking
    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    canvas.addEventListener('pointerdown', onPointerDown); // Use pointerdown for better mobile/touch
    restartButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPointerDown(event) {
    if (isGameOver || isPaused) return;

    // Calculate pointer position in normalized device coordinates (-1 to +1)
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(balloons);

    if (intersects.length > 0) {
        // Find the actual balloon mesh (could be children if using groups)
        let clickedBalloon = intersects[0].object;
        while (clickedBalloon && !clickedBalloon.userData.isBalloon) {
             clickedBalloon = clickedBalloon.parent;
        }
        if (clickedBalloon && clickedBalloon.userData.isBalloon) {
             shootBalloon(clickedBalloon);
        }
    }
}

function createBalloon() {
    if (isGameOver || isPaused) return;

    const material = balloonMaterials[Math.floor(Math.random() * balloonMaterials.length)];
    const balloon = new THREE.Mesh(balloonGeometry, material);

    // Initial position (random X/Z at bottom, Y below view)
    balloon.position.x = (Math.random() - 0.5) * spawnArea.width;
    balloon.position.y = -spawnArea.height / 2 - 1; // Start below view
    balloon.position.z = (Math.random() - 0.5) * spawnArea.depth;

    // Custom data for identification and movement
    balloon.userData = {
        isBalloon: true,
        driftSpeedX: (Math.random() - 0.5) * 0.01, // Small initial drift
        driftSpeedZ: (Math.random() - 0.5) * 0.01
        // Add drift change logic similar to 2D if desired
    };

    balloons.push(balloon);
    scene.add(balloon);
}

function shootBalloon(balloon) {
    if (isGameOver || isPaused) return;

    // Remove from scene and array
    scene.remove(balloon);
    balloons = balloons.filter(b => b !== balloon);

    // Clean up geometry and material if necessary (important for performance in long games)
    // balloon.geometry.dispose();
    // balloon.material.dispose(); // Only if material is unique per balloon

    updateScore(1);
    // TODO: Add 3D pop effect here (e.g., particle system)
}

function handleMissedBalloon() {
    if (isGameOver || isPaused) return;
    missedCount++;
    updateMissedDisplay();
    if (missedCount >= missLimit) {
        gameOver();
    }
}

function updateScore(change) {
    if (isGameOver) return;
    score += change;
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateMissedDisplay() {
    missedDisplay.textContent = `Missed: ${missedCount} / ${missLimit}`;
}

function gameOver() {
    if (isGameOver) return;
    isGameOver = true;
    isPaused = false;
    pauseButton.textContent = 'Pause';
    pauseButton.disabled = true;
    pausedMessage.classList.add('hidden');

    if (spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = null;

    gameOverMessage.classList.remove('hidden');
}

function startGame() {
    isGameOver = false;
    isPaused = false;
    score = 0;
    missedCount = 0;
    updateScore(0);
    updateMissedDisplay();

    gameOverMessage.classList.add('hidden');
    pausedMessage.classList.add('hidden');
    pauseButton.textContent = 'Pause';
    pauseButton.disabled = false;

    // Clear existing balloons
    balloons.forEach(balloon => scene.remove(balloon));
    balloons = [];

    // Start spawning
    if (spawnIntervalId) clearInterval(spawnIntervalId);
    spawnIntervalId = setInterval(createBalloon, balloonSpawnRate);

    // Start animation loop if not already running (or restart if needed)
    // animate(); // Called once globally below
}

function togglePause() {
    if (isGameOver) return;
    isPaused = !isPaused;

    if (isPaused) {
        pauseButton.textContent = 'Resume';
        pausedMessage.classList.remove('hidden');
        if (spawnIntervalId) clearInterval(spawnIntervalId); // Stop spawning
        spawnIntervalId = null;
    } else {
        pauseButton.textContent = 'Pause';
        pausedMessage.classList.add('hidden');
        // Restart spawning
        if (!spawnIntervalId) {
             spawnIntervalId = setInterval(createBalloon, balloonSpawnRate);
        }
    }
}

function animate() {
    requestAnimationFrame(animate); // Loop

    if (!isPaused && !isGameOver) {
        // Update balloon positions
        for (let i = balloons.length - 1; i >= 0; i--) {
            const balloon = balloons[i];

            // Move up
            balloon.position.y += balloonSpeed;

            // Apply drift (simple version)
            balloon.position.x += balloon.userData.driftSpeedX;
            balloon.position.z += balloon.userData.driftSpeedZ;

            // TODO: Add more complex drift change logic if needed

            // Boundary checks (optional for X/Z drift)

            // Check if missed (gone off top)
            if (balloon.position.y > despawnY) {
                scene.remove(balloon);
                balloons.splice(i, 1); // Remove from array
                handleMissedBalloon();
            }
        }
    }

    // Render the scene
    renderer.render(scene, camera);
}

// --- Initialization ---
initThree();
startGame();
animate(); // Start the animation loop
