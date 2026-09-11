import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-signal-brick/40 bg-signal-brick/5 px-6 py-16 text-center">
      <AlertTriangle className="text-signal-brick" size={28} strokeWidth={1.5} />
      <div>
        <p className="font-display text-lg text-paper-100">Something went wrong</p>
        <p className="mt-1 text-sm text-paper-500">{message || 'Please try again.'}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded border border-paper-500/40 px-4 py-1.5 text-sm text-paper-100 transition-colors hover:border-marquee hover:text-marquee"
        >
          Try again
        </button>
      )}
    </div>
  );
}
