import { useState } from 'react';
import { Bluetooth, Cloud, Laptop, Lock, RefreshCw, Wifi } from 'lucide-react';
import { SettingsCard, SettingsRow, SettingsToggle } from '@/components/win11/settings/SettingsUi';
import type { SettingsPage } from '@/components/win11/settings/settingsData';

interface SettingsHomePageProps {
  onNavigate: (page: SettingsPage) => void;
}

const WALLPAPERS = [
  'from-sky-300 via-blue-500 to-blue-800',
  'from-blue-900 via-blue-700 to-sky-500',
  'from-slate-300 via-sky-400 to-blue-700',
  'from-cyan-400 via-teal-600 to-slate-700',
  'from-cyan-700 via-blue-900 to-slate-900',
  'from-orange-200 via-rose-300 to-sky-500',
];

const M365_APPS = ['from-rose-500 to-orange-400', 'from-blue-600 to-blue-400', 'from-emerald-600 to-green-400', 'from-red-600 to-rose-400', 'from-blue-500 to-cyan-400', 'from-sky-500 to-blue-700', 'from-amber-500 to-red-600', 'from-cyan-600 to-sky-400', 'from-teal-500 to-emerald-700'];

export default function SettingsHomePage({ onNavigate }: SettingsHomePageProps) {
  const [wifiOn, setWifiOn] = useState(true);
  const [bluetoothOn, setBluetoothOn] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-neutral-900">Home</h1>

      <SettingsCard className="flex flex-wrap items-center gap-6 p-6">
        <div className="h-24 w-24 shrink-0 rounded-md bg-gradient-to-br from-orange-400 to-orange-500 shadow-inner" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-neutral-900">DESKTOP-U77I9FA</p>
          <p className="text-sm text-neutral-600">B550M DS3H AC</p>
          <button type="button" disabled className="mt-1 text-sm text-[#0067c0] disabled:cursor-default">
            Rename
          </button>
        </div>
        <dl className="flex flex-wrap gap-8 text-sm">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-neutral-700" aria-hidden="true" />
            <div>
              <dt className="font-semibold text-neutral-900">Boss</dt>
              <dd className="text-xs text-neutral-600">Connected, secured</dd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 text-neutral-700" aria-hidden="true" />
            <div>
              <dt className="font-semibold text-neutral-900">Windows Update</dt>
              <dd className="text-xs text-neutral-600">Last checked: 10 hours ago</dd>
            </div>
          </div>
        </dl>
      </SettingsCard>

      <div className="flex flex-col gap-6">
        <div className="space-y-6">
          <SettingsCard>
            <div className="px-5 pb-2 pt-5">
              <h2 className="text-base font-semibold text-neutral-900">Recommended settings</h2>
              <p className="text-xs text-neutral-600">Recent and commonly used settings</p>
            </div>
            <SettingsRow icon={Laptop} title="Display" onClick={() => onNavigate('system')} />
            <SettingsRow
              icon={Wifi}
              title="Wi-Fi"
              onClick={() => onNavigate('network')}
              trailing={
                <span className="flex items-center gap-3 text-sm text-neutral-700">
                  {wifiOn ? 'On' : 'Off'}
                  <SettingsToggle checked={wifiOn} onChange={setWifiOn} label="Wi-Fi" />
                </span>
              }
            />
            <SettingsRow icon={Lock} title="Lock screen" onClick={() => onNavigate('personalization')} />
          </SettingsCard>

          <SettingsCard>
            <div className="px-5 pb-2 pt-5">
              <h2 className="text-base font-semibold text-neutral-900">Bluetooth devices</h2>
              <p className="text-xs text-neutral-600">Manage, add, and remove devices</p>
            </div>
            <SettingsRow
              icon={Bluetooth}
              title="Bluetooth"
              subtitle='Discoverable as "DESKTOP-U77I9FA"'
              trailing={
                <span className="flex items-center gap-3 text-sm text-neutral-700">
                  {bluetoothOn ? 'On' : 'Off'}
                  <SettingsToggle checked={bluetoothOn} onChange={setBluetoothOn} label="Bluetooth" />
                </span>
              }
            />
            <SettingsRow title="Xbox Wireless Controller" subtitle="Not connected" />
            <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">
              <button type="button" onClick={() => onNavigate('bluetooth')} className="text-sm font-medium text-neutral-800 transition-colors duration-150 hover:text-[#0067c0]">
                View all devices
              </button>
              <button
                type="button"
                onClick={() => onNavigate('bluetooth')}
                className="rounded-md border border-neutral-300 bg-white px-4 py-1.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-100"
              >
                Add device
              </button>
            </div>
          </SettingsCard>
        </div>

        <div className="space-y-6">
          <SettingsCard className="p-6">
            <div className="grid h-8 w-8 grid-cols-2 gap-0.5" aria-hidden="true">
              <span className="bg-[#f25022]" />
              <span className="bg-[#7fba00]" />
              <span className="bg-[#00a4ef]" />
              <span className="bg-[#ffb900]" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-neutral-900">Get more out of Microsoft 365</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              Experience desktop versions of apps like Word and PowerPoint with AI built in, up to 6 TB of cloud storage to share, advanced security, and more, all in one convenient subscription.
            </p>
            <div className="mt-4 flex flex-wrap gap-2" aria-hidden="true">
              {M365_APPS.map((gradient) => (
                <span key={gradient} className={`h-6 w-6 rounded-md bg-gradient-to-br ${gradient}`} />
              ))}
            </div>
            <button type="button" disabled className="mt-5 rounded-md bg-[#0067c0] px-4 py-2 text-sm font-semibold text-white disabled:cursor-default">
              Get Microsoft 365
            </button>
          </SettingsCard>

          <SettingsCard className="p-6">
            <Cloud className="h-8 w-8 text-[#0067c0]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold text-neutral-900">Cloud storage</h2>
            <p className="mt-2 text-sm text-neutral-700">Something happened, and we couldn't load your storage details. Wait a bit, then try again.</p>
          </SettingsCard>

          <SettingsCard className="p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Personalize your device</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {WALLPAPERS.map((gradient) => (
                <span key={gradient} className={`aspect-video rounded-md bg-gradient-to-br ${gradient}`} aria-hidden="true" />
              ))}
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
