export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function CardGridSkeleton({ count = 3, type = "card" }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          {type === "card" && <Skeleton className="h-52 w-full rounded-none" />}
          <div className="space-y-3 p-6">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-ink">Xatolik yuz berdi</h3>
      <p className="mt-2 max-w-md text-sm text-ink/60">{message || "Ma'lumotlarni yuklab bo'lmadi."}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-6">
          Qayta urinish
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "Ma'lumot topilmadi", description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/10 bg-surface px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-ink/60">{description}</p>}
    </div>
  );
}
