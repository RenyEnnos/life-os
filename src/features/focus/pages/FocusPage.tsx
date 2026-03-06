import { useEffect } from 'react';
import { useFocusStore } from '../stores/useFocusStore';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const FocusPage = () => {
  const {
    timerState,
    secondsRemaining,
    label,
    startFocus,
    stopFocus,
    pauseFocus,
    resumeFocus,
    tick,
  } = useFocusStore();

  useEffect(() => {
    if (timerState !== 'running') return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [timerState, tick]);

  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';
  const isIdle = timerState === 'idle';

  const handleAddTime = () => {
    useFocusStore.setState(state => ({ secondsRemaining: state.secondsRemaining + 300 }));
  };

  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      <div className="flex h-screen w-full">
        <main className="flex-1 flex flex-col items-center justify-center relative">
          {/* Status Badge */}
          <div className="absolute top-12 left-12 flex items-center gap-4">
            <div className={`size-2 rounded-full ${isRunning ? 'bg-primary animate-pulse' : 'bg-white/20'}`}></div>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
              {isRunning ? 'Focus Active' : isPaused ? 'Paused' : 'Ready'}
            </span>
          </div>

          {/* Center Stage: Timer */}
          <div className="flex flex-col items-center gap-12">
            <div className="relative flex items-center justify-center">
              <div className="circular-progress size-[420px] rounded-full flex items-center justify-center glow-effect">
                <div className="text-center">
                  <span className="text-[110px] font-light tracking-tighter leading-none">
                    {formatTime(secondsRemaining)}
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border border-primary/10 animate-pulse"></div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-light text-white tracking-wide">
                {label || 'Deep Work Session'}
              </h2>
              <p className="text-white/30 text-sm mt-3 tracking-widest uppercase">
                {isIdle ? 'Press Start to begin' : isRunning ? 'Stay focused' : 'Session paused'}
              </p>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-12 flex flex-col items-center gap-6">
            <div className="glass-pill rounded-full px-2 py-2 flex items-center gap-1">
              {isIdle ? (
                <button
                  onClick={() => startFocus()}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  <span className="text-sm font-bold uppercase tracking-wider">Start</span>
                </button>
              ) : isRunning ? (
                <button
                  onClick={pauseFocus}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
                  <span className="text-sm font-bold uppercase tracking-wider">Pause</span>
                </button>
              ) : (
                <button
                  onClick={resumeFocus}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  <span className="text-sm font-bold uppercase tracking-wider">Resume</span>
                </button>
              )}
              {!isIdle && (
                <>
                  <button
                    onClick={stopFocus}
                    className="flex items-center justify-center size-12 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span className="material-symbols-outlined">stop</span>
                  </button>
                  <div className="w-px h-6 bg-white/10 mx-1"></div>
                  <button
                    onClick={handleAddTime}
                    className="flex items-center justify-center px-5 h-12 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span className="text-sm font-medium">+5m</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
