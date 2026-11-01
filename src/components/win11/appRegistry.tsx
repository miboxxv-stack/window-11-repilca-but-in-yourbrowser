import type { ComponentType } from 'react';
import { Calculator, CloudLightning, Flame, Gamepad2, Globe, MessageCircle, NotebookPen, Radio, Settings, Swords } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import EdgeApp from '@/components/win11/apps/EdgeApp';
import FireBrowserApp from '@/components/win11/apps/FireBrowserApp';
import SteamApp from '@/components/win11/apps/SteamApp';
import NotepadApp from '@/components/win11/apps/NotepadApp';
import CalculatorApp from '@/components/win11/apps/CalculatorApp';
import SettingsApp from '@/components/win11/apps/SettingsApp';
import RobloxApp from '@/components/win11/apps/roblox/RobloxApp';
import EasMakerApp from '@/components/win11/apps/EasMakerApp';
import DiscordApp from '@/components/win11/apps/DiscordApp';
import CobaltExplorerApp from '@/components/win11/apps/CobaltExplorerApp';
import WeatherWiseApp from '@/components/win11/apps/WeatherWiseApp';

export type AppId = 'weatherwise' | 'edge' | 'fire-browser' | 'steam' | 'notepad' | 'calculator' | 'settings' | 'roblox' | 'eas-maker' | 'discord' | 'cobalt-explorer';

export interface WinApp {
  id: AppId;
  name: string;
  icon: LucideIcon;
  iconClassName: string;
  Component: ComponentType;
  size: { width: number; height: number };
}

export const WIN_APPS: WinApp[] = [
  {
    id: 'weatherwise',
    name: 'WeatherWise',
    icon: CloudLightning,
    iconClassName: 'bg-ww-navy text-ww-amber',
    Component: WeatherWiseApp,
    size: { width: 1080, height: 700 },
  },
  {
    id: 'edge',
    name: 'Microsoft Edge',
    icon: Globe,
    iconClassName: 'bg-sky-500 text-white',
    Component: EdgeApp,
    size: { width: 960, height: 620 },
  },
  {
    id: 'fire-browser',
    name: 'Fire Browser',
    icon: Flame,
    iconClassName: 'bg-orange-600 text-white',
    Component: FireBrowserApp,
    size: { width: 980, height: 640 },
  },
  {
    id: 'steam',
    name: 'Steam',
    icon: Gamepad2,
    iconClassName: 'bg-slate-800 text-white',
    Component: SteamApp,
    size: { width: 980, height: 640 },
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: NotebookPen,
    iconClassName: 'bg-emerald-600 text-white',
    Component: NotepadApp,
    size: { width: 720, height: 480 },
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: Calculator,
    iconClassName: 'bg-orange-500 text-white',
    Component: CalculatorApp,
    size: { width: 340, height: 500 },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    iconClassName: 'bg-neutral-600 text-white',
    Component: SettingsApp,
    size: { width: 1040, height: 680 },
  },
  {
    id: 'roblox',
    name: 'Roblox',
    icon: Swords,
    iconClassName: 'bg-neutral-900 text-white',
    Component: RobloxApp,
    size: { width: 1100, height: 700 },
  },
  {
    id: 'eas-maker',
    name: 'EAS Maker',
    icon: Radio,
    iconClassName: 'bg-sky-600 text-white',
    Component: EasMakerApp,
    size: { width: 1040, height: 680 },
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: MessageCircle,
    iconClassName: 'bg-indigo-600 text-white',
    Component: DiscordApp,
    size: { width: 1180, height: 760 },
  },
  {
    id: 'cobalt-explorer',
    name: 'Cobalt Explorer',
    icon: Gamepad2,
    iconClassName: 'bg-cyan-700 text-white',
    Component: CobaltExplorerApp,
    size: { width: 1120, height: 760 },
  },
];