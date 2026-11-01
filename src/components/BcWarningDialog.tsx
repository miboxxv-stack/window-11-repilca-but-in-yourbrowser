import { useEffect, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BC_WARNINGS } from '@/data/bcWarnings';

interface BcWarningDialogProps {
  onClose: () => void;
}

export default function BcWarningDialog({ onClose }: BcWarningDialogProps) {
  const [index, setIndex] = useState(0);
  const total = BC_WARNINGS.length;
  const warning = BC_WARNINGS[index];

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="bc-warning-title">
      <button
        type="button"
        aria-label="Close warning"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-[fadeIn_200ms_ease-out]"
      />

      <div className="relative w-full max-w-lg animate-[fadeIn_200ms_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-amber-400 px-6 py-4 text-ww-navy">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-wider">BC Warning</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close warning"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-black/10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{warning.issuedBy}</p>
          <h2 id="bc-warning-title" className="mt-1 text-xl font-bold text-ww-navy">
            {warning.title}
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
            {warning.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
            aria-label="Previous warning"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="font-mono text-sm font-semibold text-slate-700" aria-live="polite">
            ({index + 1}/{total})
          </span>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(total - 1, value + 1))}
            disabled={index === total - 1}
            aria-label="Next warning"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
