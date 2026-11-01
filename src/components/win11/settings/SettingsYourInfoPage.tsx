import { useEffect, useState, type ChangeEvent } from 'react';
import { Camera, ChevronDown, ChevronRight, ChevronUp, ExternalLink, FolderOpen, HelpCircle, MessageSquare } from 'lucide-react';
import { SettingsAvatar, SettingsCard, SettingsRow } from '@/components/win11/settings/SettingsUi';
import { ACCOUNT_PROFILE, type SettingsPage } from '@/components/win11/settings/settingsData';

interface SettingsYourInfoPageProps {
  onNavigate: (page: SettingsPage) => void;
}

const SUPPORT_LINKS = [
  'Switching from local to Microsoft account',
  'Changing your user account picture easily',
  'Checking if you have admin privileges',
  'Logging in to your Microsoft account',
];

export default function SettingsYourInfoPage({ onNavigate }: SettingsYourInfoPageProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [supportOpen, setSupportOpen] = useState(true);

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    setPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-3xl font-semibold text-neutral-900">
        <button type="button" onClick={() => onNavigate('accounts')} className="text-neutral-600 transition-colors duration-150 hover:text-neutral-900 hover:underline">
          Accounts
        </button>
        <ChevronRight className="h-5 w-5 text-neutral-500" aria-hidden="true" />
        <span>Your info</span>
      </nav>

      <div className="flex items-center gap-6">
        <SettingsAvatar initials="KG" photoUrl={photoUrl} className="h-24 w-24 text-3xl" />
        <div>
          <p className="text-lg font-semibold uppercase text-neutral-900">Owner</p>
          <p className="text-sm text-neutral-700">{ACCOUNT_PROFILE.email}</p>
          <p className="text-sm text-neutral-700">{ACCOUNT_PROFILE.role}</p>
        </div>
      </div>

      <section aria-label="Adjust your photo" className="space-y-2">
        <h2 className="text-base font-semibold text-neutral-900">Adjust your photo</h2>
        <SettingsCard>
          <div className="flex items-center gap-4 px-5 py-4">
            <Camera className="h-5 w-5 text-neutral-700" aria-hidden="true" />
            <span className="flex-1 text-sm font-medium text-neutral-900">Take a photo</span>
            <button type="button" disabled className="rounded-md border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-900 disabled:cursor-default">
              Open Camera
            </button>
          </div>
          <div className="flex items-center gap-4 border-t border-neutral-200 px-5 py-4">
            <FolderOpen className="h-5 w-5 text-neutral-700" aria-hidden="true" />
            <span className="flex-1 text-sm font-medium text-neutral-900">Choose a file</span>
            <label className="cursor-pointer rounded-md border border-neutral-300 px-4 py-1.5 text-sm font-medium text-neutral-900 transition-colors duration-150 hover:bg-neutral-100">
              Browse files
              <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>
        </SettingsCard>
      </section>

      <section aria-label="Account settings" className="space-y-2">
        <h2 className="text-base font-semibold text-neutral-900">Account settings</h2>
        <SettingsCard>
          <div className="flex flex-wrap items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900">Microsoft account</p>
              <p className="text-xs text-neutral-600">Windows is better when settings and files automatically sync</p>
            </div>
            <button type="button" disabled className="text-sm font-medium text-[#0067c0] disabled:cursor-default">
              Stop signing in to all Microsoft apps automatically
            </button>
          </div>
        </SettingsCard>
      </section>

      <section aria-label="Related settings" className="space-y-2">
        <h2 className="text-base font-semibold text-neutral-900">Related settings</h2>
        <SettingsCard>
          <SettingsRow
            title="Accounts"
            subtitle="Manage my accounts"
            trailing={<ExternalLink className="h-4 w-4 text-neutral-600" aria-hidden="true" />}
            onClick={() => onNavigate('accounts')}
          />
        </SettingsCard>
      </section>

      <section aria-label="Related support" className="space-y-2">
        <h2 className="text-base font-semibold text-neutral-900">Related support</h2>
        <SettingsCard>
          <button
            type="button"
            onClick={() => setSupportOpen((open) => !open)}
            aria-expanded={supportOpen}
            className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-neutral-50"
          >
            <HelpCircle className="h-5 w-5 text-neutral-700" aria-hidden="true" />
            <span className="flex-1 text-sm font-medium text-neutral-900">Help with Your info</span>
            {supportOpen ? <ChevronUp className="h-4 w-4 text-neutral-700" aria-hidden="true" /> : <ChevronDown className="h-4 w-4 text-neutral-700" aria-hidden="true" />}
          </button>
          {supportOpen && (
            <ul className="space-y-3 border-t border-neutral-200 px-14 py-4">
              {SUPPORT_LINKS.map((link) => (
                <li key={link}>
                  <button type="button" disabled className="text-left text-sm text-[#0067c0] disabled:cursor-default">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SettingsCard>
        <div className="flex flex-col gap-3 pt-2 text-sm">
          <button type="button" disabled className="flex items-center gap-2 text-neutral-800 disabled:cursor-default">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Get help
          </button>
          <button type="button" disabled className="flex items-center gap-2 text-neutral-800 disabled:cursor-default">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Give feedback
          </button>
        </div>
      </section>
    </div>
  );
}
