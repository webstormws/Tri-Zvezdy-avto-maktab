import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback((type, title, description) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    timers.current[id] = setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const toast = useMemo(
    () => ({
      success: (title, description) => push("success", title, description),
      error: (title, description) => push("error", title, description),
      info: (title, description) => push("info", title, description),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex animate-pop-in items-start gap-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-card-hover"
            role="status"
          >
            <div className="mt-0.5 shrink-0">
              {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-primary" />}
              {t.type === "error" && <XCircle className="h-5 w-5 text-red-500" />}
              {t.type === "info" && <Info className="h-5 w-5 text-sky-500" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-ink">{t.title}</p>
              {t.description && <p className="mt-0.5 text-sm text-ink/60">{t.description}</p>}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink/30 transition-colors hover:text-ink"
              aria-label="Yopish"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
