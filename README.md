# 🎮 Pathfinder

A browser-based maze navigation game built with vanilla JavaScript, HTML5 Canvas, and CSS3. Race against time to find the exit while collecting power-ups and avoiding traps across progressively challenging levels.

## 📋 Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Game Mechanics](#game-mechanics)
- [Technical Details](#technical-details)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)

## ✨ Features

- **Procedurally Generated Mazes**: Each level features a unique, algorithmically generated maze using recursive backtracking
- **Progressive Difficulty**: Mazes increase in size and complexity with each level
- **Dynamic Power-ups System**:
  - 🟡 **Coins**: Collect for points (+10 each)
  - 💚 **Health Packs**: Restore health (+30 HP)
  - 🔵 **Speed Boosts**: Temporarily increase movement speed
  - ⏱️ **Time Bonuses**: Add extra seconds to the timer (+10s)
  - 🔴 **Traps**: Avoid these to maintain health (-15 HP)
- **Real-time Game State**: Live HUD displaying level, score, timer, and health bar
- **Smooth Movement**: Responsive WASD/Arrow key controls with collision detection
- **Camera System**: Dynamic viewport that follows the player through larger mazes
- **Multiple Game States**: Menu, gameplay, level completion, and game over screens

### Prerequisites
- Node.js (v12 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pathfinder-game.git
   cd pathfinder-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server.js
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Alternative: Run Without Server
You can also open `index.html` directly in your browser for a simpler setup, though running through a server is recommended for best performance.

## 🎮 How to Play

### Controls
- **Arrow Keys** or **WASD**: Move your character
- Navigate through the maze to find the green EXIT
- Collect items and avoid traps along the way

### Objective
- Reach the EXIT before time runs out
- Maximize your score by collecting coins
- Survive by managing health and avoiding traps
- Progress through increasingly difficult levels

### Scoring System
- **Coins**: +10 points each
- **Time Bonus**: Remaining seconds × 5 points (awarded at level completion)
- **Level Progression**: Health partially restored between levels (+20 HP)

## 🎲 Game Mechanics

### Maze Generation
The game uses a **recursive backtracking algorithm** to generate unique, solvable mazes for each level:
- Ensures a valid path from start to exit
- Creates branching corridors and dead ends
- Scales in complexity based on current level

### Difficulty Scaling
As you progress:
- **Maze Size**: Increases from 19×14 to 29×19 cells
- **Timer**: Decreases from 90 seconds to 45 seconds minimum
- **Enemies**: More traps spawn per level (+1 per level)
- **Power-ups**: Additional speed boosts and time bonuses unlock

### Collision Detection
- **Precise Corner Checking**: Uses a margin-based system to check all four corners of the player
- **Item Collection**: Circular collision detection with distance-based calculations
- **Smooth Movement**: Sub-grid positioning for fluid character motion

## 🛠️ Technical Details

### Technologies Used
- **JavaScript (ES6+)**: Core game logic and mechanics
- **HTML5 Canvas**: Rendering engine for maze and game objects
- **CSS3**: UI styling with gradients and animations
- **Node.js & Express**: Local development server

### Key Algorithms
- **Maze Generation**: Recursive backtracking with randomized direction selection
- **Camera System**: Centered viewport with boundary clamping
- **State Management**: Finite state machine (menu, playing, levelComplete, gameOver)

### Code Architecture
The game follows an object-oriented approach with a single `game` object containing:
- State management
- Player physics and movement
- Maze generation and rendering
- Collision detection
- HUD updates
- Level progression logic

### Performance Optimizations
- **RequestAnimationFrame**: Smooth 60 FPS rendering loop
- **Efficient Collision Checks**: Only checks active items
- **Canvas Clearing**: Strategic use of fillRect for performance
- **Event Delegation**: Single event listeners for keyboard input

## 📁 Project Structure

```
pathfinder-game/
├── public/
│   └── scripts/
│       └── game.js          # Core game logic
├── index.html               # Main HTML structure
├── style.css                # Game styling
├── server.js                # Express server configuration
├── package.json             # Node.js dependencies
└── README.md                # This file
```

## 👤 Author

**Yaseen Zuberi**
- GitHub: [@yaseensl](https://github.com/yaseensl)
- LinkedIn: [yaseenzuberi17](https://linkedin.com/in/yaseenzuberi17)

## 🙏 Acknowledgments

- Built as part of CSC-317 coursework at San Francisco State University
- Inspired by classic maze navigation games
- Special thanks to the instructors and peers for feedback and support

---

⭐ If you enjoyed this game, please consider giving it a star on GitHub!
