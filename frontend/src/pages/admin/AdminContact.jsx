import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Search, Trash2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";
import Modal from "./Modal";

export default function AdminContact() {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState("");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [detail, setDetail] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setItems(null);
    try {
      setItems(await adminApi.list("/admin/contact/"));
    } catch (err) {
      toast.error("Yuklanmadi", err.friendlyMessage);
      setItems([]);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!items) return [];
    let list = items;
    if (onlyUnread) list = list.filter((m) => !m.is_read);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (m) => m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.message.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, query, onlyUnread]);

  const toggleRead = async (item) => {
    try {
      await adminApi.update("/admin/contact/", item.id, { is_read: !item.is_read });
      setItems((list) => list.map((m) => (m.id === item.id ? { ...m, is_read: !item.is_read } : m)));
      if (detail?.id === item.id) setDetail((d) => ({ ...d, is_read: !item.is_read }));
    } catch (err) {
      toast.error("O'zgartirilmadi", err.friendlyMessage);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.remove("/admin/contact/", toDelete.id);
      toast.success("O'chirildi", "Murojaat o'chirildi.");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error("O'chirilmadi", err.friendlyMessage);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink">Murojaatlar</h2>
          <p className="mt-1 text-sm text-ink/55">Aloqa sahifasidan kelgan xabarlar</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            className="input-field !pl-11"
            placeholder="Ism, telefon yoki matn bo'yicha..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setOnlyUnread((v) => !v)}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            onlyUnread ? "bg-ink text-white" : "bg-white text-ink/60 shadow-soft hover:bg-surface"
          }`}
        >
          Faqat o'qilmaganlar
        </button>
      </div>

      {items === null ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card !shadow-card-hover py-16 text-center text-sm font-semibold text-ink/40">
          Murojaatlar topilmadi
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`card flex flex-wrap items-center justify-between gap-4 p-5 transition-colors !shadow-card-hover ${
                !m.is_read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setDetail(m)}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-extrabold tracking-tight text-ink">{m.name}</p>
                  {!m.is_read && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-red-500">
                      Yangi
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs font-semibold text-ink/40">
                  {m.phone}
                  {m.course ? " · " + m.course : ""}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{m.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRead(m)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                    m.is_read
                      ? "bg-surface text-ink/50 hover:bg-primary/10 hover:text-primary"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {m.is_read ? "O'qilgan" : "O'qilgan qilish"}
                </button>
                <button
                  onClick={() => setToDelete(m)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink/60 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="O'chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={detail !== null} onClose={() => setDetail(null)} title="Murojaat tafsilotlari">
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Ism</p>
                <p className="mt-1 text-sm font-bold text-ink">{detail.name}</p>
              </div>
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Telefon</p>
                <p className="mt-1 text-sm font-bold text-ink">{detail.phone}</p>
              </div>
              {detail.course && (
                <div className="rounded-xl bg-surface p-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Kurs</p>
                  <p className="mt-1 text-sm font-bold text-ink">{detail.course}</p>
                </div>
              )}
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Sana</p>
                <p className="mt-1 text-sm font-bold text-ink">{String(detail.created_at).slice(0, 10)}</p>
              </div>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink/40">
                <Mail className="h-3.5 w-3.5" /> Xabar
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/70">{detail.message}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => toggleRead(detail)}
                className={`btn ${detail.is_read ? "btn-outline" : "btn-primary"} !px-6 !py-3`}
              >
                {detail.is_read ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} title="O'chirishni tasdiqlang">
        <p className="text-sm leading-relaxed text-ink/60">
          <strong className="text-ink">{toDelete?.name}</strong> murojaati butunlay o'chiriladi.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setToDelete(null)} className="btn-outline !px-6 !py-3">
            Bekor qilish
          </button>
          <button
            onClick={confirmDelete}
            className="btn bg-red-500 px-6 py-3 text-sm text-white shadow-soft hover:bg-red-600"
            disabled={deleting}
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {deleting ? "O'chirilmoqda..." : "O'chirish"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
