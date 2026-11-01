import { useState } from 'react';
import { Award, ChevronDown, ChevronUp, Cloud, Heart, IdCard, KeyRound, MonitorSmartphone, Users } from 'lucide-react';
import { SettingsAvatar, SettingsCard, SettingsRow } from '@/components/win11/settings/SettingsUi';
import { ACCOUNT_PROFILE, type SettingsPage } from '@/components/win11/settings/settingsData';

interface SettingsAccountsPageProps {
  onNavigate: (page: SettingsPage) => void;
}

export default function SettingsAccountsPage({ onNavigate }: SettingsAccountsPageProps) {
  const [familyOpen, setFamilyOpen] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-neutral-900">Accounts</h1>

      <SettingsCard className="flex flex-wrap items-center gap-6 p-6">
        <SettingsAvatar initials="KG" className="h-20 w-20 text-2xl" />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold uppercase text-neutral-900">{ACCOUNT_PROFILE.name}</p>
          <p className="text-sm text-neutral-700">{ACCOUNT_PROFILE.email}</p>
          <p className="text-sm text-neutral-700">{ACCOUNT_PROFILE.role}</p>
        </div>
        <div className="flex gap-8 text-sm">
          <div className="flex items-start gap-2">
            <Award className="mt-0.5 h-5 w-5 text-amber-600" aria-hidden="true" />
            <div>
              <p className="font-semibold text-neutral-900">Rewards</p>
              <button type="button" disabled className="text-xs text-[#0067c0] disabled:cursor-default">
                Manage Rewards
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Cloud className="mt-0.5 h-5 w-5 text-[#0067c0]" aria-hidden="true" />
            <div>
              <p className="font-semibold text-neutral-900">OneDrive</p>
              <button type="button" disabled className="text-xs text-[#0067c0] disabled:cursor-default">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <button
          type="button"
          onClick={() => setFamilyOpen((open) => !open)}
          aria-expanded={familyOpen}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-neutral-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded bg-[#f25022]/10">
            <span className="grid h-4 w-4 grid-cols-2 gap-px" aria-hidden="true">
              <span className="bg-[#f25022]" />
              <span className="bg-[#7fba00]" />
              <span className="bg-[#00a4ef]" />
              <span className="bg-[#ffb900]" />
            </span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-neutral-900">Microsoft 365 Family</span>
            <span className="block text-xs text-neutral-600">Microsoft 365 apps with Copilot built in, cloud storage, advanced security, and more</span>
          </span>
          {familyOpen ? <ChevronUp className="h-4 w-4 text-neutral-700" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 text-neutral-700" aria-hidden="true" />}
        </button>
        {familyOpen && (
          <div className="grid gap-6 border-t border-neutral-200 p-5 md:grid-cols-[1fr_16rem]">
            <div>
              <p className="text-sm font-semibold text-neutral-900">Microsoft 365 Family</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                Experience desktop versions of apps like Word and PowerPoint with AI built in, up to 6 TB of cloud storage to share, advanced security, and more, all in one convenient subscription.
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <button type="button" disabled className="rounded-md bg-[#0067c0] px-4 py-2 font-semibold text-white disabled:cursor-default">
                  Get started
                </button>
                <button type="button" disabled className="font-medium text-[#0067c0] disabled:cursor-default">
                  Learn more
                </button>
              </div>
            </div>
            <div className="h-36 rounded-md bg-gradient-to-br from-sky-100 via-white to-emerald-100" aria-hidden="true" />
          </div>
        )}
      </SettingsCard>

      <SettingsCard>
        <div className="flex items-center gap-4 px-5 py-4">
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-neutral-900">PC Game Pass</span>
            <span className="block text-xs text-neutral-600">Your all-inclusive pass to play</span>
          </span>
          <button type="button" disabled className="rounded-md border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-900 disabled:cursor-default">
            Learn more
          </button>
        </div>
      </SettingsCard>

      <section aria-label="Account settings" className="space-y-2">
        <h2 className="text-base font-semibold text-neutral-900">Account settings</h2>
        <SettingsCard>
          <SettingsRow icon={IdCard} title="Your info" subtitle="Profile photo" onClick={() => onNavigate('your-info')} />
          <SettingsRow icon={KeyRound} title="Sign-in options" subtitle="Windows Hello, security key, password, dynamic lock" />
          <SettingsRow icon={MonitorSmartphone} title="Linked devices" subtitle="Find, repair, and manage devices that are signed in with your Microsoft account" />
          <SettingsRow icon={Users} title="Your accounts" subtitle="Add or manage accounts used in Windows" />
          <SettingsRow icon={Heart} title="Family" subtitle="Manage your family group, edit account types and device permissions" />
        </SettingsCard>
      </section>
    </div>
  );
}
