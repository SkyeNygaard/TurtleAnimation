class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.setupAudio();
    }

    async setupAudio() {
        // Create underwater ambience
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        
        // Modulate the sound for an eerie effect
        this.modulateSound(oscillator, gainNode);
    }

    modulateSound(oscillator, gainNode) {
        const lfoFreq = 0.1;
        setInterval(() => {
            const time = this.audioContext.currentTime;
            oscillator.frequency.setValueAtTime(
                100 + Math.sin(time * lfoFreq) * 20,
                time
            );
            gainNode.gain.setValueAtTime(
                0.1 + Math.sin(time * lfoFreq * 0.5) * 0.05,
                time
            );
        }, 50);
    }
}

// Initialize audio when user interacts with the page
document.addEventListener('click', () => {
    new AudioManager();
}, { once: true });
