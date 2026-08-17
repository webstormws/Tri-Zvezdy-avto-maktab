import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Sahifalar">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-white text-ink/50 transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Oldingi sahifa"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
            p === page
              ? "bg-primary text-white shadow-soft"
              : "border border-primary/10 bg-white text-ink/60 hover:border-primary/30 hover:text-primary"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/10 bg-white text-ink/50 transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Keyingi sahifa"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
