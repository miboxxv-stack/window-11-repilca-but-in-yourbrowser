
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Search, Monitor, Bluetooth, Wifi, Paintbrush,
  AppWindow, Clock, Gamepad2, Accessibility, Shield,
  RefreshCw, Sun, Moon, Volume2, Bell, Check, ChevronRight,
  Laptop, Globe, HardDrive, Battery, Info
} from 'lucide-react';

import SettingsAccountsPage from '@/components/win11/settings/SettingsAccountsPage';
import SettingsHomePage from '@/components/win11/settings/SettingsHomePage';
import SettingsYourInfoPage from '@/components/win11/settings/SettingsYourInfoPage';

import {
  ACCOUNT_PROFILE,
  SETTINGS_NAV,
  settingsLabel,
  type SettingsNavId,
  type SettingsPage,
} from '@/components/win11/settings/settingsData';

type Preferences = {
  wifi: boolean;
  bluetooth: boolean;
  nightLight: boolean;
  darkMode: boolean;
  notifications: boolean;
  volume: number;
};

const DEFAULT_PREFERENCES: Preferences = {
  wifi: true,
  bluetooth: true,
  nightLight: false,
  darkMode: false,
  notifications: true,
  volume: 70,
};

function loadPreferences(): Preferences {
  try {
    const saved = localStorage.getItem('weatherwise-settings');
    return saved
      ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) }
      : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export default function SettingsApp() {
  const [page, setPage] = useState<SettingsPage>('home');
  const [query, setQuery] = useState('');
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('weatherwise-settings', JSON.stringify(preferences));
  }, [preferences]);

  const update = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => {
    setPreferences(previous => ({ ...previous, [key]: value }));
  };

  const navItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? SETTINGS_NAV.filter(item =>
          item.label.toLowerCase().includes(needle)
        )
      : SETTINGS_NAV;
  }, [query]);

  const activeNav: SettingsNavId =
    page === 'your-info' ? 'accounts' : page;

  const goBack = () => {
    setPage(page === 'your-info' ? 'accounts' : 'home');
  };

  const checkUpdates = () => {
    if (checkingUpdates) return;
    setCheckingUpdates(true);

    window.setTimeout(() => {
      setCheckingUpdates(false);
      setLastChecked(new Date().toLocaleTimeString());
    }, 1500);
  };

  return (
    <div className={`flex h-full min-h-0 text-neutral-900 ${
      preferences.darkMode ? 'bg-[#202020] text-white' : 'bg-[#f3f3f3]'
    }`}>
      <aside className="flex w-64 shrink-0 flex-col overflow-y-auto border-r border-neutral-200/70 px-3 py-4 max-sm:w-16">
        <button
          type="button"
          onClick={() => setPage('accounts')}
          className="mb-5 flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/60"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 font-semibold text-white">
            KG
          </span>
          <span className="min-w-0 max-sm:hidden">
            <span className="block truncate text-sm font-semibold">{ACCOUNT_PROFILE.name}</span>
            <span className="block truncate text-xs opacity-70">{ACCOUNT_PROFILE.email}</span>
          </span>
        </button>

        <nav aria-label="Settings sections" className="flex flex-col gap-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = item.id === activeNav;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                title={item.label}
                aria-current={active ? 'page' : undefined}
                className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm ${
                  active ? 'bg-white font-semibold shadow-sm' : 'hover:bg-white/60'
                }`}
              >
                {active && <span className="absolute left-0 top-2 h-6 w-1 rounded-full bg-[#0067c0]" />}
                <Icon className="h-4 w-4 shrink-0" />
                <span className="max-sm:hidden">{item.label}</span>
              </button>
            );
          })}
          {navItems.length === 0 && (
            <p className="px-3 py-3 text-xs opacity-60">No settings found.</p>
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 px-6 pb-2 pt-4">
          {page !== 'home' && (
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/70"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <label className="relative ml-auto w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Find a setting"
              className="w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </label>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-6 pb-10 pt-4 sm:px-10">
          {page === 'home' && (
            <SettingsHomePage onNavigate={setPage} />
          )}

          {page === 'accounts' && (
            <SettingsAccountsPage onNavigate={setPage} />
          )}

          {page === 'your-info' && (
            <SettingsYourInfoPage onNavigate={setPage} />
          )}

          {page !== 'home' && page !== 'accounts' && page !== 'your-info' && (
            <SettingsSection
              page={page}
              preferences={preferences}
              update={update}
              checkingUpdates={checkingUpdates}
              lastChecked={lastChecked}
              onCheckUpdates={checkUpdates}
            />
          )}
        </main>
      </div>
    </div>
  );
}

interface SettingsSectionProps {
  page: SettingsNavId;
  preferences: Preferences;
  update: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  checkingUpdates: boolean;
  lastChecked: string | null;
  onCheckUpdates: () => void;
}

function SettingsSection({
  page,
  preferences,
  update,
  checkingUpdates,
  lastChecked,
  onCheckUpdates,
}: SettingsSectionProps) {
  const title = settingsLabel(page);

  const descriptions: Record<SettingsNavId, string> = {
    home: 'Manage your device settings.',
    system: 'Display, sound, notifications and power.',
    bluetooth: 'Manage connected devices.',
    network: 'Connect to networks and manage internet settings.',
    personalization: 'Customize the appearance of your desktop.',
    apps: 'Manage installed applications.',
    accounts: 'Manage your account.',
    time: 'Manage date, time and language.',
    gaming: 'Configure gaming features.',
    accessibility: 'Make your device easier to use.',
    privacy: 'Manage security and privacy.',
    update: 'Keep your simulator up to date.',
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="mb-2 text-xs text-neutral-500">Settings / {title}</p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm opacity-70">{descriptions[page]}</p>
      </div>

      {page === 'system' && (
        <>
          <SettingsCard icon={Monitor} title="Display" description="Configure your display preferences.">
            <SettingRow title="Night light" description="Use warmer colors for your display.">
              <Toggle value={preferences.nightLight} onChange={v => update('nightLight', v)} />
            </SettingRow>
            <SettingRow title="Display mode" description="Current simulator display mode.">
              <span className="text-sm">Automatic</span>
            </SettingRow>
          </SettingsCard>

          <SettingsCard icon={Volume2} title="Sound" description="Adjust the simulator's sound preference.">
            <label className="block text-sm">
              Volume: {preferences.volume}%
              <input
                type="range"
                min="0"
                max="100"
                value={preferences.volume}
                onChange={e => update('volume', Number(e.target.value))}
                className="mt-3 w-full accent-blue-600"
              />
            </label>
          </SettingsCard>

          <SettingsCard icon={Bell} title="Notifications">
            <SettingRow title="Notifications" description="Enable desktop notifications in supported apps.">
              <Toggle value={preferences.notifications} onChange={v => update('notifications', v)} />
            </SettingRow>
          </SettingsCard>
        </>
      )}

      {page === 'bluetooth' && (
        <SettingsCard icon={Bluetooth} title="Bluetooth">
          <SettingRow title="Bluetooth" description="Bluetooth state for this simulator.">
            <Toggle value={preferences.bluetooth} onChange={v => update('bluetooth', v)} />
          </SettingRow>
          <p className="border-t pt-4 text-sm opacity-70">
            Device discovery requires a real Bluetooth integration. This switch currently stores your simulator preference.
          </p>
        </SettingsCard>
      )}

      {page === 'network' && (
        <SettingsCard icon={Wifi} title="Wi-Fi">
          <SettingRow title="Wi-Fi" description="Toggle the simulated network connection.">
            <Toggle value={preferences.wifi} onChange={v => update('wifi', v)} />
          </SettingRow>
          <div className="rounded-lg bg-neutral-100 p-4 text-sm text-neutral-800">
            <p className="font-semibold">{preferences.wifi ? 'Connected' : 'Disconnected'}</p>
            <p className="mt-1 text-xs text-neutral-600">
              {preferences.wifi ? 'Internet access is represented as available.' : 'Wi-Fi is turned off in simulator settings.'}
            </p>
          </div>
        </SettingsCard>
      )}

      {page === 'personalization' && (
        <SettingsCard icon={Paintbrush} title="Personalization">
          <SettingRow title="Dark mode" description="Change the Settings panel appearance.">
            <Toggle value={preferences.darkMode} onChange={v => update('darkMode', v)} />
          </SettingRow>
          <SettingRow title="Night light" description="Use warmer display colors.">
            <Toggle value={preferences.nightLight} onChange={v => update('nightLight', v)} />
          </SettingRow>
        </SettingsCard>
      )}

      {page === 'apps' && (
        <SettingsCard icon={AppWindow} title="Installed apps">
          {['Microsoft Edge', 'Fire Browser', 'Steam', 'Roblox', 'EAS Maker', 'Notepad', 'Calculator', 'Settings'].map(app => (
            <div key={app} className="flex items-center justify-between border-b py-3 last:border-0">
              <span className="text-sm font-medium">{app}</span>
              <span className="text-xs opacity-60">Installed</span>
            </div>
          ))}
        </SettingsCard>
      )}

      {page === 'time' && (
        <SettingsCard icon={Clock} title="Date & time">
          <SettingRow title="Current time" description="Your browser's local time.">
            <span className="text-sm">{new Date().toLocaleTimeString()}</span>
          </SettingRow>
          <SettingRow title="Current date">
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </SettingRow>
        </SettingsCard>
      )}

      {page === 'gaming' && (
        <SettingsCard icon={Gamepad2} title="Gaming">
          <p className="text-sm opacity-70">Gaming features for your desktop simulator.</p>
          <SettingRow title="Game Mode" description="Simulator preference for gaming mode.">
            <span className="text-sm">Available soon</span>
          </SettingRow>
        </SettingsCard>
      )}

      {page === 'accessibility' && (
        <SettingsCard icon={Accessibility} title="Accessibility">
          <SettingRow title="Reduced motion" description="Animation preferences.">
            <span className="text-sm">System default</span>
          </SettingRow>
          <SettingRow title="High contrast" description="Contrast preferences.">
            <span className="text-sm">Default</span>
          </SettingRow>
        </SettingsCard>
      )}

      {page === 'privacy' && (
        <SettingsCard icon={Shield} title="Privacy & security">
          <SettingRow title="Device security" description="Simulator security status.">
            <span className="text-sm text-green-700">No issues reported</span>
          </SettingRow>
          <SettingRow title="Account" description="Signed-in simulator profile.">
            <span className="text-sm">Administrator</span>
          </SettingRow>
        </SettingsCard>
      )}

      {page === 'update' && (
        <SettingsCard icon={RefreshCw} title="Windows Update">
          <div className="flex items-center gap-3">
            <RefreshCw className={`h-7 w-7 text-blue-600 ${checkingUpdates ? 'animate-spin' : ''}`} />
            <div>
              <p className="font-semibold">{checkingUpdates ? 'Checking for updates…' : 'You’re up to date'}</p>
              <p className="text-xs opacity-60">
                {lastChecked ? `Last checked at ${lastChecked}` : 'This is a local simulator update status.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={checkingUpdates}
            onClick={onCheckUpdates}
            className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {checkingUpdates ? 'Checking…' : 'Check for updates'}
          </button>
        </SettingsCard>
      )}
    </div>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Monitor;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="text-xs text-neutral-500">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-neutral-100 py-4 first:border-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="mt-1 text-xs text-neutral-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        value ? 'bg-blue-600' : 'bg-neutral-300'
      }`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
        value ? 'left-6' : 'left-1'
      }`} />
    </button>
  );
}
