import * as THREE from 'three';

// Game Settings
export const MISS_LIMIT = 5;
export const BALLOON_SPAWN_RATE = 1000; // ms
export const BALLOON_SPEED = 0.02; // Units per frame
export const DESPAWN_Y = 10; // Y position where balloons are missed

// Balloon Visuals
export const BALLOON_GEOMETRY = new THREE.SphereGeometry(0.5, 32, 16); // Size 0.5 radius
export const BALLOON_MATERIALS = [
    new THREE.MeshStandardMaterial({ color: 0xff0000 }), // Red
    new THREE.MeshStandardMaterial({ color: 0x0000ff }), // Blue
    new THREE.MeshStandardMaterial({ color: 0x00ff00 }), // Green
    new THREE.MeshStandardMaterial({ color: 0xffff00 }), // Yellow
    new THREE.MeshStandardMaterial({ color: 0xffc0cb })  // Pink
];

// Movement/Spawn Area
export const SPAWN_AREA = { width: 10, height: 10, depth: 5 };
export const DRIFT_SPEED_X_RANGE = { min: -0.005, max: 0.005 }; // Adjusted for potentially slower drift
export const DRIFT_SPEED_Z_RANGE = { min: -0.005, max: 0.005 };
// Add drift change constants if implementing that logic later
