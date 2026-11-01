import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, Globe, Info, LogOut, Play, Settings, ShieldAlert, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BrickRigsGameProps {
  onExit: () => void;
}

type Screen = 'menu' | 'host';

const MULTIPLAYER_OPTIONS = ['Off', 'Invite only', 'Unlisted', 'Public'] as const;
const GAME_MODES = ['Sandbox', 'Battle', 'Conquest', 'Deathmatch'] as const;
const LEVELS = [
  { name: 'Bricksville', artClassName: 'from-sky-400 to-slate-600' },
  { name: 'Canyon', artClassName: 'from-amber-500 to-orange-800' },
  { name: 'City', artClassName: 'from-slate-400 to-slate-700' },
  { name: 'Desert', artClassName: 'from-yellow-300 to-amber-700' },
  { name: 'Grid map', artClassName: 'from-zinc-300 to-zinc-600' },
  { name: 'Racetrack', artClassName: 'from-lime-400 to-green-800' },
  { name: 'Space', artClassName: 'from-slate-800 to-black' },
] as const;

export default function BrickRigsGame({ onExit }: BrickRigsGameProps) {
  const [screen, setScreen] = useState<Screen>('menu');

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-gradient-to-b from-sky-300 via-sky-500 to-slate-600 font-sans text-white">
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-slate-600 to-slate-800" aria-hidden="true" />
      <BrickRigsLogo />
      <div className="absolute right-4 top-4 w-56 rounded-md bg-[#2b2e35]/90 px-3 py-2 text-sm shadow-lg">
        <p className="font-semibold">Language</p>
        <p className="mt-1 rounded bg-[#3b3f48] px-2 py-1 text-center">English</p>
      </div>

      {screen === 'menu' ? (
        <MainMenu onStart={() => setScreen('host')} onQuit={onExit} />
      ) : (
        <HostMenu onBack={() => setScreen('menu')} />
      )}

      <p className="absolute bottom-3 left-3 text-xs text-white/80">Version 1.11.7</p>
    </div>
  );
}

function BrickRigsLogo() {
  return (
    <div className="absolute left-4 top-4 z-10 flex h-24 w-[27rem] items-center justify-center rounded-sm bg-[#e8892c] shadow-xl">
      <span className="select-none text-6xl font-black tracking-tight text-[#2d2f36] drop-shadow-sm">BrickRigs</span>
    </div>
  );
}

interface MainMenuProps {
  onStart: () => void;
  onQuit: () => void;
}

function MainMenu({ onStart, onQuit }: MainMenuProps) {
  return (
    <nav aria-label="Main menu" className="absolute left-4 top-32 z-10 flex w-64 flex-col rounded-sm bg-[#2b2e35]/90 p-1 shadow-xl">
      <MenuItem icon={Play} label="Start game" onClick={onStart} highlighted />
      <MenuItem icon={Users} label="Join game" disabled />
      <MenuItem icon={Settings} label="Options" disabled />
      <MenuItem icon={Info} label="About" disabled />
      <MenuItem icon={LogOut} label="Quit game" onClick={onQuit} />
    </nav>
  );
}

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  highlighted?: boolean;
}

function MenuItem({ icon: Icon, label, onClick, disabled, highlighted }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 px-3 py-2 text-left text-base font-semibold transition-colors duration-150 ${
        disabled
          ? 'cursor-not-allowed text-white/40'
          : highlighted
            ? 'bg-gradient-to-r from-slate-500 to-[#3b3f48] hover:from-slate-400'
            : 'hover:bg-white/10'
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      {label}
    </button>
  );
}

interface HostMenuProps {
  onBack: () => void;
}

