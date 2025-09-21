/**
 * Memory Match Pro - Main Game Logic
 * Professional Memory Match game with advanced features
 * @author Gzeu
 * @version 1.0.0
 */

class MemoryMatchGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'loading';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.moves = 0;
        this.level = 1;
        this.startTime = null;
        this.gameTime = 0;
        this.difficulty = 'medium';
        this.isPaused = false;
        
        // Game settings
        this.settings = {
            volume: 70,
            visualEffects: true,
            animations: true,
            theme: 'default'
        };
        
        // Difficulty configurations
        this.difficulties = {
            easy: { rows: 2, cols: 3, timeBonus: 50 },
            medium: { rows: 3, cols: 4, timeBonus: 100 },
            hard: { rows: 4, cols: 4, timeBonus: 150 },
            expert: { rows: 4, cols: 6, timeBonus: 200 }
        };
        
        // Card symbols for different levels
        this.cardSymbols = [
            '🎯', '🎮', '🎲', '🎪', '🎨', '🎭', '🎵', '🎸',
            '🚀', '🌟', '⭐', '💎', '🔥', '⚡', '🌈', '🦄',
            '🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
            '🍎', '🍊', '🍋', '🍌', '🍇', '🍓', '🥝', '🍑'
        ];
        
        this.init();
    }
    
    async init() {
        try {
            this.setupCanvas();
            this.setupEventListeners();
            await this.loadAssets();
            this.showStartScreen();
            this.updateLoadingProgress(100);
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to load game. Please refresh the page.');
        }
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Setup canvas event listeners
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = Math.min(rect.width - 40, 800);
        this.canvas.height = Math.min(rect.height - 40, 600);
        
        if (this.gameState === 'playing') {
            this.render();
        }
    }
    
    setupEventListeners() {
        // Game control buttons
        document.getElementById('start-game-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn')?.addEventListener('click', () => this.togglePause());
        document.getElementById('resume-btn')?.addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn')?.addEventListener('click', () => this.restartGame());
        document.getElementById('main-menu-btn')?.addEventListener('click', () => this.showStartScreen());
        document.getElementById('play-again-btn')?.addEventListener('click', () => this.playAgain());
        document.getElementById('new-game-btn')?.addEventListener('click', () => this.newGame());
        
        // Settings
        document.getElementById('settings-btn')?.addEventListener('click', () => this.showSettings());
        document.getElementById('close-settings-btn')?.addEventListener('click', () => this.hideSettings());
        
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e.target.dataset.level));
        });
        
        // Keyboard controls
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    
    async loadAssets() {
        // Simulate asset loading with progress updates
        const assets = ['sounds', 'images', 'fonts', 'data'];
        
        for (let i = 0; i < assets.length; i++) {
            await this.delay(200); // Simulate loading time
            this.updateLoadingProgress((i + 1) / assets.length * 80);
        }
        
        // Load settings from localStorage
        this.loadSettings();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('memoryMatchSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            this.applySettings();
        }
    }
    
    saveSettings() {
        localStorage.setItem('memoryMatchSettings', JSON.stringify(this.settings));
    }
    
    applySettings() {
        // Apply volume
        if (window.audioManager) {
            window.audioManager.setVolume(this.settings.volume / 100);
        }
        
        // Apply theme
        document.body.className = `theme-${this.settings.theme}`;
        
        // Update UI elements
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) volumeSlider.value = this.settings.volume;
        
        const volumeValue = document.getElementById('volume-value');
        if (volumeValue) volumeValue.textContent = `${this.settings.volume}%`;
    }
    
    updateLoadingProgress(percentage) {
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen && gameContainer) {
            loadingScreen.style.display = 'none';
            gameContainer.classList.remove('hidden');
        }
    }
    
    showStartScreen() {
        this.gameState = 'menu';
        this.hideAllOverlays();
        document.getElementById('start-screen')?.classList.remove('hidden');
    }
    
    selectDifficulty(level) {
        this.difficulty = level;
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.level === level);
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.hideAllOverlays();
        this.initializeGame();
        this.startTimer();
        
        // Show canvas and hide grid initially
        this.canvas.style.display = 'block';
        document.getElementById('game-grid')?.classList.add('hidden');
        
        this.render();
    }
    
    initializeGame() {
        this.score = 0;
        this.moves = 0;
        this.matchedPairs = 0;
        this.flippedCards = [];
        this.startTime = Date.now();
        
        this.createCards();
        this.updateUI();
    }
    
    createCards() {
        const config = this.difficulties[this.difficulty];
        const totalCards = config.rows * config.cols;
        const pairsNeeded = totalCards / 2;
        
        // Select symbols for this level
        const selectedSymbols = this.cardSymbols.slice(0, pairsNeeded);
        const cardData = [...selectedSymbols, ...selectedSymbols];
        
        // Shuffle cards
        this.shuffleArray(cardData);
        
        // Create card objects
        this.cards = [];
        const cardWidth = (this.canvas.width - 60) / config.cols;
        const cardHeight = (this.canvas.height - 60) / config.rows;
        
        for (let i = 0; i < totalCards; i++) {
            const row = Math.floor(i / config.cols);
            const col = i % config.cols;
            
            this.cards.push({
                id: i,
                symbol: cardData[i],
                x: 30 + col * cardWidth,
                y: 30 + row * cardHeight,
                width: cardWidth - 10,
                height: cardHeight - 10,
                isFlipped: false,
                isMatched: false,
                flipTime: 0
            });
        }
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    handleCanvasClick(event) {
        if (this.gameState !== 'playing' || this.isPaused) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Scale coordinates if canvas is scaled
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const clickX = x * scaleX;
        const clickY = y * scaleY;
        
        this.handleCardClick(clickX, clickY);
    }
    
    handleCardClick(x, y) {
        if (this.flippedCards.length >= 2) return;
        
        const clickedCard = this.cards.find(card => 
            x >= card.x && x <= card.x + card.width &&
            y >= card.y && y <= card.y + card.height &&
            !card.isFlipped && !card.isMatched
        );
        
        if (clickedCard) {
            this.flipCard(clickedCard);
        }
    }
    
    flipCard(card) {
        card.isFlipped = true;
        card.flipTime = Date.now();
        this.flippedCards.push(card);
        
        // Play flip sound
        if (window.audioManager) {
            window.audioManager.playSound('flip');
        }
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateUI();
            
            setTimeout(() => this.checkMatch(), 800);
        }
        
        this.render();
    }
    
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            // Match found!
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            
            this.score += this.calculateScore();
            
            // Play match sound
            if (window.audioManager) {
                window.audioManager.playSound('match');
            }
            
            // Add particle effects
            if (this.settings.visualEffects) {
                this.createMatchParticles(card1, card2);
            }
            
            // Check if game is complete
            if (this.matchedPairs === this.cards.length / 2) {
                setTimeout(() => this.gameComplete(), 500);
            }
        } else {
            // No match - flip cards back
            card1.isFlipped = false;
            card2.isFlipped = false;
        }
        
        this.flippedCards = [];
        this.updateUI();
        this.render();
    }
    
    calculateScore() {
        const config = this.difficulties[this.difficulty];
        const baseScore = 100;
        const timeBonus = Math.max(0, config.timeBonus - Math.floor(this.gameTime / 1000));
        const movesPenalty = Math.max(0, this.moves * 5);
        
        return Math.max(10, baseScore + timeBonus - movesPenalty);
    }
    
    createMatchParticles(card1, card2) {
        // Create visual effects for matched cards
        if (window.particleSystem) {
            window.particleSystem.createBurst(card1.x + card1.width/2, card1.y + card1.height/2);
            window.particleSystem.createBurst(card2.x + card2.width/2, card2.y + card2.height/2);
        }
    }
    
    gameComplete() {
        this.gameState = 'completed';
        
        // Calculate final score with time bonus
        const timeBonus = Math.max(0, 1000 - Math.floor(this.gameTime / 1000) * 10);
        this.score += timeBonus;
        
        // Save best score
        this.saveBestScore();
        
        // Show game over screen
        this.showGameOverScreen();
        
        // Play victory sound
        if (window.audioManager) {
            window.audioManager.playSound('victory');
        }
    }
    
    saveBestScore() {
        const key = `bestScore_${this.difficulty}`;
        const currentBest = localStorage.getItem(key) || 0;
        
        if (this.score > currentBest) {
            localStorage.setItem(key, this.score.toString());
        }
    }
    
    showGameOverScreen() {
        this.hideAllOverlays();
        
        // Update final stats
        document.getElementById('final-score-display').textContent = this.score;
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-time').textContent = this.formatTime(this.gameTime);
        document.getElementById('final-level').textContent = this.level;
        
        document.getElementById('game-over-screen')?.classList.remove('hidden');
    }
    
    togglePause() {
        if (this.gameState !== 'playing') return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            document.getElementById('pause-screen')?.classList.remove('hidden');
        } else {
            document.getElementById('pause-screen')?.classList.add('hidden');
        }
    }
    
    restartGame() {
        this.startGame();
    }
    
    playAgain() {
        this.level++;
        this.startGame();
    }
    
    newGame() {
        this.level = 1;
        this.showStartScreen();
    }
    
    showSettings() {
        document.getElementById('settings-screen')?.classList.remove('hidden');
    }
    
    hideSettings() {
        document.getElementById('settings-screen')?.classList.add('hidden');
        this.saveSettings();
    }
    
    hideAllOverlays() {
        document.querySelectorAll('.game-overlay').forEach(overlay => {
            overlay.classList.add('hidden');
        });
    }
    
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused && this.gameState === 'playing') {
                this.gameTime = Date.now() - this.startTime;
                this.updateUI();
            }
        }, 100);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('timer').textContent = this.formatTime(this.gameTime);
        document.getElementById('level').textContent = this.level;
    }
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw cards
        this.cards.forEach(card => this.drawCard(card));
    }
    
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawCard(card) {
        this.ctx.save();
        
        // Card shadow
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // Card background
        if (card.isMatched) {
            this.ctx.fillStyle = '#4CAF50';
        } else if (card.isFlipped) {
            this.ctx.fillStyle = '#ffffff';
        } else {
            this.ctx.fillStyle = '#2196F3';
        }
        
        this.ctx.fillRect(card.x, card.y, card.width, card.height);
        
        // Card border
        this.ctx.strokeStyle = '#1976D2';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(card.x, card.y, card.width, card.height);
        
        // Draw symbol if flipped or matched
        if (card.isFlipped || card.isMatched) {
            this.ctx.font = `${Math.min(card.width, card.height) * 0.6}px Arial`;
            this.ctx.fillStyle = '#333';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            this.ctx.fillText(
                card.symbol,
                card.x + card.width / 2,
                card.y + card.height / 2
            );
        }
        
        this.ctx.restore();
    }
    
    handleKeyPress(event) {
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (this.gameState === 'playing') {
                    this.togglePause();
                }
                break;
            case 'Escape':
                if (this.gameState === 'playing') {
                    this.showStartScreen();
                }
                break;
        }
    }
    
    showError(message) {
        console.error(message);
        // Show error toast or modal
        if (window.uiManager) {
            window.uiManager.showToast(message, 'error');
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeCanvas.bind(this));
        document.removeEventListener('keydown', this.handleKeyPress.bind(this));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new MemoryMatchGame();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryMatchGame;
}
