import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Search, Trash2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";
import Modal from "./Modal";

const STATUS = [
  { value: "new", label: "Yangi", cls: "bg-primary/10 text-primary" },
  { value: "review", label: "Ko'rib chiqilmoqda", cls: "bg-amber-50 text-amber-600" },
  { value: "contacted", label: "Bog'lanildi", cls: "bg-sky-50 text-sky-600" },
  { value: "accepted", label: "Qabul qilindi", cls: "bg-emerald-50 text-emerald-600" },
  { value: "rejected", label: "Rad etildi", cls: "bg-red-50 text-red-500" },
];

export default function AdminApplications() {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setItems(null);
    try {
      setItems(await adminApi.list("/admin/applications/"));
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
    if (filter !== "all") list = list.filter((a) => a.status === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.first_name.toLowerCase().includes(q) ||
          (a.last_name || "").toLowerCase().includes(q) ||
          a.phone.includes(q) ||
          (a.course_title || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filter, query]);

  const changeStatus = async (item, value) => {
    try {
      await adminApi.update("/admin/applications/", item.id, { status: value });
      setItems((list) => list.map((a) => (a.id === item.id ? { ...a, status: value } : a)));
      if (detail?.id === item.id) setDetail((d) => ({ ...d, status: value }));
    } catch (err) {
      toast.error("O'zgartirilmadi", err.friendlyMessage);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.remove("/admin/applications/", toDelete.id);
      toast.success("O'chirildi", "Ariza o'chirildi.");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error("O'chirilmadi", err.friendlyMessage);
    } finally {
      setDeleting(false);
    }
  };

  const statusMeta = (value) => STATUS.find((s) => s.value === value) || STATUS[0];

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink">Arizalar</h2>
          <p className="mt-1 text-sm text-ink/55">Kursga yozilish uchun kelgan so'rovlar</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            className="input-field !pl-11"
            placeholder="Ism, telefon yoki kurs bo'yicha..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[{ value: "all", label: "Barchasi" }, ...STATUS].map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${
                filter === s.value
                  ? "bg-ink text-white"
                  : "bg-white text-ink/60 shadow-soft hover:bg-surface"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {items === null ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card !shadow-card-hover py-16 text-center text-sm font-semibold text-ink/40">
          Arizalar topilmadi
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const st = statusMeta(a.status);
            return (
              <div
                key={a.id}
                className="card flex flex-wrap items-center justify-between gap-4 p-5 !shadow-card-hover"
              >
                <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setDetail(a)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-extrabold tracking-tight text-ink">
                      {a.first_name} {a.last_name}
                    </p>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${st.cls}`}>
                      {st.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {a.phone}
                    {a.course_title ? " · " + a.course_title : ""}
                    {a.branch_title ? " · " + a.branch_title : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={a.status}
                    onChange={(e) => changeStatus(a, e.target.value)}
                    className="rounded-xl border border-primary/10 bg-surface px-3 py-2 text-xs font-bold text-ink focus:border-primary/50 focus:outline-none"
                  >
                    {STATUS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setToDelete(a)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-ink/60 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={detail !== null} onClose={() => setDetail(null)} title="Ariza tafsilotlari">
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Ism</p>
                <p className="mt-1 text-sm font-bold text-ink">{detail.first_name} {detail.last_name}</p>
              </div>
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Telefon</p>
                <p className="mt-1 text-sm font-bold text-ink">{detail.phone}</p>
              </div>
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Kurs</p>
                <p className="mt-1 text-sm font-bold text-ink">{detail.course_title || "—"}</p>
              </div>
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Filial</p>
                <p className="mt-1 text-sm font-bold text-ink">{detail.branch_title || "—"}</p>
              </div>
            </div>
            {detail.comment && (
              <div className="rounded-xl bg-surface p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">Izoh</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink/70">{detail.comment}</p>
              </div>
            )}
            <div>
              <label className="input-label">Holat</label>
              <select
                value={detail.status}
                onChange={(e) => changeStatus(detail, e.target.value)}
                className="input-field"
              >
                {STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={toDelete !== null} onClose={() => setToDelete(null)} title="O'chirishni tasdiqlang">
        <p className="text-sm leading-relaxed text-ink/60">
          <strong className="text-ink">
            {toDelete ? toDelete.first_name + " " + toDelete.last_name : ""}
          </strong>{" "}
          arizasi butunlay o'chiriladi.
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
