import { useEffect, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import type { RadarFrame } from '@/hooks/useRadarFrames';

const SPEEDS = {
  slow: { label: 'Slow', ms: 1200 },
  normal: { label: 'Normal', ms: 700 },
  fast: { label: 'Fast', ms: 350 },
} as const;

type SpeedKey = keyof typeof SPEEDS;

interface RadarPlaybackControlsProps {
  frames: RadarFrame[];
  status: 'loading' | 'ready' | 'error';
  onFrameChange: (frame: RadarFrame | null) => void;
}

export default function RadarPlaybackControls({ frames, status, onFrameChange }: RadarPlaybackControlsProps) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<SpeedKey>('normal');

  const lastIndex = Math.max(frames.length - 1, 0);
  const currentIndex = Math.min(index, lastIndex);
  const currentFrame = frames[currentIndex] ?? null;

  useEffect(() => {
    onFrameChange(currentFrame);
  }, [currentFrame, onFrameChange]);

  useEffect(() => {
    if (!playing || frames.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((previous) => (previous >= lastIndex ? 0 : previous + 1));
    }, SPEEDS[speed].ms);
    return () => window.clearInterval(timer);
  }, [playing, speed, frames.length, lastIndex]);

  const canPlay = status === 'ready' && frames.length > 1;
  const timeLabel = currentFrame
    ? new Date(currentFrame.time * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '--:--';

  const step = (delta: number) => {
    setPlaying(false);
    setIndex((previous) => (previous + delta + frames.length) % frames.length);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ww-navy">Playback</span>
        <span className="font-mono text-slate-600" aria-live="polite">
          {status === 'ready' ? timeLabel : status === 'loading' ? 'Loading frames...' : 'Unavailable'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canPlay}
          aria-label="Previous frame"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SkipBack className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          disabled={!canPlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ww-navy text-white transition-colors duration-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canPlay}
          aria-label="Next frame"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors duration-200 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SkipForward className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          type="range"
          min={0}
          max={lastIndex}
          value={currentIndex}
          disabled={!canPlay}
          onChange={(event) => {
            setPlaying(false);
            setIndex(Number(event.target.value));
          }}
          aria-label="Frame position"
          className="flex-1 accent-ww-navy disabled:opacity-40"
        />
      </div>

      <label className="flex items-center justify-between text-sm text-slate-700">
        Animation speed
        <select
          value={speed}
          onChange={(event) => setSpeed(event.target.value as SpeedKey)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ww-amber"
        >
          {(Object.keys(SPEEDS) as SpeedKey[]).map((key) => (
            <option key={key} value={key}>
              {SPEEDS[key].label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
