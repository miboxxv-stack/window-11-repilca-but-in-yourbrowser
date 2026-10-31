
import { useRef, useState } from "react";
import type { ReactNode, PointerEvent } from "react";
import WindowControls from "./WindowControls";

interface AppWindowProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  zIndex?: number;
}

export default function AppWindow({
  title,
  children,
  onClose,
  onMinimize,
  initialX = 150,
  initialY = 80,
  initialWidth = 900,
  initialHeight = 600,
  zIndex = 10,
}: AppWindowProps) {
  const [position, setPosition] = useState({
    x: initialX,
    y: initialY,
  });

  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  const [maximized, setMaximized] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const previous = useRef({
    position,
    size,
  });

  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  function startDrag(e: PointerEvent<HTMLDivElement>) {
    if (maximized || e.button !== 0) return;

    if ((e.target as HTMLElement).closest("button")) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
  }

  function moveDrag(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;

    setPosition({
      x: Math.max(
        0,
        drag.current.originX +
          e.clientX -
          drag.current.startX
      ),
      y: Math.max(
        0,
        drag.current.originY +
          e.clientY -
          drag.current.startY
      ),
    });
  }

  function stopDrag() {
    drag.current.active = false;
  }

  function toggleMaximize() {
    if (!maximized) {
      previous.current = { position, size };
      setMaximized(true);
    } else {
      setPosition(previous.current.position);
      setSize(previous.current.size);
      setMaximized(false);
    }
  }

  function minimize() {
    setMinimized(true);
    onMinimize?.();
  }

  if (minimized) return null;

  return (
    <section
      className={`app-window ${maximized ? "maximized" : ""}`}
      style={{
        position: "absolute",
        left: maximized ? 0 : position.x,
        top: maximized ? 0 : position.y,
        width: maximized ? "100%" : size.width,
        height: maximized ? "100%" : size.height,
        zIndex,
        resize: maximized ? "none" : "both",
        overflow: "hidden",
      }}
    >
      <div
        className="app-window-titlebar"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <div className="app-window-title">
          {title}
        </div>

        <WindowControls
          maximized={maximized}
          onMinimize={minimize}
          onMaximize={toggleMaximize}
          onClose={onClose}
        />
      </div>

      <div className="app-window-content">
        {children}
      </div>
    </section>
  );
}
