import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function SettingsCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-lg bg-white shadow-sm ${className}`}>{children}</section>;
}

interface SettingsRowProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
}

export function SettingsRow({ icon: Icon, title, subtitle, trailing, onClick }: SettingsRowProps) {
  const body = (
    <>
      {Icon && <Icon className="h-5 w-5 shrink-0 text-neutral-700" aria-hidden="true" />}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-neutral-900">{title}</span>
        {subtitle && <span className="block text-xs text-neutral-600">{subtitle}</span>}
      </span>
    </>
  );

  return (
    <div className="flex items-center gap-4 border-t border-neutral-200 px-5 py-4 first:border-t-0">
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="-mx-2 -my-1 flex min-w-0 flex-1 items-center gap-4 rounded-md px-2 py-1 text-left transition-colors duration-150 hover:bg-neutral-100"
        >
          {body}
          <ChevronRight className="h-4 w-4 shrink-0 text-neutral-600" aria-hidden="true" />
        </button>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-4">{body}</div>
      )}
      {trailing}
    </div>
  );
}

interface SettingsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function SettingsToggle({ checked, onChange, label }: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-10 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-[#0067c0]' : 'bg-neutral-500'}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

export function SettingsAvatar({ initials, photoUrl, className = '' }: { initials: string; photoUrl?: string | null; className?: string }) {
  if (photoUrl) {
    return <img src={photoUrl} alt="" className={`rounded-full object-cover ${className}`} />;
  }
  return (
    <span className={`flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 font-semibold text-white ${className}`} aria-hidden="true">
      {initials}
    </span>
  );
}
