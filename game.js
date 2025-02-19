class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');

        // Game state
        this.isGameOver = false;
        this.score = 0;
        this.timeElapsed = 0;
        this.timer = null;

        // Player properties
        this.player = {
            x: 50,
            y: this.canvas.height - 40,
            width: 20,
            height: 40,
            jumping: false,
            jumpForce: 0,
            gravity: 0.6
        };

        // Obstacle properties
        this.obstacles = [];
        this.obstacleSpeed = 5;
        this.obstacleInterval = 1500;

        // Bind methods
        this.handleJump = this.handleJump.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.spawnObstacle = this.spawnObstacle.bind(this);
        this.restart = this.restart.bind(this);

        // Event listeners
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'ArrowUp') && !this.player.jumping) {
                this.handleJump();
            }
            if (e.code === 'Enter' && this.isGameOver) {
                this.restart();
            }
        });

        // Start game
        this.start();
    }

    start() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.timerElement.textContent = this.timeElapsed;
        }, 1000);

        setInterval(this.spawnObstacle, this.obstacleInterval);
        requestAnimationFrame(this.gameLoop);
    }

    handleJump() {
        this.player.jumping = true;
        this.player.jumpForce = -15;
    }

    spawnObstacle() {
        if (!this.isGameOver) {
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - 30,
                width: 20,
                height: 30
            });
        }
    }

    update() {
        // Update player
        if (this.player.jumping) {
            this.player.y += this.player.jumpForce;
            this.player.jumpForce += this.player.gravity;

            if (this.player.y >= this.canvas.height - this.player.height) {
                this.player.y = this.canvas.height - this.player.height;
                this.player.jumping = false;
            }
        }

        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.obstacleSpeed;
            
            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score++;
                this.scoreElement.textContent = this.score;
            }

            // Collision detection
            if (this.checkCollision(this.player, obstacle)) {
                this.gameOver();
            }
        });
    }

    checkCollision(player, obstacle) {
        return player.x < obstacle.x + obstacle.width &&
               player.x + player.width > obstacle.x &&
               player.y < obstacle.y + obstacle.height &&
               player.y + player.height > obstacle.y;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.stroke();

        // Draw player
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

        // Draw obstacles
        this.ctx.fillStyle = '#f00';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(
                obstacle.x,
                obstacle.y,
                obstacle.width,
                obstacle.height
            );
        });

        // Draw game over text
        if (this.isGameOver) {
            this.ctx.fillStyle = '#000';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('Game Over! Press Enter to restart', 250, 100);
        }
    }

    gameLoop() {
        if (!this.isGameOver) {
            this.update();
        }
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.timer);
    }

    restart() {
        this.isGameOver = false;
        this.score = 0;
        this.timeElapsed = 0;
        this.scoreElement.textContent = '0';
        this.timerElement.textContent = '0';
        this.obstacles = [];
        this.player.y = this.canvas.height - this.player.height;
        this.player.jumping = false;
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.timerElement.textContent = this.timeElapsed;
        }, 1000);
    }
}

// Start the game
new Game(); 
