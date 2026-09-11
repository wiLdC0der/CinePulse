import { Film } from 'lucide-react';

export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-ink-700 px-6 py-16 text-center">
      <Film className="text-paper-500" size={28} strokeWidth={1.5} />
      <div>
        <p className="font-display text-lg text-paper-100">{title}</p>
        {message && <p className="mt-1 text-sm text-paper-500">{message}</p>}
      </div>
      {action}
    </div>
  );
}
