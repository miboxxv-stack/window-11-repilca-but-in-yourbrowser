import { useEffect, useState } from 'react';
import { Info, Layers, X } from 'lucide-react';
import type { RadarStation } from '@/data/radarStations';
import { useRadarFrames, type RadarFrame } from '@/hooks/useRadarFrames';
import RadarPlaybackControls from '@/components/radar/RadarPlaybackControls';
import RadarPlaybackMap from '@/components/radar/RadarPlaybackMap';

interface RadarDrawerProps {
  station: RadarStation | null;
  onClose: () => void;
}

interface Overlays {
  radar: boolean;
  coverage: boolean;
  station: boolean;
}

const DEFAULT_OVERLAYS: Overlays = { radar: true, coverage: true, station: true };

export default function RadarDrawer({ station, onClose }: RadarDrawerProps) {
  if (!station) return null;
  return <RadarDrawerPanel key={station.code} station={station} onClose={onClose} />;
}

function RadarDrawerPanel({ station, onClose }: { station: RadarStation; onClose: () => void }) {
  const { frames, status } = useRadarFrames();
  const [frame, setFrame] = useState<RadarFrame | null>(null);
  const [overlays, setOverlays] = useState<Overlays>(DEFAULT_OVERLAYS);
  const [opacity, setOpacity] = useState(0.7);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const toggleOverlay = (key: keyof Overlays) => {
    setOverlays((previous) => ({ ...previous, [key]: !previous[key] }));
  };

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="radar-drawer-title">
      <button
        type="button"
        aria-label="Close radar drawer"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-[fadeIn_200ms_ease-out]"
      />

      <aside className="relative flex h-full w-full max-w-md animate-[slideIn_250ms_ease-out] flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-lg">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-ww-navy px-6 py-5 text-white">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-ww-amber">{station.code}</p>
            <h2 id="radar-drawer-title" className="mt-1 text-xl font-bold">
              {station.name}
            </h2>
            <p className="mt-1 font-mono text-xs text-slate-300">
              {station.lat.toFixed(4)}, {station.lon.toFixed(4)} · {station.country === 'CA' ? 'Canada' : 'United States'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close radar drawer"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-6 p-6">
          <section aria-label="Products" className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border-2 border-ww-navy bg-slate-50 p-4 shadow-sm">
              <p className="text-sm font-bold text-ww-navy">Reflectivity</p>
              <p className="mt-1 text-xs text-slate-600">Rain, snow and hail intensity</p>
            </div>
            <div
              aria-disabled="true"
              className="rounded-xl border border-dashed border-slate-300 bg-white p-4 opacity-70"
            >
              <p className="text-sm font-bold text-slate-500">Velocity</p>
              <p className="mt-1 text-xs text-slate-500">Not in the public radar feed</p>
            </div>
          </section>

          <section aria-label="Radar map" className="h-72 overflow-hidden rounded-xl border border-slate-200 shadow-inner">
            <RadarPlaybackMap
              station={station}
              frameUrl={overlays.radar && frame ? frame.url : null}
              opacity={opacity}
              showCoverage={overlays.coverage}
              showStation={overlays.station}
            />
          </section>

          {status === 'error' ? (
            <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p>Radar frames could not be loaded right now. Check your connection and reopen this station.</p>
            </div>
          ) : (
            <RadarPlaybackControls frames={frames} status={status} onFrameChange={setFrame} />
          )}

          <section aria-label="Overlays" className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ww-navy">
              <Layers className="h-4 w-4" aria-hidden="true" />
              Overlays
            </div>
            <ToggleRow label="Radar imagery" checked={overlays.radar} onChange={() => toggleOverlay('radar')} />
            <ToggleRow label="Coverage area (230 km)" checked={overlays.coverage} onChange={() => toggleOverlay('coverage')} />
            <ToggleRow label="Station marker" checked={overlays.station} onChange={() => toggleOverlay('station')} />
          </section>

          <section aria-label="Settings" className="space-y-3">
            <p className="text-sm font-semibold text-ww-navy">Settings</p>
            <label className="block text-sm text-slate-700">
              <span className="flex items-center justify-between">
                Radar opacity
                <span className="font-mono text-slate-500">{Math.round(opacity * 100)}%</span>
              </span>
              <input
                type="range"
                min={20}
                max={100}
                value={Math.round(opacity * 100)}
                onChange={(event) => setOpacity(Number(event.target.value) / 100)}
                className="mt-2 w-full accent-ww-navy"
              />
            </label>
          </section>
        </div>
      </aside>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleRow({ label, checked, onChange }: ToggleRowProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg px-1 py-1.5 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50">
      {label}
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-ww-navy" />
    </label>
  );
}
