import { useMemo, useState } from 'react';
import { ArrowLeft, Power, Search } from 'lucide-react';
import { WIN_APPS, type AppId } from '@/components/win11/appRegistry';

interface StartMenuProps {
  onOpenApp: (appId: AppId) => void;
  onExit: () => void;
  onShutDown: () => void;
}

export default function StartMenu({ onOpenApp, onExit, onShutDown }: StartMenuProps) {
  const [query, setQuery] = useState('');

  const apps = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? WIN_APPS.filter((app) => app.name.toLowerCase().includes(needle)) : WIN_APPS;
  }, [query]);

  return (
    <div
      role="dialog"
      aria-label="Start menu"
      className="absolute bottom-16 left-1/2 z-[9500] flex w-[min(92vw,560px)] -translate-x-1/2 animate-[fadeIn_180ms_ease-out] flex-col rounded-2xl border border-white/20 bg-slate-900/80 p-5 text-white shadow-2xl backdrop-blur-2xl"
    >
      <label className="relative">
        <span className="sr-only">Search apps</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type here to search"
          className="w-full rounded-full bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />
      </label>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-300">Pinned</p>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <li key={app.id}>
              <button
                type="button"
                onClick={() => onOpenApp(app.id)}
                className="flex w-full flex-col items-center gap-2 rounded-lg p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${app.iconClassName}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs text-slate-100">{app.name}</span>
              </button>
            </li>
          );
        })}
        {apps.length === 0 && <li className="col-span-full py-6 text-center text-sm text-slate-300">No apps match.</li>}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-slate-300">WeatherWise Desktop · Build 1</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-sky-200 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Exit to WeatherWise
          </button>
          <button
            type="button"
            onClick={onShutDown}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-200 transition-colors duration-200 hover:bg-red-600/80 hover:text-white"
          >
            <Power className="h-3.5 w-3.5" aria-hidden="true" />
            Shut down
          </button>
        </div>
      </div>
    </div>
  );
}
