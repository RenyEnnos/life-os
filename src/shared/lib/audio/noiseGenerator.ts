/**
 * Web Audio API Noise Generator
 * 
 * Generates white, pink, and brown noise mathematically without external files.
 * Used for Sanctuary Mode ambient audio.
 */

export type NoiseType = 'white' | 'pink' | 'brown';

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;
let isPlaying = false;

/**
 * Get or create the AudioContext
 */
function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
}

/**
 * Generate white noise buffer
 * Pure random values between -1 and 1
 */
function generateWhiteNoise(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    }

    return buffer;
}

/**
 * Generate pink noise buffer
 * Filtered white noise with 1/f spectral density
 */
function generatePinkNoise(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);

        // Pink noise generation using Voss-McCartney algorithm
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;

            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;

            const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            b6 = white * 0.115926;

            data[i] = pink * 0.11; // Scale to prevent clipping
        }
    }

    return buffer;
}

/**
 * Generate brown (red) noise buffer
 * Integration of white noise, deeper than pink
 */
function generateBrownNoise(ctx: AudioContext, duration: number): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let lastOut = 0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + (0.02 * white)) / 1.02;
            data[i] = lastOut * 3.5; // Scale for audible volume
        }
    }

    return buffer;
}

/**
 * Start playing noise
 */
export function startNoise(type: NoiseType, volume: number = 0.3): void {
    stopNoise();

    const ctx = getAudioContext();

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    // Generate noise buffer (10 seconds, looped)
    let buffer: AudioBuffer;
    switch (type) {
        case 'white':
            buffer = generateWhiteNoise(ctx, 10);
            break;
        case 'pink':
            buffer = generatePinkNoise(ctx, 10);
            break;
        case 'brown':
        default:
            buffer = generateBrownNoise(ctx, 10);
            break;
    }

    // Create source node
    currentSource = ctx.createBufferSource();
    currentSource.buffer = buffer;
    currentSource.loop = true;

    // Create gain node for volume control
    gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5); // Fade in

    // Connect nodes
    currentSource.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start playback
    currentSource.start(0);
    isPlaying = true;
}

/**
 * Stop playing noise with fade out
 */
export function stopNoise(): void {
    if (!isPlaying || !gainNode || !currentSource || !audioContext) {
        return;
    }

    // Fade out
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);

    // Stop after fade
    setTimeout(() => {
        if (currentSource) {
            try {
                currentSource.stop();
            } catch {
                // Already stopped
            }
            currentSource.disconnect();
            currentSource = null;
        }
        if (gainNode) {
            gainNode.disconnect();
            gainNode = null;
        }
        isPlaying = false;
    }, 500);
}

/**
 * Set volume (0-1)
 */
export function setNoiseVolume(volume: number): void {
    if (gainNode && audioContext) {
        gainNode.gain.linearRampToValueAtTime(
            Math.max(0, Math.min(1, volume)),
            audioContext.currentTime + 0.1
        );
    }
}

/**
 * Check if noise is currently playing
 */
export function isNoisePlaying(): boolean {
    return isPlaying;
}

/**
 * Clean up audio context
 */
export function disposeAudio(): void {
    stopNoise();
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}
