import {
  Power,
  Search,
  Settings,
  Folder,
  Globe,
  Gamepad2,
} from "lucide-react";

interface StartMenuProps {
  onOpenApp: (app: string) => void;
  onShutdown: () => void;
}

const apps = [
  { name: "Microsoft Edge", icon: Globe },
  { name: "File Explorer", icon: Folder },
  { name: "Steam", icon: Gamepad2 },
  { name: "Settings", icon: Settings },
];

export default function StartMenu({
  onOpenApp,
  onShutdown,
}: StartMenuProps) {
  return (
    <div className="start-menu">
      <div className="start-search">
        <Search size={18} />
        <input placeholder="Search for apps, settings, and documents" />
      </div>

      <h3>Pinned</h3>

      <div className="pinned-apps">
        {apps.map((app) => {
          const Icon = app.icon;

          return (
            <button
              key={app.name}
              className="pinned-app"
              onClick={() => onOpenApp(app.name)}
            >
              <Icon size={27} />
              <span>{app.name}</span>
            </button>
          );
        })}
      </div>

      <div className="start-menu-bottom">
        <span>Local User</span>
        <button onClick={onShutdown} title="Power">
          <Power size={20} />
        </button>
      </div>
    </div>
  );
}