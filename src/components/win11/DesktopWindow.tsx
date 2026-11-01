import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { Minus, Square, Copy, X, Grip } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface WindowFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DesktopWindowProps {
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  frame: WindowFrame;
  maximized: boolean;
  focused: boolean;
  zIndex: number;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
  children: ReactNode;
}

export default function DesktopWindow({
  title,
  icon: Icon,
  iconClassName,
  frame,
  maximized,
  focused,
  zIndex,
  onFocus,
  onMove,
  onResize,
  onMinimize,
  onToggleMaximize,
  onClose,
  children,
}: DesktopWindowProps) {
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; width: number; height: number } | null>(null);

  const handleTitlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('button')) return;
    onFocus();
    dragRef.current = { offsetX: event.clientX - frame.x, offsetY: event.clientY - frame.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTitlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 100;
    const x = Math.min(Math.max(event.clientX - drag.offsetX, 0), maxX);
    const y = Math.min(Math.max(event.clientY - drag.offsetY, 0), maxY);
    onMove(x, y);
  };

  const handleResizeDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (maximized || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    onFocus();
    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      width: frame.width,
      height: frame.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleResizeMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const resize = resizeRef.current;
    if (!resize) return;
    const maxWidth = Math.max(340, window.innerWidth - frame.x);
    const maxHeight = Math.max(240, window.innerHeight - frame.y - 48);
    onResize(
      Math.min(maxWidth, Math.max(340, resize.width + event.clientX - resize.startX)),
      Math.min(maxHeight, Math.max(240, resize.height + event.clientY - resize.startY)),
    );
  };

  const style = maximized
    ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 48px)', zIndex }
    : {
        left: frame.x,
        top: frame.y,
        width: `min(${frame.width}px, calc(100vw - 24px))`,
        height: `min(${frame.height}px, calc(100vh - 72px))`,
        zIndex,
      };

  return (
    <section
      aria-label={title}
      onPointerDown={onFocus}
      style={style}
      className={`absolute flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[9px] border bg-[#f3f3f3] shadow-[0_18px_65px_rgba(0,0,0,0.42)] transition-[box-shadow,opacity] duration-150 ${
        focused ? 'border-white/80 shadow-[0_22px_75px_rgba(0,0,0,0.48)]' : 'border-white/30 opacity-[0.98]'
      } ${maximized ? 'rounded-none' : ''}`}
    >
      <header
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={() => { dragRef.current = null; }}
        onPointerCancel={() => { dragRef.current = null; }}
        onDoubleClick={onToggleMaximize}
        className="flex h-10 shrink-0 touch-none select-none items-center justify-between border-b border-black/[0.06] bg-[#f3f3f3]/95 pl-3 backdrop-blur-xl"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`flex h-[19px] w-[19px] items-center justify-center rounded-[5px] shadow-sm ${iconClassName}`}>
            <Icon className="h-3 w-3" aria-hidden="true" />
          </span>
          <span className="truncate text-[12px] font-medium tracking-[0.01em] text-[#252525]">{title}</span>
        </div>
        <div className="flex h-full shrink-0">
          <WindowControl label="Minimize" onClick={onMinimize}>
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </WindowControl>
          <WindowControl label={maximized ? 'Restore' : 'Maximize'} onClick={onToggleMaximize}>
            {maximized ? <Copy className="h-3 w-3" aria-hidden="true" /> : <Square className="h-3 w-3" aria-hidden="true" />}
          </WindowControl>
          <WindowControl label="Close" onClick={onClose} danger>
            <X className="h-4 w-4" aria-hidden="true" />
          </WindowControl>
        </div>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-white">{children}</div>
      {!maximized && (
        <div
          role="presentation"
          onPointerDown={handleResizeDown}
          onPointerMove={handleResizeMove}
          onPointerUp={() => { resizeRef.current = null; }}
          onPointerCancel={() => { resizeRef.current = null; }}
          className="absolute bottom-0 right-0 z-20 flex h-4 w-4 cursor-nwse-resize touch-none items-end justify-end text-slate-500/60 hover:text-slate-700"
          title="Resize window"
        >
          <Grip size={11} />
        </div>
      )}
    </section>
  );
}

interface WindowControlProps {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}

function WindowControl({ label, onClick, danger, children }: WindowControlProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-full w-[46px] items-center justify-center text-[#222] transition-colors duration-100 ${
        danger ? 'hover:bg-[#c42b1c] hover:text-white' : 'hover:bg-black/[0.07]'
      }`}
    >
      {children}
    </button>
  );
}
