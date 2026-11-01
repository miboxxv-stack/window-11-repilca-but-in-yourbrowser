import {
  Accessibility,
  AppWindow,
  Bluetooth,
  Clock,
  Gamepad2,
  Home,
  Monitor,
  Paintbrush,
  RefreshCw,
  Shield,
  User,
  Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ACCOUNT_PROFILE = {
  name: 'Kain G',
  email: 'miboxxv@gmail.com',
  role: 'Administrator',
};

export const SETTINGS_NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'bluetooth', label: 'Bluetooth & devices', icon: Bluetooth },
  { id: 'network', label: 'Network & internet', icon: Wifi },
  { id: 'personalization', label: 'Personalization', icon: Paintbrush },
  { id: 'apps', label: 'Apps', icon: AppWindow },
  { id: 'accounts', label: 'Accounts', icon: User },
  { id: 'time', label: 'Time & language', icon: Clock },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'privacy', label: 'Privacy & security', icon: Shield },
  { id: 'update', label: 'Windows Update', icon: RefreshCw },
] as const satisfies readonly { id: string; label: string; icon: LucideIcon }[];

export type SettingsNavId = (typeof SETTINGS_NAV)[number]['id'];
export type SettingsPage = SettingsNavId | 'your-info';

export function settingsLabel(page: SettingsNavId): string {
  return SETTINGS_NAV.find((item) => item.id === page)?.label ?? 'Settings';
}
