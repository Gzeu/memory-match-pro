/**
 * Memory Match Pro - Utility Functions
 * Common utilities, helpers, and performance optimization tools
 * @author Gzeu
 * @version 1.0.0
 */

// Performance utilities
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.frameHistory = [];
        this.maxHistorySize = 60;
        
        this.memoryUsage = 0;
        this.isMonitoring = false;
    }
    
    startMonitoring() {
        this.isMonitoring = true;
        this.measureFrame();
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
    }
    
    measureFrame() {
        if (!this.isMonitoring) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        this.frameCount++;
        
        if (deltaTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameHistory.push(this.fps);
            
            if (this.frameHistory.length > this.maxHistorySize) {
                this.frameHistory.shift();
            }
            
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Update debug panel if available
            if (window.uiManager) {
                window.uiManager.updateDebugPanel({
                    'fps-counter': this.fps,
                    'memory-usage': this.getMemoryUsage() + 'MB'
                });
            }
        }
        
        requestAnimationFrame(() => this.measureFrame());
    }
    
    getMemoryUsage() {
        if (performance.memory) {
            return Math.round(performance.memory.usedJSHeapSize / 1048576);
        }
        return 0;
    }
    
    getAverageFPS() {
        if (this.frameHistory.length === 0) return this.fps;
        
        const sum = this.frameHistory.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.frameHistory.length);
    }
}

