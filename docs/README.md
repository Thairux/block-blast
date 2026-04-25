# Aether Documentation

Welcome to the Aether developer and user documentation. Aether is a celestial block-placing platform focused on strategic depth and visual precision.

## Core Concepts

Aether operates on a grid-based spatial management system. Players interact with "Pieces" composed of "Blocks" to create complete lines.

### Backtracking Engine (Infinite Mode)

The heart of Aether's survival capability is our recursive backtracking solver. 

- **Verification:** Every hand is simulated in all $3!$ permutations.
- **Pathfinding:** For each permutation, the engine exhaustively searches for a valid placement sequence that results in a non-terminal board state.
- **Safety Fallback:** If $P(\text{survival}) = 0$, the engine generates an adaptive hand containing higher entropy of low-complexity pieces (e.g., 1x1 survival blocks).

## Graphics & Rendering

Aether uses a custom-built 3D Shader-like approach via CSS/Style-based border mitigation.

### 3D Bevel Logic
Each block is rendered with a 4-point mitered bevel:
- **High-light (Top/Left):** Dynamic lightening based on base hex value.
- **Shadow (Bottom/Right):** Static darkening to simulate celestial depth.
- **Miter Joints:** Accomplished via the "Border Trick" to ensure sharp diagonal intersections at any resolution.

## Game Modes

### Infinite Mode
The Infinite mode is a bounded-play experiment. It is mathematically designed to be indestructible. 
- **The Challenge:** Unlike traditional games where you try to win, here we invite you to try and fail. The engine is optimized to mitigate player errors and ensure the "Loop" continues.

### Classic Mode
A standard competitive mode with high-entropy piece generation. No survival guarantees are provided.

### Puzzle Mode
Objective-based gameplay. Success is defined by the collection of specific "Gems" embedded within the grid topology.

---

## Deployment & Hosting

Aether is deployed automatically via GitHub Actions to GitHub Pages.

- **URL:** [https://thairux.github.io/block-blast/](https://thairux.github.io/block-blast/)
- **Versioning:** Synchronized with `app.json` through the `release-web.yml` workflow.
