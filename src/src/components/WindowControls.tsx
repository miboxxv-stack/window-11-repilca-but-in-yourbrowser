
import { Minus, Square, Copy, X } from "lucide-react";

interface WindowControlsProps {
  minimized?: boolean;
  maximized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export default function WindowControls({
  maximized = false,
  onMinimize,
  onMaximize,
  onClose,
}: WindowControlsProps) {
  return (
    <div className="window-controls">
      <button
        type="button"
        title="Minimize"
        aria-label="Minimize window"
        onClick={onMinimize}
      >
        <Minus size={15} />
      </button>

      <button
        type="button"
        title={maximized ? "Restore" : "Maximize"}
        aria-label={maximized ? "Restore window" : "Maximize window"}
        onClick={onMaximize}
      >
        {maximized ? <Copy size={13} /> : <Square size={12} />}
      </button>

      <button
        type="button"
        className="window-close"
        title="Close"
        aria-label="Close window"
        onClick={onClose}
      >
        <X size={16} />
      </button>
    </div>
  );
}
