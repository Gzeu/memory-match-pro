/**
 * Memory Match Pro - Main Entry Point
 * Professional Memory Match game with advanced features
 * @author Gzeu
 * @version 1.0.0
 */

// Main game initialization and orchestration
class GameManager {
    constructor() {
        this.game = null;
        this.audioManager = null;
        this.uiManager = null;
        this.performanceMonitor = null;
        this.particleSystem = null;
        
        this.isInitialized = false;
        this.loadingSteps = [
            'Initializing Audio System',
            'Setting up User Interface',
            'Loading Game Assets',
            'Preparing Performance Monitor',
            'Starting Game Engine'
        ];
        this.currentStep = 0;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🧠 Memory Match Pro - Starting initialization...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize systems step by step
            await this.initializeAudio();
            await this.initializeUI();
            await this.loadAssets();
            await this.initializePerformance();
            await this.startGameEngine();
            
            this.isInitialized = true;
            console.log('✅ Memory Match Pro - Initialization complete!');
            
            // Hide loading screen and show game
            this.hideLoadingScreen();
            
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        
        if (gameContainer) {
            gameContainer.classList.add('hidden');
        }
    }
    
    updateLoadingProgress(step, message) {
        const progressBar = document.getElementById('loading-progress');
        const loadingText = document.querySelector('.loading-text');
        
        const progress = (step / this.loadingSteps.length) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (loadingText) {
            loadingText.textContent = message || this.loadingSteps[step - 1] || 'Loading...';
        }
        
        console.log(`📈 Loading: ${progress.toFixed(1)}% - ${message}`);
    }
    
