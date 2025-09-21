/**
 * Memory Match Pro - UI Manager
 * Handles user interface interactions and animations
 * @author Gzeu
 * @version 1.0.0
 */

class UIManager {
    constructor() {
        this.toastContainer = null;
        this.particleContainer = null;
        this.activeToasts = [];
        this.animationQueue = [];
        
        this.init();
    }
    
    init() {
        this.setupContainers();
        this.setupSettingsListeners();
        this.setupAnimations();
    }
    
    setupContainers() {
        this.toastContainer = document.getElementById('toast-container');
        this.particleContainer = document.getElementById('particles-container');
    }
    
    setupSettingsListeners() {
        // Volume slider
        const volumeSlider = document.getElementById('volume-slider');
        const volumeValue = document.getElementById('volume-value');
        
        if (volumeSlider && volumeValue) {
            volumeSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                volumeValue.textContent = `${value}%`;
                
                if (window.game) {
                    window.game.settings.volume = value;
                    window.game.applySettings();
                }
            });
        }
        
        // Toggle switches
        this.setupToggleSwitch('effects-toggle', 'visualEffects');
        this.setupToggleSwitch('animations-toggle', 'animations');
        
        // Theme selector
        const themeSelector = document.getElementById('theme-selector');
        if (themeSelector) {
            themeSelector.addEventListener('change', (e) => {
                const theme = e.target.value;
                
                if (window.game) {
                    window.game.settings.theme = theme;
                    window.game.applySettings();
                }
            });
        }
        
        // Sound toggle button
        const soundBtn = document.getElementById('sound-btn');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                if (window.audioManager) {
                    window.audioManager.toggleMute();
                    soundBtn.textContent = window.audioManager.isMuted ? '🔇' : '🔊';
                }
            });
        }
    }
    
    setupToggleSwitch(elementId, settingKey) {
        const toggle = document.getElementById(elementId);
        if (!toggle) return;
        
        toggle.addEventListener('click', () => {
            const isActive = toggle.classList.toggle('active');
            
            if (window.game) {
                window.game.settings[settingKey] = isActive;
                window.game.applySettings();
            }
        });
    }
    
    setupAnimations() {
        // Add hover effects to buttons
        document.querySelectorAll('.hover-lift').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
                element.style.transition = 'transform 0.2s ease';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
        
        // Add click animations to buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', () => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
            });
        });
    }
    
    showToast(message, type = 'info', duration = 3000) {
        if (!this.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${this.getToastIcon(type)}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close">×</button>
            </div>
        `;
        
        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.removeToast(toast));
        
        // Add to container with animation
        this.toastContainer.appendChild(toast);
        this.activeToasts.push(toast);
        
        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });
        
        // Auto remove after duration
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
        
        return toast;
    }
    
    removeToast(toast) {
        if (!toast.parentElement) return;
        
        toast.classList.add('toast-hide');
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
            
            const index = this.activeToasts.indexOf(toast);
            if (index > -1) {
                this.activeToasts.splice(index, 1);
            }
        }, 300);
    }
    
    getToastIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        
        return icons[type] || icons.info;
    }
    
    showNotification(title, message, type = 'info') {
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: './assets/images/icon-192.png'
            });
        } else {
            // Fallback to toast
            this.showToast(`${title}: ${message}`, type);
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    animateScoreUpdate(element, newScore, duration = 500) {
        if (!element) return;
        
        const startScore = parseInt(element.textContent) || 0;
        const scoreDiff = newScore - startScore;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentScore = Math.floor(startScore + (scoreDiff * easeOutCubic));
            
            element.textContent = currentScore;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    animateCardFlip(cardElement, duration = 300) {
        if (!cardElement) return;
        
        cardElement.style.transition = `transform ${duration}ms ease-in-out`;
        cardElement.style.transformStyle = 'preserve-3d';
        
        // First half - rotate to 90 degrees
        cardElement.style.transform = 'rotateY(90deg)';
        
        setTimeout(() => {
            // Second half - rotate to 180 degrees
            cardElement.style.transform = 'rotateY(180deg)';
        }, duration / 2);
        
        // Reset after animation
        setTimeout(() => {
            cardElement.style.transition = '';
            cardElement.style.transform = '';
            cardElement.style.transformStyle = '';
        }, duration);
    }
    
    createFloatingText(x, y, text, color = '#4CAF50', duration = 1000) {
        const element = document.createElement('div');
        element.className = 'floating-text';
        element.textContent = text;
        element.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-weight: bold;
            font-size: 20px;
            pointer-events: none;
            z-index: 1000;
            transition: all ${duration}ms ease-out;
        `;
        
        document.body.appendChild(element);
        
        // Animate upward movement and fade out
        requestAnimationFrame(() => {
            element.style.transform = 'translateY(-50px)';
            element.style.opacity = '0';
        });
        
        // Remove element after animation
        setTimeout(() => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        }, duration);
    }
    
    showProgressBar(progress, message = 'Loading...') {
        const container = document.getElementById('progress-container');
        const bar = document.getElementById('progress-bar');
        
        if (container && bar) {
            container.classList.remove('hidden');
            bar.style.width = `${progress}%`;
            
            // Update loading text if element exists
            const loadingText = document.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
    }
    
    hideProgressBar() {
        const container = document.getElementById('progress-container');
        if (container) {
            container.classList.add('hidden');
        }
    }
    
    updateStats(stats) {
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    highlightElement(element, duration = 1000) {
        if (!element) return;
        
        element.classList.add('highlight');
        
        setTimeout(() => {
            element.classList.remove('highlight');
        }, duration);
    }
    
    shakeElement(element, intensity = 5, duration = 500) {
        if (!element) return;
        
        const startTime = performance.now();
        const originalTransform = element.style.transform;
        
        const shake = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const shakeX = (Math.random() - 0.5) * intensity * (1 - progress);
                const shakeY = (Math.random() - 0.5) * intensity * (1 - progress);
                
                element.style.transform = `${originalTransform} translate(${shakeX}px, ${shakeY}px)`;
                requestAnimationFrame(shake);
            } else {
                element.style.transform = originalTransform;
            }
        };
        
        requestAnimationFrame(shake);
    }
    
    pulseElement(element, scale = 1.1, duration = 300) {
        if (!element) return;
        
        const originalTransform = element.style.transform;
        
        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transform = `${originalTransform} scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = originalTransform;
            
            setTimeout(() => {
                element.style.transition = '';
            }, duration);
        }, duration);
    }
    
    createRippleEffect(element, x, y) {
        if (!element) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            left: ${x - size/2}px;
            top: ${y - size/2}px;
            width: ${size}px;
            height: ${size}px;
            pointer-events: none;
            animation: ripple 0.6s linear;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }
    
    fadeOut(element, duration = 300) {
        if (!element) return;
        
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }
    
    slideIn(element, direction = 'left', duration = 300) {
        if (!element) return;
        
        const translateMap = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };
        
        element.style.transform = translateMap[direction];
        element.style.transition = `transform ${duration}ms ease-out`;
        element.style.display = 'block';
        
        requestAnimationFrame(() => {
            element.style.transform = 'translate(0)';
        });
    }
    
    showModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${options.title || 'Info'}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${options.showCancel ? '<button class="btn-secondary modal-cancel">Cancel</button>' : ''}
                    <button class="primary-btn modal-confirm">${options.confirmText || 'OK'}</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        return new Promise((resolve) => {
            const cleanup = () => {
                modal.remove();
            };
            
            modal.querySelector('.modal-close').onclick = () => {
                cleanup();
                resolve(false);
            };
            
            modal.querySelector('.modal-confirm').onclick = () => {
                cleanup();
                resolve(true);
            };
            
            if (options.showCancel) {
                modal.querySelector('.modal-cancel').onclick = () => {
                    cleanup();
                    resolve(false);
                };
            }
            
            modal.onclick = (e) => {
                if (e.target === modal) {
                    cleanup();
                    resolve(false);
                }
            };
        });
    }
    
    updateDebugPanel(stats) {
        const debugPanel = document.getElementById('debug-panel');
        if (!debugPanel || debugPanel.classList.contains('hidden')) return;
        
        Object.entries(stats).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    toggleDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.classList.toggle('hidden');
        }
    }
}

// Initialize UI Manager
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
