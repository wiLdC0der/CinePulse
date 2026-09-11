export default function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-ink-800 ring-1 ring-ink-700">
      <div className="aspect-[2/3] w-full animate-pulse bg-ink-700" />
      <div className="flex flex-col gap-2 p-2.5">
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-ink-700" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-ink-700" />
      </div>
    </div>
  );
}
