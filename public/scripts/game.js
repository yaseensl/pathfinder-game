//Yaseen Zuberi, 924089618, https://github.com/CSC317-F25/assignment-3-yaseensl#
    const game = {
        canvas: null,
        ctx: null,
        state: 'menu',
        level: 1,
        score: 0,
        health: 100,
        maxHealth: 100,
        timeRemaining: 60,
        timerInterval: null,
        player: {
            x: 1,
            y: 1,
            speed: 1,
            speedBoostTime: 0
        },
        cellSize: 35,
        maze: [],
        coins: [],
        traps: [],
        healthPacks: [],
        speedBoosts: [],
        timeBonuses: [],
        exit: null,
        keys: {},

        init(){
            this.canvas = document.getElementById('canvas');
            this.ctx = this.canvas.getContext('2d');

            document.addEventListener('keydown', (e) => {
                this.keys[e.key] = true;
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    e.preventDefault();
                }
            });

            document.addEventListener('keyup', (e) => {
                this.keys[e.key] = false;
            });
        },

        generateMaze(width, height) {
            const maze = Array(height).fill().map(() => Array(width).fill(1));

            const carve = (x, y) => {
                const directions = [
                    [0, -2], [2, 0], [0, 2], [-2, 0]
                ].sort(() => Math.random() - 0.5);
                maze[y][x] = 0;

                for (let [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;

                    if (nx > 0 && nx < width && ny > 0 && ny < height && maze[ny][nx] === 1) {
                        maze[y + dy/2][x + dx/2] = 0;
                        carve(nx, ny);
                    }
                }
            };

            carve (1,1);
            return maze;
        },

        startGame() {
            this.level = 1;
            this.score = 0;
            this.health = this.maxHealth;
            this.state = 'playing';
            this.setupLevel();
            this.showScreen('game');
        },

        setupLevel(){
            const width = Math.min(19 + this.level, 29);
            const height = Math.min(14 + this.level, 19);
            this.maze = this.generateMaze(width, height);

            this.player.x = 1;
            this.player.y = 1;
            this.player.speedBoostTime = 0;
            this.timeRemaining = Math.max(90 - (this.level * 5), 45);

            const emptySpaces = [];
            for (let y = 0; y < this.maze.length; y++){
                for(let x = 0; x < this.maze[y].length; x++){
                    if(this.maze[y][x] === 0 && !(x ===1 && y ===1)){
                        emptySpaces.push({x, y});
                    }
                }
            }

            this.exit = emptySpaces.pop();

            const numCoins = 8 + this.level * 2;
            const numTraps = 3 + this.level;
            const numHealthPacks = 2;
            const numSpeedBoosts = 1 + Math.floor(this.level / 3);
            const numTimeBonuses = 1 + Math.floor(this.level / 2);

            this.coins = this.placeItems(emptySpaces, numCoins);
            this.traps = this.placeItems(emptySpaces, numTraps);
            this.healthPacks = this.placeItems(emptySpaces, numHealthPacks);
            this.speedBoosts = this.placeItems(emptySpaces, numSpeedBoosts);
            this.timeBonuses = this.placeItems(emptySpaces, numTimeBonuses);

            this.updateHUD();
            this.startTimer();
            this.gameLoop();
        },

        placeItems(spaces, count){
            const items = [];
            for(let i=0; i < count && spaces.length > 0; i++){
                const idx = Math.floor(Math.random() * spaces.length);
                items.push(spaces.splice(idx, 1)[0]);
            }
            return items;
        },

        startTimer(){
            if (this.timerInterval) { 
                clearInterval(this.timerInterval); 
            }

            this.timerInterval = setInterval(() => {
                if (this.state === 'playing') {
                    this.timeRemaining--;
                    this.updateHUD();
                    if(this.timeRemaining <= 0) {
                        this.gameOver('time ran out!');
                    }
                }
            }, 1000);
        },
        
        gameLoop(){
             console.log('game loop running, state:', this.state); 
            if (this.state !== 'playing') return;

            this.handleInput();
            this.checkCollisions();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        },

        handleInput() {
        const speed = this.player.speedBoostTime > 0 ? 0.15 : 0.1;
        let moved = false;
        
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) {
            if (this.canMove(this.player.x, this.player.y - speed)) {
                this.player.y -= speed;
                //moved = true;
            }
        }
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) {
            if (this.canMove(this.player.x, this.player.y + speed)) {
                this.player.y += speed;
                //moved = true;
            }
        }
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            if (this.canMove(this.player.x - speed, this.player.y)) {
                this.player.x -= speed;
                //moved = true;
            }
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            if (this.canMove(this.player.x + speed, this.player.y)) {
                this.player.x += speed;
                //moved = true;
            }
        }

        if (this.player.speedBoostTime > 0) {
            this.player.speedBoostTime--;
            if (this.player.speedBoostTime === 0) {
                document.getElementById('powerup-status').textContent = '';
            }
        }

    },

   canMove(x, y) {
    const margin = 0.2;  
    
    const corners = [
        {cx: x + margin, cy: y + margin},         // Top-left
        {cx: x + 1 - margin, cy: y + margin},     // Top-right
        {cx: x + margin, cy: y + 1 - margin},     // Bottom-left
        {cx: x + 1 - margin, cy: y + 1 - margin}  // Bottom-right
    ];
    
    for (let corner of corners) {
        const gridX = Math.floor(corner.cx);
        const gridY = Math.floor(corner.cy);
        
        if (gridX < 0 || gridY < 0 || gridY >= this.maze.length || gridX >= this.maze[0].length) {
            return false;
        }
        
        if (this.maze[gridY][gridX] === 1) {
            return false;
        }
    }
    
    return true;
},

    checkCollisions() {
    const px = this.player.x;
    const py = this.player.y;
    
    const isColliding = (item) => {
        const distance = Math.sqrt(
            Math.pow(px + 0.5 - item.x - 0.5, 2) + 
            Math.pow(py + 0.5 - item.y - 0.5, 2)
        );
        return distance < 0.7; 
    };
    
    this.coins = this.coins.filter(coin => {
        if (isColliding(coin)) {
            this.score += 10;
            this.updateHUD();
            return false;
        }
        return true;
    });
    
    this.traps = this.traps.filter(trap => {
        if (isColliding(trap)) {
            this.health -= 15;
            this.updateHUD();
            if (this.health <= 0) {
                this.gameOver('you ran out of health!');
            }
            return false;
        }
        return true;
    });
    
    this.healthPacks = this.healthPacks.filter(pack => {
        if (isColliding(pack)) {
            this.health = Math.min(this.health + 30, this.maxHealth);
            this.updateHUD();
            return false;
        }
        return true;
    });
    
    this.speedBoosts = this.speedBoosts.filter(boost => {
        if (isColliding(boost)) {
            this.player.speedBoostTime = 300;
            document.getElementById('powerup-status').textContent = '⚡ SPEED BOOST ACTIVATED!';
            return false;
        }
        return true;
    });
    
    this.timeBonuses = this.timeBonuses.filter(bonus => {
        if (isColliding(bonus)) {
            this.timeRemaining += 10;
            this.updateHUD();
            return false;
        }
        return true;
    });
    
    if (this.exit && isColliding(this.exit)) {
        this.completeLevel();
    }
},

    render() {
    console.log('Rendering maze:', this.maze.length, 'x', this.maze[0]?.length);  

        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const offsetX = Math.max(0, Math.min(
            this.player.x * this.cellSize - this.canvas.width / 2,
            this.maze[0].length * this.cellSize - this.canvas.width
        ));
        const offsetY = Math.max(0, Math.min(
            this.player.y * this.cellSize - this.canvas.height / 2,
            this.maze.length * this.cellSize - this.canvas.height
        ));

        for(let y = 0; y < this.maze.length; y++){
            for(let x = 0; x < this.maze[y].length; x++){
                if(this.maze[y][x] === 1){
                    this.ctx.fillStyle = '#2d3561';
                    this.ctx.fillRect(
                        x * this.cellSize - offsetX,
                        y * this.cellSize - offsetY,
                        this.cellSize,
                        this.cellSize
                    );
                    this.ctx.strokeStyle = '#1a1a2e';
                    this.ctx.strokeRect(
                        x * this.cellSize - offsetX,
                        y * this.cellSize - offsetY,
                        this.cellSize,
                        this.cellSize
                    );
                }
            }
        }
        if (this.exit){
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.fillRect(
                this.exit.x * this.cellSize - offsetX + 5,
                this.exit.y * this.cellSize - offsetY + 5,
                this.cellSize - 10,
                this.cellSize - 10
            );
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '20px Lucida Console';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('EXIT',
                this.exit.x * this.cellSize - offsetX + this.cellSize/2,
                this.exit.y * this.cellSize - offsetY + this.cellSize/2 + 7
            );
        }

        this.coins.forEach(coin =>{
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(
                coin.x * this.cellSize - offsetX + this.cellSize/2,
                coin.y * this.cellSize - offsetY + this.cellSize/2,
                8, 0, Math.PI * 2
            );
            this.ctx.fill();
        });

        this.traps.forEach(trap => {
            this.ctx.fillStyle = '#ff4444';
            this.ctx.beginPath();
            this.ctx.moveTo(trap.x * this.cellSize - offsetX + this.cellSize/2, trap.y * this.cellSize - offsetY + 8);
            this.ctx.lineTo(trap.x * this.cellSize - offsetX + this.cellSize - 8, trap.y * this.cellSize - offsetY + this.cellSize - 8);
            this.ctx.lineTo(trap.x * this.cellSize - offsetX + 8, trap.y * this.cellSize - offsetY + this.cellSize - 8);
            this.ctx.closePath();
            this.ctx.fill();
        });

        this.healthPacks.forEach(pack => {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(
                pack.x * this.cellSize - offsetX + 12,
                pack.y * this.cellSize - offsetY + 8,
                this.cellSize - 24, 6
            );
            this.ctx.fillRect(
                pack.x * this.cellSize - offsetX + this.cellSize/2 - 3,
                pack.y * this.cellSize - offsetY + 8,
                6, this.cellSize - 16
            );
        });

        this.speedBoosts.forEach(boost => {
            this.ctx.fillStyle = '#4da6ff';
            this.ctx.beginPath();
            this.ctx.arc(
                boost.x * this.cellSize - offsetX + this.cellSize/2,
                boost.y * this.cellSize - offsetY + this.cellSize/2,
                10, 0, Math.PI * 2
            );
            this.ctx.fill();
        });

        this.timeBonuses.forEach(bonus => {
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.font = '24px Lucida Console';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('⏱',
                bonus.x * this.cellSize - offsetX + this.cellSize/2,
                bonus.y * this.cellSize - offsetY + this.cellSize/2 + 8
            );
        });

        const glowIntensity = this.player.speedBoostTime > 0 ?
        Math.abs(Math.sin(Date.now() / 100)) * 10 + 5 : 0;

        if(glowIntensity > 0) {
            this.ctx.shadowColor = '#4da6ff';
            this.ctx.shadowBlur = glowIntensity;
        }

        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x * this.cellSize - offsetX + this.cellSize/2,
            this.player.y * this.cellSize - offsetY + this.cellSize/2,
            12, 0, Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    },

    updateHUD(){
        document.getElementById('level').textContent = this.level;
        document.getElementById('score').textContent = this.score;
        document.getElementById('timer').textContent = this.timeRemaining;

        const healthPercent = (this.health / this.maxHealth) * 100;
        document.getElementById('health-fill').style.width = healthPercent + '%';
    },

    completeLevel(){
        this.state = 'levelComplete';
        clearInterval(this.timerInterval);

        const timeBonus = this.timeRemaining * 5;
        this.score += timeBonus;

        document.getElementById('level-score').textContent = `score: ${this.score}`;
        document.getElementById('time-bonus').textContent = `time bonus: +${timeBonus} points`;
        document.getElementById('level-score').textContent = `get ready for level: ${this.level + 1}!`;

        this.showScreen('levelComplete');
    },

    nextLevel(){
        this.level++;
        this.health = Math.min(this.health + 20, this.maxHealth);
        this.state = 'playing';
        this.setupLevel();
        this.showScreen('game');
    },

    gameOver(reason){
        this.state = 'gameOver';
        clearInterval(this.timerInterval);

        document.getElementById('final-score').textContent = `final score: ${this.score}`;
        document.getElementById('levels-completed').textContent = `you completed ${this.level - 1} level(s). ${reason}`;

        this.showScreen('gameOver');
    },

    restartGame(){
        this.startGame();
    },

    returnToMenu(){
        this.state = 'menu';
        clearInterval(this.timerInterval);
        this.showScreen('menu');
    },

    showScreen(screen) {

        console.log('showScreen called with:', screen);  // Add this line
    console.log('Setting state to:', screen === 'game' ? 'playing' : this.state);

        document.getElementById('menu-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('level-complete-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        
        if (screen === 'menu') {
            document.getElementById('menu-screen').classList.remove('hidden');
        } else if (screen === 'game') {
            document.getElementById('game-screen').classList.remove('hidden');
            this.state = 'playing';
        } else if (screen === 'levelComplete') {
            document.getElementById('level-complete-screen').classList.remove('hidden');
        } else if (screen === 'gameOver') {
            document.getElementById('game-over-screen').classList.remove('hidden');
        }
    }

};

game.init();