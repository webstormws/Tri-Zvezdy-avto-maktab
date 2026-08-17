import { useState } from "react";
import { Loader2, Mail, Phone, Send } from "lucide-react";
import { api, formatPhoneTel } from "../services/api";
import { useSite } from "../context/SiteContext";
import { usePageMeta } from "../utils/seo";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";

export default function Contact() {
  usePageMeta("Aloqa", "Biz bilan bog'laning.");
  const { settings } = useSite();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: "", phone: "", course: "", message: "" });

  const phones = settings.phones?.length
    ? settings.phones
    : ["990 077 170", "911 675 560", "944 888 879", "991 729 090"];

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: null }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "Ismingizni kiriting";
    if (!form.phone.trim()) er.phone = "Telefon raqamini kiriting";
    if (!form.message.trim()) er.message = "Xabaringizni yozing";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.createContact(form);
      toast.success("Xabar yuborildi!", "Tez orada siz bilan bog'lanamiz.");
      setForm({ name: "", phone: "", course: "", message: "" });
    } catch (err) {
      toast.error("Yuborilmadi", err.friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        kicker="Aloqa"
        title="Biz bilan bog'laning"
        description="Savollaringiz bo'lsa, qo'ng'iroq qiling yoki xabar qoldiring."
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink">
              Telefon raqamlarimiz
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Bizga qulay vaqtda qo'ng'iroq qiling — doimo aloqadamiz.
            </p>

            <ul className="mt-8 space-y-4">
              {phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={formatPhoneTel(phone)}
                    className="group flex items-center gap-4 rounded-2xl border border-primary/5 bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:shadow-soft"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-lg font-extrabold tracking-tight text-ink">
                        {phone}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-ink/40">
                        Bosing — qo'ng'iroq
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {settings.telegram && (
              <a
                href={settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#2AABEE] px-6 py-3 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" />
                Telegram orqali bog'lanish
              </a>
            )}

            <div className="mt-8 rounded-2xl border border-primary/5 bg-surface p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-ink">
                <Mail className="h-4 w-4 text-primary" />
                Ish vaqti
              </p>
              <p className="mt-2 text-sm text-ink/60">{settings.work_hours || "Har kuni 09:00 — 18:00"}</p>
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink">
              Xabar qoldiring
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              Formani to'ldiring, murojaatingizni ko'rib chiqamiz.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="input-label" htmlFor="ct-name">Ism *</label>
                  <input id="ct-name" className="input-field" placeholder="Ismingiz" value={form.name} onChange={set("name")} />
                  {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="input-label" htmlFor="ct-phone">Telefon raqam *</label>
                  <input id="ct-phone" className="input-field" type="tel" placeholder="99 007 71 70" value={form.phone} onChange={set("phone")} />
                  {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="input-label" htmlFor="ct-course">Qaysi kurs?</label>
                <input id="ct-course" className="input-field" placeholder="Masalan: B toifa" value={form.course} onChange={set("course")} />
              </div>
              <div>
                <label className="input-label" htmlFor="ct-msg">Xabar *</label>
                <textarea id="ct-msg" className="input-field min-h-[130px] resize-y" placeholder="Xabaringizni yozing" value={form.message} onChange={set("message")} />
                {errors.message && <p className="mt-1 text-xs font-medium text-red-500">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Yuborilmoqda..." : "Yuborish"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
