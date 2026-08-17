import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";

const GROUPS = [
  {
    title: "Asosiy",
    fields: [
      { key: "site_name", label: "Sayt nomi" },
      { key: "logo", label: "Logo", type: "image" },
    ],
  },
  {
    title: "Bosh sahifa (Hero)",
    fields: [
      { key: "hero_subtitle", label: "Hero subtitle" },
      { key: "hero_title", label: "Hero title" },
      { key: "hero_description", label: "Hero matn", type: "textarea" },
    ],
  },
  {
    title: "Aloqa",
    fields: [
      { key: "phones", label: "Telefonlar", type: "phones" },
      { key: "work_hours", label: "Ish vaqti" },
      { key: "instagram", label: "Instagram havola" },
      { key: "telegram", label: "Telegram havola" },
      { key: "facebook", label: "Facebook havola" },
    ],
  },
  {
    title: "Biz haqimizda",
    fields: [
      { key: "about_title", label: "Sarlavha" },
      { key: "about_content", label: "Matn", type: "textarea" },
    ],
  },
  {
    title: "WebStorm",
    fields: [
      { key: "webstorm_name", label: "Nom" },
      { key: "webstorm_tagline", label: "Tagline" },
      { key: "webstorm_link", label: "Havola" },
      { key: "webstorm_logo", label: "Logo", type: "image" },
    ],
  },
  {
    title: "Footer",
    fields: [{ key: "footer_description", label: "Footer tavsifi", type: "textarea" }],
  },
];

export default function AdminSettings() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    adminApi
      .settings()
      .then((data) => setForm({ ...data, phones: Array.isArray(data.phones) ? [...data.phones] : [] }))
      .catch((e) => toast.error("Yuklanmadi", e.friendlyMessage))
      .finally(() => setLoading(false));
  }, [toast]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setPhone = (i) => (e) => {
    setForm((f) => {
      const phones = [...f.phones];
      phones[i] = e.target.value;
      return { ...f, phones };
    });
  };

  const addPhone = () => setForm((f) => ({ ...f, phones: [...(f.phones || []), ""] }));
  const removePhone = (i) => () =>
    setForm((f) => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }));

  const pickImage = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.files[0] || f[key] }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const hasFile = GROUPS.flatMap((g) => g.fields).some(
        (f) => f.type === "image" && form[f.key] instanceof File
      );
      let payload;
      if (hasFile) {
        const fd = new FormData();
        for (const g of GROUPS) {
          for (const f of g.fields) {
            const v = form[f.key];
            if (f.type === "image") {
              if (v instanceof File) fd.append(f.key, v);
            } else if (f.type === "phones") {
              (v || []).filter((p) => p.trim()).forEach((p) => fd.append(f.key + "[]", p.trim()));
            } else if (v !== "" && v != null) {
              fd.append(f.key, v);
            }
          }
        }
        payload = fd;
      } else {
        payload = {};
        for (const g of GROUPS) {
          for (const f of g.fields) {
            const v = form[f.key];
            if (f.type === "phones") {
              payload[f.key] = (v || []).filter((p) => p.trim()).map((p) => p.trim());
            } else if (f.type === "image") {
              if (v === null) payload[f.key] = null;
            } else {
              payload[f.key] = v ?? "";
            }
          }
        }
      }
      await adminApi.saveSettings(payload);
      toast.success("Saqlanadi", "Sozlamalar yangilandi.");
    } catch (err) {
      toast.error("Saqlanmadi", err.friendlyMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink">Sayt sozlamalari</h2>
        <p className="mt-1 text-sm text-ink/55">Barcha matnlar, telefonlar va logolarni shu yerdan o'zgartiring.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {GROUPS.map((group) => (
          <div key={group.title} className="card p-6 !shadow-card-hover sm:p-8">
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-widest text-primary">
              {group.title}
            </h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {group.fields.map((f) => {
                const val = form[f.key];
                if (f.type === "image") {
                  return (
                    <div key={f.key}>
                      <label className="input-label">{f.label}</label>
                      <div className="flex items-center gap-4">
                        {val ? (
                          <img
                            src={val instanceof File ? URL.createObjectURL(val) : val}
                            alt=""
                            className="h-14 w-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-primary/20 bg-surface text-lg text-ink/20">
                            R
                          </div>
                        )}
                        <div className="flex-1">
                          <input type="file" accept="image/*" onChange={pickImage(f.key)} className="hidden" id={`set-img-${f.key}`} />
                          <label htmlFor={`set-img-${f.key}`} className="btn-outline !px-4 !py-2.5 cursor-pointer text-xs">
                            Rasm tanlash
                          </label>
                          {typeof val === "string" && (
                            <button
                              type="button"
                              onClick={() => setForm((s) => ({ ...s, [f.key]: null }))}
                              className="ml-3 text-xs font-semibold text-red-500 hover:underline"
                            >
                              O'chirish
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                if (f.type === "phones") {
                  return (
                    <div key={f.key} className="sm:col-span-2">
                      <label className="input-label">{f.label}</label>
                      <div className="space-y-2">
                        {(val || []).map((p, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <input
                              className="input-field flex-1"
                              placeholder="Masalan: 990 077 170"
                              value={p}
                              onChange={setPhone(i)}
                            />
                            <button
                              type="button"
                              onClick={removePhone(i)}
                              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-ink/50 transition-colors hover:bg-red-50 hover:text-red-500"
                              aria-label="Raqamni o'chirish"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addPhone}
                          className="btn-outline !px-4 !py-2.5 text-xs"
                        >
                          <Plus className="h-4 w-4" />
                          Telefon qo'shish
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                    <label className="input-label">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea
                        className="input-field min-h-[110px] resize-y"
                        value={val ?? ""}
                        onChange={set(f.key)}
                      />
                    ) : (
                      <input className="input-field" value={val ?? ""} onChange={set(f.key)} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary !px-8" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Saqlanmoqda..." : "Barchasini saqlash"}
          </button>
        </div>
      </form>
    </div>
  );
}