    async initializeAudio() {
        this.currentStep++;
        this.updateLoadingProgress(this.currentStep, 'Initializing Audio System...');
        
        try {
            // Audio manager should already be initialized by its own script
            if (window.audioManager) {
                this.audioManager = window.audioManager;
                await this.delay(300); // Allow audio context to initialize
            } else {
                console.warn('Audio manager not available');
            }
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }
    
    async initializeUI() {
        this.currentStep++;
        this.updateLoadingProgress(this.currentStep, 'Setting up User Interface...');
        
        try {
            // UI manager should already be initialized
            if (window.uiManager) {
                this.uiManager = window.uiManager;
            }
            
            // Setup additional UI enhancements
            this.setupKeyboardShortcuts();
            this.setupAccessibility();
            
            await this.delay(200);
        } catch (error) {
            console.warn('UI initialization failed:', error);
        }
    }
    
    async loadAssets() {
        this.currentStep++;
        this.updateLoadingProgress(this.currentStep, 'Loading Game Assets...');
        
        try {
            // Preload any additional assets if needed
            await this.preloadImages();
            await this.preloadSounds();
            
            await this.delay(400);
        } catch (error) {
            console.warn('Asset loading failed:', error);
        }
    }
    
    async initializePerformance() {
        this.currentStep++;
        this.updateLoadingProgress(this.currentStep, 'Preparing Performance Monitor...');
        
        try {
            if (window.performanceMonitor) {
                this.performanceMonitor = window.performanceMonitor;
                
                // Start monitoring in development mode
                if (this.isDevelopmentMode()) {
                    this.performanceMonitor.startMonitoring();
                    this.showDebugInfo();
                }
            }
            
            // Initialize particle system
            if (window.particleSystem) {
                this.particleSystem = window.particleSystem;
            }
            
            await this.delay(200);
        } catch (error) {
            console.warn('Performance monitor initialization failed:', error);
        }
    }
    
    async startGameEngine() {
        this.currentStep++;
        this.updateLoadingProgress(this.currentStep, 'Starting Game Engine...');
        
        try {
            // Game should already be initialized
            if (window.game) {
                this.game = window.game;
            } else {
                console.warn('Game instance not found');
            }
            
            // Final setup
            this.setupGlobalErrorHandling();
            this.registerServiceWorker();
            
            await this.delay(300);
        } catch (error) {
            console.error('Game engine initialization failed:', error);
            throw error;
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        if (gameContainer) {
            gameContainer.classList.remove('hidden');
            gameContainer.style.opacity = '0';
            
            // Fade in game container
            setTimeout(() => {
                gameContainer.style.transition = 'opacity 0.5s ease-in-out';
                gameContainer.style.opacity = '1';
            }, 100);
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Global keyboard shortcuts
            if (event.ctrlKey || event.metaKey) {
                switch (event.code) {
                    case 'KeyD':
                        if (this.isDevelopmentMode()) {
                            event.preventDefault();
                            this.toggleDebugPanel();
                        }
                        break;
                    case 'KeyM':
                        event.preventDefault();
                        this.toggleMute();
                        break;
                }
            }
            
            // Game-specific shortcuts
            switch (event.code) {
                case 'F11':
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (this.game && this.game.gameState === 'playing') {
                        this.game.showStartScreen();
                    }
                    break;
            }
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels and keyboard navigation support
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                const title = button.getAttribute('title');
                if (title) {
                    button.setAttribute('aria-label', title);
                }
            }
        });
        
        // Enhance focus visibility
        const style = document.createElement('style');
        style.textContent = `
            button:focus, .control-btn:focus {
                outline: 2px solid #4CAF50;
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    async preloadImages() {
        // Preload any critical images
        const imageUrls = [
            './assets/images/og-image.png',
            './assets/images/favicon.ico',
            './assets/images/apple-touch-icon.png'
        ];
        
        const promises = imageUrls.map(url => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Don't fail if optional images are missing
                img.src = url;
            });
        });
        
        await Promise.all(promises);
    }
    
    async preloadSounds() {
        // Audio manager handles sound generation, nothing to preload
        return Promise.resolve();
    }
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            
            if (this.uiManager) {
                this.uiManager.showToast(
                    'An unexpected error occurred. The game will continue.',
                    'error'
                );
            }
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator && !this.isDevelopmentMode()) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.warn('Service Worker registration failed:', error);
            }
        }
    }
    
    toggleDebugPanel() {
        if (this.uiManager) {
            this.uiManager.toggleDebugPanel();
        }
    }
    
    showDebugInfo() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.classList.remove('hidden');
        }
    }
    
    toggleMute() {
        if (this.audioManager) {
            const isMuted = this.audioManager.toggleMute();
            const soundBtn = document.getElementById('sound-btn');
            
            if (soundBtn) {
                soundBtn.textContent = isMuted ? '🔇' : '🔊';
            }
            
            if (this.uiManager) {
                this.uiManager.showToast(
                    isMuted ? 'Sound muted' : 'Sound enabled',
                    'info',
                    1000
                );
            }
        }
    }
    
    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.warn('Fullscreen toggle failed:', error);
        }
    }
    
    isDevelopmentMode() {
        return location.hostname === 'localhost' || 
               location.hostname === '127.0.0.1' || 
               location.search.includes('debug=true');
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f44336;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        errorDiv.innerHTML = `
            <h3>❌ Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #f44336;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">Reload Page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public API methods
    getGameState() {
        return this.game ? this.game.gameState : 'not_initialized';
    }
    
    getPerformanceStats() {
        if (!this.performanceMonitor) return null;
        
        return {
            fps: this.performanceMonitor.fps,
            averageFPS: this.performanceMonitor.getAverageFPS(),
            memoryUsage: this.performanceMonitor.getMemoryUsage(),
            particleCount: this.particleSystem ? this.particleSystem.getParticleCount() : 0
        };
    }
    
    restart() {
        if (this.game) {
            this.game.newGame();
        }
    }
    
    destroy() {
        if (this.performanceMonitor) {
            this.performanceMonitor.stopMonitoring();
        }
        
        if (this.audioManager) {
            this.audioManager.destroy();
        }
        
        if (this.game) {
            this.game.destroy();
        }
        
        if (this.particleSystem) {
            this.particleSystem.clear();
        }
        
        console.log('🧠 Memory Match Pro - Cleanup complete');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global game manager instance
    window.gameManager = new GameManager();
    
    // Expose debug functions in development
    if (window.gameManager.isDevelopmentMode()) {
        window.debug = {
            gameManager: window.gameManager,
            game: () => window.game,
            audio: () => window.audioManager,
            ui: () => window.uiManager,
            performance: () => window.performanceMonitor,
            particles: () => window.particleSystem,
            stats: () => window.gameManager.getPerformanceStats(),
            restart: () => window.gameManager.restart(),
            toggleDebug: () => window.gameManager.toggleDebugPanel()
        };
        
        console.log('🐛 Debug mode enabled. Use window.debug for debugging tools.');
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden) {
            // Pause game when tab is hidden
            if (window.game.gameState === 'playing' && !window.game.isPaused) {
                window.game.togglePause();
            }
            
            if (window.audioManager) {
                window.audioManager.pauseMusic();
            }
        } else {
            // Resume when tab becomes visible
            if (window.audioManager) {
                window.audioManager.resumeMusic();
            }
        }
    }
});

// Handle beforeunload for cleanup
window.addEventListener('beforeunload', () => {
    if (window.gameManager) {
        window.gameManager.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
}
