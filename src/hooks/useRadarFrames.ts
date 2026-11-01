import { useEffect, useState } from 'react';

const RAINVIEWER_INDEX_URL = 'https://api.rainviewer.com/public/weather-maps.json';

export interface RadarFrame {
  time: number;
  url: string;
}

export interface RadarFramesState {
  frames: RadarFrame[];
  status: 'loading' | 'ready' | 'error';
}

interface RainViewerIndex {
  host: string;
  radar?: {
    past?: { time: number; path: string }[];
    nowcast?: { time: number; path: string }[];
  };
}

function isRainViewerIndex(value: unknown): value is RainViewerIndex {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<RainViewerIndex>;
  return typeof candidate.host === 'string' && typeof candidate.radar === 'object' && candidate.radar !== null;
}

export function useRadarFrames(): RadarFramesState {
  const [state, setState] = useState<RadarFramesState>({ frames: [], status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch(RAINVIEWER_INDEX_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`Radar index returned ${response.status}`);
        const data: unknown = await response.json();
        if (!isRainViewerIndex(data)) throw new Error('Unexpected radar index format');

        const past = data.radar?.past ?? [];
        const nowcast = data.radar?.nowcast ?? [];
        const frames = [...past, ...nowcast].map((entry) => ({
          time: entry.time,
          url: `${data.host}${entry.path}/256/{z}/{x}/{y}/2/1_1.png`,
        }));

        if (frames.length === 0) throw new Error('No radar frames available');
        setState({ frames, status: 'ready' });
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error(error);
        setState({ frames: [], status: 'error' });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return state;
}
