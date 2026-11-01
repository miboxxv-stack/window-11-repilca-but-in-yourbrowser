import { BatteryFull, ChevronUp, LayoutGrid, Search, Volume2, Wifi } from 'lucide-react';
import { useClock } from '@/hooks/useClock';
import { WIN_APPS, type AppId } from '@/components/win11/appRegistry';

export interface OpenWindowSummary {
  appId: AppId;
  minimized: boolean;
  focused: boolean;
}

interface TaskbarProps {
  openWindows: OpenWindowSummary[];
  startOpen: boolean;
  onToggleStart: () => void;
  onAppClick: (appId: AppId) => void;
}

const TIME_FORMAT: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric', year: 'numeric' };

export default function Taskbar({ openWindows, startOpen, onToggleStart, onAppClick }: TaskbarProps) {
  const now = useClock();
  const pinnedOpen = (appId: AppId) => openWindows.find((window) => window.appId === appId);

  return (
    <div
      role="toolbar"
      aria-label="Taskbar"
      className="absolute inset-x-0 bottom-0 z-[9000] flex h-12 items-center justify-between border-t border-white/20 bg-slate-900/70 px-3 text-white backdrop-blur-2xl"
    >
      <div className="flex w-1/3 min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleStart}
          aria-label="Start"
          aria-expanded={startOpen}
          className={`flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200 hover:bg-white/15 ${
            startOpen ? 'bg-white/15' : ''
          }`}
        >
          <LayoutGrid className="h-5 w-5 text-sky-300" aria-hidden="true" />
        </button>
        <div className="hidden items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-xs text-slate-300 md:flex">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          Search
        </div>
      </div>

      <div className="flex items-center justify-center gap-1">
        {WIN_APPS.map((app) => {
          const state = pinnedOpen(app.id);
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => onAppClick(app.id)}
              aria-label={app.name}
              title={app.name}
              className="group relative flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/15"
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-md ${app.iconClassName}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {state && (
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0.5 h-1 rounded-full bg-sky-300 transition-all duration-200 ${
                    state.focused && !state.minimized ? 'w-4' : 'w-1.5'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex w-1/3 items-center justify-end gap-1">
        <button
          type="button"
          aria-label="Hidden icons"
          className="hidden h-8 w-8 items-center justify-center rounded-md hover:bg-white/15 sm:flex"
        >
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-200 hover:bg-white/15">
          <Wifi className="h-4 w-4" aria-hidden="true" />
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          <BatteryFull className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-end rounded-md px-2 py-1 text-right text-xs leading-tight transition-colors duration-200 hover:bg-white/15">
          <time dateTime={now.toISOString()} className="font-medium tabular-nums">
            {now.toLocaleTimeString([], TIME_FORMAT)}
          </time>
          <span className="text-slate-200">{now.toLocaleDateString([], DATE_FORMAT)}</span>
        </div>
      </div>
    </div>
  );
}