function HostMenu({ onBack }: HostMenuProps) {
  const [multiplayer, setMultiplayer] = useState<(typeof MULTIPLAYER_OPTIONS)[number]>('Public');
  const [serverName, setServerName] = useState('BRICKSVILLE CANADIAN ROLEPLAY | STORM CHASING | NON-STRICT');
  const [slots, setSlots] = useState(12);
  const [level, setLevel] = useState<(typeof LEVELS)[number]['name']>('Bricksville');
  const [mode, setMode] = useState<(typeof GAME_MODES)[number]>('Sandbox');
  const [timeOfDay, setTimeOfDay] = useState(14);
  const [hostNote, setHostNote] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-10">
      <div className="absolute left-4 top-32 flex w-64 flex-col rounded-sm bg-[#2b2e35]/90 p-1 shadow-xl">
        <button type="button" onClick={onBack} className="flex items-center gap-3 px-3 py-2 text-left font-semibold hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setHostNote(`Server settings saved: ${serverName.trim() || 'Untitled server'}, ${slots} slots, ${level}, ${mode}.`)}
          className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 px-3 py-2 text-left font-semibold"
        >
          <Play className="h-5 w-5" aria-hidden="true" />
          Host online game
        </button>
        <button type="button" disabled className="flex cursor-not-allowed items-center gap-3 bg-red-700/80 px-3 py-2 text-left font-semibold text-white/50">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
          Manage bans
        </button>
      </div>

      <div className="absolute bottom-4 left-[17rem] right-4 top-32 flex flex-col overflow-hidden rounded-sm bg-[#2b2e35]/95 shadow-2xl">
        <header className="bg-[#33363e] py-3 text-center text-lg font-bold">Host</header>
        <div className="space-y-4 overflow-y-auto p-4">
          <SettingRow label="Multiplayer">
            <div className="flex overflow-hidden rounded-sm">
              {MULTIPLAYER_OPTIONS.map((option) => (
                <SegmentButton key={option} active={multiplayer === option} onClick={() => setMultiplayer(option)}>
                  {option}
                </SegmentButton>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Server name">
            <input
              value={serverName}
              onChange={(event) => setServerName(event.target.value)}
              className="w-full rounded-sm bg-[#1c1e23] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500"
            />
          </SettingRow>

          <SettingRow label="Player slots">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2}
                max={16}
                value={slots}
                onChange={(event) => setSlots(Number(event.target.value))}
                className="w-full accent-orange-500"
                aria-label="Player slots"
              />
              <span className="w-8 text-right font-mono text-sm">{slots}</span>
            </div>
          </SettingRow>

          <section aria-label="Match" className="space-y-3 border-t border-white/10 pt-4">
            <h3 className="text-center text-base font-bold">Match</h3>
            <SettingRow label="Level">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {LEVELS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setLevel(item.name)}
                    aria-pressed={level === item.name}
                    className={`flex flex-col items-center gap-1 rounded-sm p-1 text-xs transition-colors duration-150 ${
                      level === item.name ? 'bg-white/15 ring-2 ring-orange-500' : 'hover:bg-white/10'
                    }`}
                  >
                    <span className={`h-12 w-full rounded-sm bg-gradient-to-br ${item.artClassName}`} aria-hidden="true" />
                    {item.name}
                  </button>
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Game mode">
              <div className="flex overflow-hidden rounded-sm">
                {GAME_MODES.map((option) => (
                  <SegmentButton key={option} active={mode === option} onClick={() => setMode(option)}>
                    {option}
                  </SegmentButton>
                ))}
              </div>
            </SettingRow>

            <SettingRow label="Time of day">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={timeOfDay}
                  onChange={(event) => setTimeOfDay(Number(event.target.value))}
                  className="w-full accent-orange-500"
                  aria-label="Time of day"
                />
                <span className="w-14 text-right font-mono text-sm">{String(timeOfDay).padStart(2, '0')}:00</span>
              </div>
            </SettingRow>
          </section>

          {hostNote && (
            <p role="status" className="flex items-start gap-2 rounded-sm bg-emerald-900/60 p-3 text-sm text-emerald-100">
              <Globe className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {hostNote} Online hosting is not connected in this simulator.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface SettingRowProps {
  label: string;
  children: ReactNode;
}

function SettingRow({ label, children }: SettingRowProps) {
  return (
    <div className="grid grid-cols-[9rem_1fr] items-center gap-4">
      <span className="text-right text-sm text-white/90">{label}</span>
      <div>{children}</div>
    </div>
  );
}

interface SegmentButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

function SegmentButton({ active, onClick, children }: SegmentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 px-3 py-2 text-sm font-semibold transition-colors duration-150 ${
        active ? 'bg-[#8a8f99] text-white' : 'bg-[#3b3f48] text-white/80 hover:bg-[#4a4f59]'
      }`}
    >
      {children}
    </button>
  );
}
