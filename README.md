# 3D Balloon Shooter Game

## Description

This is a simple web-based 3D game built using HTML, CSS, JavaScript, and the Three.js library. The objective is to shoot balloons as they float upwards by clicking on them.

## Features

*   **3D Rendering:** The game environment and balloons are rendered in 3D using Three.js.
*   **Balloon Mechanics:** Randomly colored balloons spawn at the bottom and float upwards with a natural, gentle drifting motion.
*   **Shooting:** Players can shoot balloons by clicking on them. Click detection is handled using Three.js raycasting.
*   **Scoring:** A score is kept, incrementing each time a balloon is successfully shot.
*   **Game Over:** The game ends if the player misses 5 balloons (lets them float off the top). A "Game Over" message is displayed.
*   **Pause/Resume:** Players can pause the game using the "Pause" button and resume using the "Resume" button.
*   **Restart:** A "Restart" button appears on the game over screen, allowing the player to start a new game.
*   **Crosshair Cursor:** The mouse cursor changes to a crosshair when hovering over the game canvas.

## How to Run

1.  Ensure you have a modern web browser that supports WebGL and ES Modules (e.g., Chrome, Firefox, Edge, Safari).
2.  Clone or download the project files.
3.  Open the `index.html` file directly in your web browser.

No build steps or local server are strictly required for this basic version, as it uses ES module imports directly from a CDN.

## Code Structure

*   `index.html`: Main HTML file, includes the canvas and UI elements.
*   `style.css`: Styles for the UI elements and canvas container.
*   `script.js`: The main entry point, imports modules and orchestrates the game loop and interactions.
*   `src/`: Directory containing the JavaScript modules:
    *   `constants.js`: Defines game constants (speed, limits, colors, etc.).
    *   `sceneSetup.js`: Initializes the Three.js scene, camera, renderer, lights.
    *   `uiManager.js`: Handles updates and interactions with HTML UI elements.
    *   `gameState.js`: Manages core game state (score, missed, pause/game over status).
    *   `balloonManager.js`: Manages the creation, movement, and removal of 3D balloons.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES Modules - modular structure in `src/`)
*   Three.js (r163 via CDN)

## Potential Future Improvements

*   Add sound effects for shooting and popping balloons.
*   Implement a more visually appealing 3D pop animation (e.g., particle effect).
*   Introduce difficulty scaling (e.g., increasing balloon speed or spawn rate over time).
*   Add different types of balloons with varying speeds or point values.
*   Refine lighting and add a more detailed 3D background/environment.
