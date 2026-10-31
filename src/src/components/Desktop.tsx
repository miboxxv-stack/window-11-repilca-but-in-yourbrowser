import { useState } from "react";
import {
  Folder,
  Globe,
  Gamepad2,
  Settings,
} from "lucide-react";

import DesktopIcon from "./DesktopIcon";
import AppWindow from "./AppWindow";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";

interface OpenWindow {
  id: number;
  app: string;
  minimized: boolean;
}

export default function Desktop() {
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [startOpen, setStartOpen] = useState(false);
  const [nextId, setNextId] = useState(1);

  function openApp(app: string) {
    const existing = windows.find(
      (window) => window.app === app
    );

    if (existing) {
      setWindows((current) =>
        current.map((window) =>
          window.id === existing.id
            ? { ...window, minimized: false }
            : window
        )
      );
      return;
    }

    setWindows((current) => [
      ...current,
      { id: nextId, app, minimized: false },
    ]);

    setNextId((id) => id + 1);
    setStartOpen(false);
  }

  function closeWindow(id: number) {
    setWindows((current) =>
      current.filter((window) => window.id !== id)
    );
  }

  function minimizeWindow(id: number) {
    setWindows((current) =>
      current.map((window) =>
        window.id === id
          ? { ...window, minimized: true }
          : window
      )
    );
  }

  return (
    <main className="desktop">
      <div className="desktop-icons">
        <DesktopIcon
          label="Microsoft Edge"
          icon={<Globe size={36} />}
          onOpen={() => openApp("Microsoft Edge")}
        />

        <DesktopIcon
          label="This PC"
          icon={<Folder size={36} />}
          onOpen={() => openApp("This PC")}
        />

        <DesktopIcon
          label="Steam"
          icon={<Gamepad2 size={36} />}
          onOpen={() => openApp("Steam")}
        />

        <DesktopIcon
          label="Settings"
          icon={<Settings size={36} />}
          onOpen={() => openApp("Settings")}
        />
      </div>

      {windows.map((window) =>
        window.minimized ? null : (
          <AppWindow
            key={window.id}
            title={window.app}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
          >
            <div className="app-content">
              <h2>{window.app}</h2>
              <p>{window.app} is running.</p>
            </div>
          </AppWindow>
        )
      )}

      {startOpen && (
        <StartMenu
          onOpenApp={openApp}
          onShutdown={() => {
            setStartOpen(false);
            // Shutdown screen will be connected later.
          }}
        />
      )}

      <Taskbar
        onStartClick={() => setStartOpen((open) => !open)}
        onSearchClick={() => openApp("Search")}
        onAppClick={openApp}
      />
    </main>
  );
}