/**
 * Memory Match Pro - Audio Manager
 * Handles sound effects, background music, and audio settings
 * @author Gzeu
 * @version 1.0.0
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.7;
        this.isMuted = false;
        this.sounds = new Map();
        this.musicTracks = new Map();
        this.currentMusic = null;
        this.fadeTimeout = null;
        
        // Sound effects configuration
        this.soundConfig = {
            flip: {
                frequency: 440,
                duration: 0.1,
                type: 'sine',
                volume: 0.3
            },
            match: {
                frequency: 660,
                duration: 0.2,
                type: 'triangle',
                volume: 0.4
            },
            victory: {
                frequencies: [440, 554, 659, 880],
                duration: 0.8,
                type: 'sine',
                volume: 0.5
            },
            error: {
                frequency: 200,
                duration: 0.3,
                type: 'sawtooth',
                volume: 0.2
            },
            click: {
                frequency: 800,
                duration: 0.05,
                type: 'square',
                volume: 0.1
            },
            levelUp: {
                frequencies: [523, 659, 784, 1047],
                duration: 1.0,
                type: 'sine',
                volume: 0.6
            }
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Initialize Web Audio API
            await this.initAudioContext();
            
            // Generate sound effects
            this.generateSounds();
            
            // Load saved settings
            this.loadSettings();
            
            console.log('Audio Manager initialized successfully');
        } catch (error) {
            console.warn('Audio initialization failed:', error);
            // Fallback to HTML5 audio if Web Audio API fails
            this.initFallbackAudio();
        }
    }
    
    async initAudioContext() {
        if (typeof AudioContext !== 'undefined') {
            this.audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new webkitAudioContext();
        } else {
            throw new Error('Web Audio API not supported');
        }
        
        // Resume audio context on first user interaction
        if (this.audioContext.state === 'suspended') {
            document.addEventListener('click', this.resumeAudioContext.bind(this), { once: true });
            document.addEventListener('keydown', this.resumeAudioContext.bind(this), { once: true });
        }
    }
    
    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('Audio context resumed');
            } catch (error) {
                console.warn('Failed to resume audio context:', error);
            }
        }
    }
    
    generateSounds() {
        Object.entries(this.soundConfig).forEach(([name, config]) => {
            if (config.frequencies) {
                // Multi-tone sound (like victory)
                this.sounds.set(name, this.createMultiToneSound(config));
            } else {
                // Single tone sound
                this.sounds.set(name, this.createToneSound(config));
            }
        });
    }
    
    createToneSound(config) {
        return () => {
            if (!this.audioContext || this.isMuted) return;
            
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
                oscillator.type = config.type;
                
                // Envelope for smooth attack and decay
                const now = this.audioContext.currentTime;
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(config.volume * this.masterVolume, now + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + config.duration);
                
                oscillator.start(now);
                oscillator.stop(now + config.duration);
                
                // Clean up
                oscillator.onended = () => {
                    oscillator.disconnect();
                    gainNode.disconnect();
                };
            } catch (error) {
                console.warn('Failed to play sound:', error);
            }
        };
    }
    
    createMultiToneSound(config) {
        return () => {
            if (!this.audioContext || this.isMuted) return;
            
            config.frequencies.forEach((frequency, index) => {
                setTimeout(() => {
                    this.playTone(frequency, config.duration / config.frequencies.length, config.type, config.volume);
                }, index * (config.duration * 1000) / config.frequencies.length);
            });
        };
    }
    
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext || this.isMuted) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
            
            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
            };
        } catch (error) {
            console.warn('Failed to play tone:', error);
        }
    }
    
    initFallbackAudio() {
        // HTML5 Audio fallback for browsers without Web Audio API
        console.log('Using HTML5 Audio fallback');
        
        // Create simple audio elements for basic feedback
        this.sounds.set('flip', () => this.playBeep(440, 100));
        this.sounds.set('match', () => this.playBeep(660, 200));
        this.sounds.set('victory', () => this.playMelody([440, 554, 659, 880]));
        this.sounds.set('error', () => this.playBeep(200, 300));
        this.sounds.set('click', () => this.playBeep(800, 50));
    }
    
    playBeep(frequency, duration) {
        // Fallback beep using data URI and Audio element
        if (this.isMuted) return;
        
        try {
            const audio = new Audio();
            const sampleRate = 44100;
            const samples = duration * sampleRate / 1000;
            const buffer = new ArrayBuffer(samples * 2);
            const view = new DataView(buffer);
            
            for (let i = 0; i < samples; i++) {
                const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3 * this.masterVolume;
                view.setInt16(i * 2, sample * 32767, true);
            }
            
            const blob = new Blob([buffer], { type: 'audio/wav' });
            audio.src = URL.createObjectURL(blob);
            audio.volume = this.masterVolume;
            audio.play().catch(console.warn);
        } catch (error) {
            console.warn('Fallback audio failed:', error);
        }
    }
    
    playMelody(frequencies) {
        frequencies.forEach((freq, index) => {
            setTimeout(() => this.playBeep(freq, 150), index * 200);
        });
    }
    
    playSound(soundName) {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound();
        } else {
            console.warn(`Sound '${soundName}' not found`);
        }
    }
    
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    getVolume() {
        return this.masterVolume;
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.saveSettings();
        return this.isMuted;
    }
    
    setMuted(muted) {
        this.isMuted = muted;
        this.saveSettings();
    }
    
    loadMusic(name, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.src = url;
            audio.loop = true;
            audio.volume = this.masterVolume * 0.5; // Background music is quieter
            
            audio.addEventListener('canplaythrough', () => {
                this.musicTracks.set(name, audio);
                resolve(audio);
            });
            
            audio.addEventListener('error', reject);
            audio.load();
        });
    }
    
    async playMusic(name, fadeIn = true) {
        const track = this.musicTracks.get(name);
        if (!track || this.isMuted) return;
        
        // Stop current music
        if (this.currentMusic && this.currentMusic !== track) {
            await this.stopMusic(true);
        }
        
        this.currentMusic = track;
        
        if (fadeIn) {
            track.volume = 0;
            track.play().catch(console.warn);
            
            // Fade in
            const fadeInInterval = setInterval(() => {
                if (track.volume < this.masterVolume * 0.5) {
                    track.volume = Math.min(track.volume + 0.05, this.masterVolume * 0.5);
                } else {
                    clearInterval(fadeInInterval);
                }
            }, 50);
        } else {
            track.volume = this.masterVolume * 0.5;
            track.play().catch(console.warn);
        }
    }
    
    async stopMusic(fadeOut = true) {
        if (!this.currentMusic) return;
        
        const track = this.currentMusic;
        
        if (fadeOut) {
            const fadeOutInterval = setInterval(() => {
                if (track.volume > 0.05) {
                    track.volume = Math.max(track.volume - 0.05, 0);
                } else {
                    track.pause();
                    track.currentTime = 0;
                    clearInterval(fadeOutInterval);
                }
            }, 50);
        } else {
            track.pause();
            track.currentTime = 0;
        }
        
        this.currentMusic = null;
    }
    
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }
    
    resumeMusic() {
        if (this.currentMusic && !this.isMuted) {
            this.currentMusic.play().catch(console.warn);
        }
    }
    
    createSpatialSound(x, y, canvasWidth, canvasHeight) {
        // Create spatial audio effect based on position
        if (!this.audioContext) return null;
        
        const panner = this.audioContext.createStereoPanner();
        
        // Calculate pan position (-1 to 1)
        const panValue = (x / canvasWidth) * 2 - 1;
        panner.pan.setValueAtTime(panValue, this.audioContext.currentTime);
        
        return panner;
    }
    
    playSpatialSound(soundName, x, y, canvasWidth, canvasHeight) {
        if (!this.audioContext || this.isMuted) return;
        
        const panner = this.createSpatialSound(x, y, canvasWidth, canvasHeight);
        if (!panner) {
            // Fallback to normal sound
            this.playSound(soundName);
            return;
        }
        
        const config = this.soundConfig[soundName];
        if (!config) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(panner);
            panner.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);
            oscillator.type = config.type;
            
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(config.volume * this.masterVolume, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + config.duration);
            
            oscillator.start(now);
            oscillator.stop(now + config.duration);
            
            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
                panner.disconnect();
            };
        } catch (error) {
            console.warn('Failed to play spatial sound:', error);
        }
    }
    
    saveSettings() {
        const settings = {
            volume: this.masterVolume,
            muted: this.isMuted
        };
        
        localStorage.setItem('memoryMatchAudioSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('memoryMatchAudioSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.masterVolume = settings.volume || 0.7;
                this.isMuted = settings.muted || false;
            }
        } catch (error) {
            console.warn('Failed to load audio settings:', error);
        }
    }
    
    // Audio visualization methods
    createAnalyser() {
        if (!this.audioContext) return null;
        
        const analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        
        return analyser;
    }
    
    getFrequencyData(analyser) {
        if (!analyser) return null;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        return dataArray;
    }
    
    // Cleanup
    destroy() {
        this.stopMusic(false);
        
        if (this.fadeTimeout) {
            clearTimeout(this.fadeTimeout);
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.sounds.clear();
        this.musicTracks.clear();
    }
}

// Initialize Audio Manager
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
