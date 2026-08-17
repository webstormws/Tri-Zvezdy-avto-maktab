import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";
import Modal from "./Modal";
import { RESOURCES } from "./resources";

const EMPTY_ICON = "data:image/svg+xml;base64,";

function buildPayload(form, fields) {
  const hasFile = fields.some((f) => f.type === "image" && form[f.key] instanceof File);
  if (!hasFile) {
    const payload = {};
    for (const f of fields) {
      const v = form[f.key];
      if (f.type === "checkbox") payload[f.key] = !!v;
      else if (f.type === "image") {
        if (v === null) payload[f.key] = null;
      } else if (f.type === "number") {
        if (v !== "" && v != null) payload[f.key] = Number(v);
      } else if (v !== "" && v != null) {
        payload[f.key] = v;
      }
    }
    return payload;
  }
  const fd = new FormData();
  for (const f of fields) {
    const v = form[f.key];
    if (f.type === "checkbox") fd.append(f.key, v ? "true" : "false");
    else if (f.type === "image") {
      if (v instanceof File) fd.append(f.key, v);
    } else if (v !== "" && v != null) {
      fd.append(f.key, v);
    }
  }
  return fd;
}

export default function AdminResourcePage({ resourceKey }) {
  const resource = RESOURCES[resourceKey];
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setItems(null);
    try {
      setItems(await adminApi.list(resource.endpoint));
    } catch (err) {
      toast.error("Yuklanmadi", err.friendlyMessage);
      setItems([]);
    }
  }, [resource.endpoint, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!query.trim()) return items;
    const q = query.trim().toLowerCase();
    return items.filter((it) =>
      String(it[resource.search] ?? "").toLowerCase().includes(q)
    );
  }, [items, query, resource.search]);

  const openCreate = () => {
    const initial = {};
    for (const f of resource.fields) {
      if (f.type === "checkbox") initial[f.key] = f.default ?? false;
      else if (f.type === "number") initial[f.key] = f.default ?? 0;
      else initial[f.key] = "";
    }
    setForm(initial);
    setModal("create");
  };

  const openEdit = (item) => {
    const initial = {};
    for (const f of resource.fields) {
      initial[f.key] = item[f.key] ?? "";
    }
    setForm(initial);
    setEditId(item.id);
    setModal("edit");
  };

  const set = (key) => (e) => {
    const value = e.target.type === "file" ? e.target.files[0] || "" : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleCheckbox = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.checked }));
  };

  const save = async (e) => {
    e.preventDefault();
    const missing = resource.fields.find(
      (f) => f.required && (form[f.key] === "" || form[f.key] == null)
    );
    if (missing) {
      toast.error("To'ldirilmagan maydon", missing.label + " kiritilishi shart.");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload(form, resource.fields);
      if (modal === "create") {
        await adminApi.create(resource.endpoint, payload);
        toast.success("Qo'shildi", resource.title + " ro'yxatga qo'shildi.");
      } else {
        await adminApi.update(resource.endpoint, editId, payload);
        toast.success("Saqlanadi", "O'zgarishlar saqlandi.");
      }
      setModal(null);
      setEditId(null);
      load();
    } catch (err) {
      toast.error("Saqlanmadi", err.friendlyMessage);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await adminApi.update(resource.endpoint, item.id, { is_active: !item.is_active });
      setItems((list) =>
        list.map((it) => (it.id === item.id ? { ...it, is_active: !item.is_active } : it))
      );
    } catch (err) {
      toast.error("O'zgartirilmadi", err.friendlyMessage);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminApi.remove(resource.endpoint, toDelete.id);
      toast.success("O'chirildi", toDelete.title ?? toDelete[resource.search] ?? "Element o'chirildi.");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error("O'chirilmadi", err.friendlyMessage);
    } finally {
      setDeleting(false);
    }
  };

  const renderCell = (item, col) => {
    if (col.type === "badge") {
      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
            item[col.key]
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {item[col.key] ? "Faol" : "Nofaol"}
        </span>
      );
    }
    if (col.key === "image") {
      return item.image ? (
        <img src={item.image} alt="" className="h-10 w-14 rounded-lg object-cover" />
      ) : (
        <span className="text-xs text-ink/30">Yo'q</span>
      );
    }
    const value = col.render ? col.render(item[col.key]) : item[col.key];
    return <span className="text-sm text-ink/80">{value ?? "—"}</span>;
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink">
            {resource.title}
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Jami {filtered.length} ta {resource.title.toLowerCase()}
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary !px-5 !py-3">
          <Plus className="h-4 w-4" />
          Yangi qo'shish
        </button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
        <input
          className="input-field !pl-11"
          placeholder={`${resource.title} dan qidirish...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden !shadow-card-hover">
        {items === null ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm font-semibold text-ink/40">
            Hech narsa topilmadi
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-primary/5 bg-surface/70">
                  {resource.columns.map((col) => (
                    <th key={col.key} className="px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-ink/40">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-widest text-ink/40">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-primary/5 transition-colors last:border-0 hover:bg-surface/50">
                    {resource.columns.map((col) => (
                      <td key={col.key} className="px-5 py-4">
                        {col.key === "image" ? renderCell(item, col) : renderCell(item, col)}
                      </td>
                    ))}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => toggleActive(item)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                            item.is_active
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              : "bg-red-50 text-red-500 hover:bg-red-100"
                          }`}
                          title={item.is_active ? "O'chirish" : "Faollashtirish"}
                        >
                          {item.is_active ? "Faol" : "Nofaol"}
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-ink/60 transition-colors hover:bg-primary/10 hover:text-primary"
                          title="Tahrirlash"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setToDelete(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-ink/60 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="O'chirish"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <Modal
        open={modal !== null}
        onClose={() => { setModal(null); setEditId(null); }}
        title={modal === "create" ? `Yangi ${resource.title.slice(0, -2)} qo'shish` : "Tahrirlash"}
        wide
      >
        <form onSubmit={save} className="space-y-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {resource.fields.map((f) => {
              const val = form[f.key] ?? "";
              return (
                <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
                  {f.type === "checkbox" ? (
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary/10 bg-surface px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!form[f.key]}
                        onChange={toggleCheckbox(f.key)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span className="text-sm font-semibold text-ink/80">{f.label}</span>
                    </label>
                  ) : f.type === "image" ? (
                    <div>
                      <label className="input-label">{f.label}</label>
                      <div className="flex items-center gap-4">
                        {val ? (
                          <img
                            src={val instanceof File ? URL.createObjectURL(val) : val}
                            alt=""
                            className="h-16 w-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-primary/20 bg-surface text-2xl text-ink/20">
                            {EMPTY_ICON && "·"}
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <input type="file" accept="image/*" onChange={set(f.key)} className="hidden" id={`img-${f.key}`} />
                          <label htmlFor={`img-${f.key}`} className="btn-outline !px-4 !py-2.5 cursor-pointer text-xs">
                            Rasm tanlash
                          </label>
                          {typeof val === "string" && (
                            <button
                              type="button"
                              onClick={() => setForm((s) => ({ ...s, [f.key]: null }))}
                              className="block text-xs font-semibold text-red-500 hover:underline"
                            >
                              Rasmni o'chirish
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="input-label">
                        {f.label}
                        {f.required && <span className="text-red-500"> *</span>}
                      </label>
                      {f.type === "textarea" ? (
                        <textarea
                          className="input-field min-h-[120px] resize-y"
                          placeholder={f.placeholder || ""}
                          value={val}
                          onChange={set(f.key)}
                        />
                      ) : f.type === "number" ? (
                        <input
                          className="input-field"
                          type="number"
                          placeholder={f.placeholder || ""}
                          value={val}
                          onChange={set(f.key)}
                        />
                      ) : f.type === "date" ? (
                        <input
                          className="input-field"
                          type="date"
                          value={typeof val === "string" ? val.slice(0, 10) : val}
                          onChange={set(f.key)}
                        />
                      ) : (
                        <input
                          className="input-field"
                          placeholder={f.placeholder || ""}
                          value={val}
                          onChange={set(f.key)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="btn-outline !px-6 !py-3">
              Bekor qilish
            </button>
            <button type="submit" className="btn-primary !px-6 !py-3" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title="O'chirishni tasdiqlang"
      >
        <p className="text-sm leading-relaxed text-ink/60">
          <strong className="text-ink">
            {toDelete?.title ?? toDelete?.[resource.search] ?? "Ushbu element"}
          </strong>{" "}
          butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.
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
