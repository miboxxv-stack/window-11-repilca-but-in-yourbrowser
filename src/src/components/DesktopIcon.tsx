
import { useRef, useState } from "react";
import type { ReactNode, PointerEvent } from "react";

interface DesktopIconProps {
  label: string;
  icon: ReactNode;
  onOpen: () => void;
  initialX?: number;
  initialY?: number;
}

export default function DesktopIcon({
  label,
  icon,
  onOpen,
  initialX = 30,
  initialY = 30,
}: DesktopIconProps) {
  const [position, setPosition] = useState({
    x: initialX,
    y: initialY,
  });

  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      originX: position.x,
      originY: position.y,
    };
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;

    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      drag.current.moved = true;
    }

    setPosition({
      x: Math.max(0, drag.current.originX + dx),
      y: Math.max(0, drag.current.originY + dy),
    });
  }

  function handlePointerUp() {
    drag.current.active = false;
  }

  return (
    <div
      className="desktop-icon"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        touchAction: "none",
        userSelect: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={() => {
        if (!drag.current.moved) onOpen();
      }}
      title={`Open ${label}`}
    >
      <div className="desktop-icon-image">{icon}</div>
      <span>{label}</span>
    </div>
  );
}
