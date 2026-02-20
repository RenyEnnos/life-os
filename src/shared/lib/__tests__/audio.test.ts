import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    startNoise,
    stopNoise,
    setNoiseVolume,
    isNoisePlaying,
    disposeAudio
} from '../audio/noiseGenerator';

// Mock Web Audio API
const mockAudioContext = {
    sampleRate: 48000,
    state: 'running',
    resume: vi.fn(),
    close: vi.fn(),
    createBuffer: vi.fn(),
    createBufferSource: vi.fn(),
    createGain: vi.fn(),
    currentTime: 0,
    destination: {}
};

const mockAudioBuffer = {
    getChannelData: vi.fn(() => new Float32Array(48000))
};

const mockBufferSource = {
    buffer: null,
    loop: false,
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn()
};

const mockGainNode = {
    gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn()
    },
    connect: vi.fn(),
    disconnect: vi.fn()
};

// Setup global mocks
global.AudioContext = vi.fn(() => mockAudioContext) as any;

beforeEach(() => {
    // Use fake timers to handle setTimeout in stopNoise
    vi.useFakeTimers();

    // Reset all mocks before each test
    vi.clearAllMocks();
    mockAudioContext.createBuffer.mockReturnValue(mockAudioBuffer);
    mockAudioContext.createBufferSource.mockReturnValue(mockBufferSource);
    mockAudioContext.createGain.mockReturnValue(mockGainNode);
    mockAudioContext.currentTime = 0;
    mockBufferSource.buffer = null;
    mockBufferSource.loop = false;

    // Clean up any existing audio state
    disposeAudio();
    vi.advanceTimersByTime(500);
});

afterEach(() => {
    // Clean up after each test
    disposeAudio();
    vi.advanceTimersByTime(500);
    vi.useRealTimers();
});

describe('audio/noiseGenerator', () => {
    describe('startNoise', () => {
        it('should create AudioContext if not exists', () => {
            startNoise('white', 0.3);

            expect(AudioContext).toHaveBeenCalled();
        });

        it('should resume suspended AudioContext', () => {
            mockAudioContext.state = 'suspended';
            startNoise('white', 0.3);

            expect(mockAudioContext.resume).toHaveBeenCalled();
        });

        it('should generate white noise buffer', () => {
            startNoise('white', 0.3);

            expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(2, 480000, 48000);
        });

        it('should generate pink noise buffer', () => {
            startNoise('pink', 0.3);

            expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(2, 480000, 48000);
        });

        it('should generate brown noise buffer by default', () => {
            startNoise('brown', 0.3);

            expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(2, 480000, 48000);
        });

        it('should create buffer source and gain nodes', () => {
            startNoise('white', 0.3);

            expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
            expect(mockAudioContext.createGain).toHaveBeenCalled();
        });

        it('should connect audio nodes correctly', () => {
            startNoise('white', 0.3);

            expect(mockBufferSource.connect).toHaveBeenCalledWith(mockGainNode);
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
        });

        it('should set buffer source to loop', () => {
            startNoise('white', 0.3);

            expect(mockBufferSource.loop).toBe(true);
        });

        it('should start playback', () => {
            startNoise('white', 0.3);

            expect(mockBufferSource.start).toHaveBeenCalledWith(0);
        });

        it('should apply fade-in effect', () => {
            startNoise('white', 0.5);

            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.5, 0.5);
        });

        it('should stop existing noise before starting new one', () => {
            startNoise('white', 0.3);
            const firstCallCount = mockBufferSource.connect.mock.calls.length;

            startNoise('pink', 0.4);

            expect(mockBufferSource.connect.mock.calls.length).toBeGreaterThan(firstCallCount);
        });
    });

    describe('stopNoise', () => {
        it('should do nothing if noise is not playing', () => {
            stopNoise();

            expect(mockGainNode.disconnect).not.toHaveBeenCalled();
        });

        it('should apply fade-out effect when playing', () => {
            startNoise('white', 0.3);
            stopNoise();

            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 0.5);
        });

        it('should stop and disconnect buffer source after fade', () => {
            startNoise('white', 0.3);

            stopNoise();
            vi.advanceTimersByTime(500);

            expect(mockBufferSource.stop).toHaveBeenCalled();
            expect(mockBufferSource.disconnect).toHaveBeenCalled();
        });

        it('should disconnect gain node after fade', () => {
            startNoise('white', 0.3);

            stopNoise();
            vi.advanceTimersByTime(500);

            expect(mockGainNode.disconnect).toHaveBeenCalled();
        });

        it('should handle already stopped sources gracefully', () => {
            startNoise('white', 0.3);
            mockBufferSource.stop.mockImplementation(() => {
                throw new Error('Already stopped');
            });

            expect(() => {
                stopNoise();
                vi.advanceTimersByTime(500);
            }).not.toThrow();
        });
    });

    describe('setNoiseVolume', () => {
        it('should set volume when noise is playing', () => {
            startNoise('white', 0.3);
            setNoiseVolume(0.7);

            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.7, 0.1);
        });

        it('should not crash when noise is not playing', () => {
            expect(() => setNoiseVolume(0.5)).not.toThrow();
        });

        it('should clamp volume to maximum 1', () => {
            startNoise('white', 0.3);
            setNoiseVolume(1.5);

            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(1, 0.1);
        });

        it('should clamp volume to minimum 0', () => {
            startNoise('white', 0.3);
            setNoiseVolume(-0.5);

            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 0.1);
        });
    });

    describe('isNoisePlaying', () => {
        it('should return false when no noise is playing', () => {
            expect(isNoisePlaying()).toBe(false);
        });

        it('should return true after starting noise', () => {
            startNoise('white', 0.3);
            expect(isNoisePlaying()).toBe(true);
        });

        it('should return false after stopping noise', () => {
            startNoise('white', 0.3);

            stopNoise();
            vi.advanceTimersByTime(500);

            expect(isNoisePlaying()).toBe(false);
        });
    });

    describe('disposeAudio', () => {
        it('should close audio context', () => {
            startNoise('white', 0.3);
            disposeAudio();

            expect(mockAudioContext.close).toHaveBeenCalled();
        });

        it('should stop noise before disposing', () => {
            startNoise('white', 0.3);
            disposeAudio();

            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 0.5);
        });

        it('should not crash when audio context does not exist', () => {
            expect(() => disposeAudio()).not.toThrow();
        });

        it('should create new AudioContext after disposal', () => {
            startNoise('white', 0.3);
            disposeAudio();

            const callCountBefore = (AudioContext as any).mock.calls.length;
            startNoise('pink', 0.4);

            expect((AudioContext as any).mock.calls.length).toBeGreaterThan(callCountBefore);
        });
    });

    describe('noise types', () => {
        it('should handle all noise types correctly', () => {
            const types = ['white', 'pink', 'brown'] as const;

            types.forEach((type) => {
                expect(() => startNoise(type, 0.3)).not.toThrow();
            });
        });

        it('should generate buffers with correct duration', () => {
            startNoise('white', 0.3);

            // 10 seconds * sample rate (48000) = 480000 samples
            expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(2, 480000, 48000);
        });

        it('should create stereo buffers (2 channels)', () => {
            startNoise('white', 0.3);

            expect(mockAudioContext.createBuffer).toHaveBeenCalledWith(2, expect.any(Number), expect.any(Number));
        });
    });
});
