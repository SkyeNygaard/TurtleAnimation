class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.setupAudio();
    }

    async setupAudio() {
        // Original underwater ambience
        const underwater = this.audioContext.createOscillator();
        underwater.type = 'sine';
        underwater.frequency.setValueAtTime(100, this.audioContext.currentTime);
        
        // Cursed singing oscillators
        const singingOsc1 = this.audioContext.createOscillator();
        const singingOsc2 = this.audioContext.createOscillator();
        
        singingOsc1.type = 'sawtooth';
        singingOsc2.type = 'square';
        
        const singingGain = this.audioContext.createGain();
        singingGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        
        // Connect everything
        underwater.connect(this.audioContext.destination);
        singingOsc1.connect(singingGain);
        singingOsc2.connect(singingGain);
        singingGain.connect(this.audioContext.destination);
        
        underwater.start();
        singingOsc1.start();
        singingOsc2.start();
        
        // Modulate the singing
        setInterval(() => {
            const time = this.audioContext.currentTime;
            singingOsc1.frequency.setValueAtTime(
                300 + Math.sin(time * 0.5) * 100,
                time
            );
            singingOsc2.frequency.setValueAtTime(
                400 + Math.cos(time * 0.3) * 150,
                time
            );
        }, 50);
    }
}

// Initialize audio when user interacts with the page
document.addEventListener('click', () => {
    new AudioManager();
}, { once: true });
