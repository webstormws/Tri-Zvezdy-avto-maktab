import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, maxWidth, wide }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass = maxWidth || (wide ? "max-w-3xl" : "max-w-lg");

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative max-h-[92vh] w-full overflow-y-auto animate-fade-up rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8 ${widthClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-ink/50 transition-colors hover:bg-primary/10 hover:text-primary"
          aria-label="Yopish"
        >
          <X className="h-5 w-5" />
        </button>
        {title && (
          <h3 className="mb-5 pr-8 text-xl font-extrabold uppercase tracking-tight text-ink">{title}</h3>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
