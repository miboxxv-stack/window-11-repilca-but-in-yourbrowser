import {
  Search,
  Wifi,
  Volume2,
  BatteryFull,
  LayoutGrid,
} from "lucide-react";

interface TaskbarProps {
  onStartClick: () => void;
  onSearchClick: () => void;
  onAppClick: (app: string) => void;
}

export default function Taskbar({
  onStartClick,
  onSearchClick,
  onAppClick,
}: TaskbarProps) {
  return (
    <footer className="taskbar">
      <div className="taskbar-left">
        <button className="taskbar-button" onClick={onStartClick}>
          <LayoutGrid size={23} />
        </button>

        <button className="taskbar-button" onClick={onSearchClick}>
          <Search size={21} />
        </button>

        <button
          className="taskbar-app"
          onClick={() => onAppClick("Edge")}
        >
          🌐
        </button>

        <button
          className="taskbar-app"
          onClick={() => onAppClick("File Explorer")}
        >
          📁
        </button>

        <button
          className="taskbar-app"
          onClick={() => onAppClick("Steam")}
        >
          🎮
        </button>
      </div>

      <div className="taskbar-right">
        <Wifi size={17} />
        <Volume2 size={17} />
        <BatteryFull size={19} />

        <div className="taskbar-clock">
          <span>{new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}</span>
          <small>{new Date().toLocaleDateString()}</small>
        </div>
      </div>
    </footer>
  );
}