// Particle system for visual effects
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 100;
        this.isActive = false;
    }
    
    createParticle(x, y, options = {}) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * (options.velocityRange || 4),
            vy: (Math.random() - 0.5) * (options.velocityRange || 4),
            life: 1.0,
            decay: options.decay || 0.02,
            size: options.size || Math.random() * 4 + 2,
            color: options.color || this.getRandomColor(),
            type: options.type || 'circle'
        };
        
        this.particles.push(particle);
        
        // Limit particle count
        if (this.particles.length > this.maxParticles) {
            this.particles.shift();
        }
    }
    
    createBurst(x, y, count = 10, options = {}) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, {
                ...options,
                velocityRange: 6,
                decay: 0.015,
                color: options.color || this.getBurstColor()
            });
        }
    }
    
    createTrail(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.createParticle(
                x + (Math.random() - 0.5) * 10,
                y + (Math.random() - 0.5) * 10,
                {
                    velocityRange: 2,
                    decay: 0.03,
                    size: Math.random() * 2 + 1,
                    color: 'rgba(255, 255, 255, 0.8)'
                }
            );
        }
    }
    
    update() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Apply gravity
            particle.vy += 0.1;
            
            // Apply air resistance
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            return particle.life > 0;
        });
    }
    
    render() {
        if (!this.ctx) return;
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            this.ctx.globalAlpha = particle.life;
            
            if (particle.type === 'circle') {
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (particle.type === 'star') {
                this.drawStar(particle.x, particle.y, particle.size, particle.color);
            }
            
            this.ctx.restore();
        });
    }
    
    drawStar(x, y, size, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const radius = i % 2 === 0 ? size : size / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getBurstColor() {
        const colors = [
            '#FFD93D', '#6BCF7F', '#4D96FF', '#FF6B9D',
            '#C44569', '#F8B500', '#6C5CE7', '#00D2D3'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    clear() {
        this.particles = [];
    }
    
    getParticleCount() {
        return this.particles.length;
    }
}

// Local storage utilities
class StorageManager {
    static saveGameData(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(`memoryMatch_${key}`, serialized);
            return true;
        } catch (error) {
            console.warn('Failed to save game data:', error);
            return false;
        }
    }
    
    static loadGameData(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`memoryMatch_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to load game data:', error);
            return defaultValue;
        }
    }
    
    static removeGameData(key) {
        try {
            localStorage.removeItem(`memoryMatch_${key}`);
            return true;
        } catch (error) {
            console.warn('Failed to remove game data:', error);
            return false;
        }
    }
    
    static clearAllGameData() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('memoryMatch_')) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.warn('Failed to clear game data:', error);
            return false;
        }
    }
    
    static getStorageUsage() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith('memoryMatch_')) {
                total += localStorage[key].length;
            }
        }
        return total;
    }
}

// Math utilities
class MathUtils {
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    static easeOutBounce(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
    
    static pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }
    
    static rectIntersection(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
        return !(r2x > r1x + r1w || r2x + r2w < r1x || r2y > r1y + r1h || r2y + r2h < r1y);
    }
}

// Color utilities
class ColorUtils {
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    static rgbaToString(r, g, b, a = 1) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
    static interpolateColors(color1, color2, factor) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1;
        
        const r = Math.round(MathUtils.lerp(rgb1.r, rgb2.r, factor));
        const g = Math.round(MathUtils.lerp(rgb1.g, rgb2.g, factor));
        const b = Math.round(MathUtils.lerp(rgb1.b, rgb2.b, factor));
        
        return this.rgbToHex(r, g, b);
    }
    
    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    static lightenColor(color, amount) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        const r = Math.min(255, rgb.r + amount);
        const g = Math.min(255, rgb.g + amount);
        const b = Math.min(255, rgb.b + amount);
        
        return this.rgbToHex(r, g, b);
    }
    
    static darkenColor(color, amount) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;
        
        const r = Math.max(0, rgb.r - amount);
        const g = Math.max(0, rgb.g - amount);
        const b = Math.max(0, rgb.b - amount);
        
        return this.rgbToHex(r, g, b);
    }
}

// Timer utilities
class Timer {
    constructor(callback, interval) {
        this.callback = callback;
        this.interval = interval;
        this.timerId = null;
        this.startTime = null;
        this.elapsed = 0;
        this.paused = false;
    }
    
    start() {
        if (this.timerId) return;
        
        this.startTime = Date.now() - this.elapsed;
        this.timerId = setInterval(() => {
            if (!this.paused) {
                this.elapsed = Date.now() - this.startTime;
                this.callback(this.elapsed);
            }
        }, this.interval);
    }
    
    pause() {
        this.paused = true;
    }
    
    resume() {
        if (this.paused) {
            this.paused = false;
            this.startTime = Date.now() - this.elapsed;
        }
    }
    
    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.elapsed = 0;
        this.paused = false;
    }
    
    reset() {
        this.stop();
        this.elapsed = 0;
    }
    
    getElapsed() {
        return this.elapsed;
    }
    
    isRunning() {
        return this.timerId !== null && !this.paused;
    }
}

// Event system
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        
        const index = this.events[event].indexOf(callback);
        if (index > -1) {
            this.events[event].splice(index, 1);
        }
    }
    
    emit(event, ...args) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(callback => {
            callback(...args);
        });
    }
    
    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };
        
        this.on(event, onceCallback);
    }
    
    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}

// Device detection utilities
class DeviceUtils {
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    static isTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    }
    
    static isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }
    
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    static getScreenSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }
    
    static supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch (error) {
            return false;
        }
    }
    
    static supportsWebAudio() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
}

// Validation utilities
class ValidationUtils {
    static isEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    static isUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    static isInRange(value, min, max) {
        return value >= min && value <= max;
    }
    
    static isPositiveInteger(value) {
        return Number.isInteger(value) && value > 0;
    }
    
    static sanitizeString(str) {
        return str.replace(/[<>"'&]/g, char => {
            const map = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '&': '&amp;'
            };
            return map[char] || char;
        });
    }
}

// Debounce and throttle utilities
class FunctionUtils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    static once(func) {
        let called = false;
        return function executedFunction(...args) {
            if (!called) {
                called = true;
                return func.apply(this, args);
            }
        };
    }
}

// Initialize utilities
document.addEventListener('DOMContentLoaded', () => {
    // Initialize performance monitor
    window.performanceMonitor = new PerformanceMonitor();
    
    // Initialize particle system when canvas is available
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        window.particleSystem = new ParticleSystem(canvas);
    }
    
    // Add CSS for utility classes
    const style = document.createElement('style');
    style.textContent = `
        .highlight {
            animation: highlight-pulse 1s ease-in-out;
        }
        
        @keyframes highlight-pulse {
            0%, 100% { box-shadow: 0 0 0 rgba(255, 193, 7, 0); }
            50% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.8); }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .floating-text {
            font-family: Arial, sans-serif;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal-content {
            background: white;
            border-radius: 8px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
        }
        
        .modal-footer {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }
    `;
    document.head.appendChild(style);
});

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceMonitor,
        ParticleSystem,
        StorageManager,
        MathUtils,
        ColorUtils,
        Timer,
        EventEmitter,
        DeviceUtils,
        ValidationUtils,
        FunctionUtils
    };
}
