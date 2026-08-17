import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Inbox,
  MapPin,
  MessageSquare,
  Newspaper,
  Phone,
  Trophy,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useToast } from "../../context/ToastContext";

const STATUS = {
  new: { label: "Yangi", cls: "bg-primary/10 text-primary" },
  review: { label: "Ko'rib chiqilmoqda", cls: "bg-amber-50 text-amber-600" },
  contacted: { label: "Bog'lanildi", cls: "bg-sky-50 text-sky-600" },
  accepted: { label: "Qabul qilindi", cls: "bg-emerald-50 text-emerald-600" },
  rejected: { label: "Rad etildi", cls: "bg-red-50 text-red-500" },
};

export default function AdminDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((e) => toast.error("Yuklanmadi", e.friendlyMessage));
  }, [toast]);

  const cards = stats
    ? [
        { label: "Kurslar", value: stats.courses, icon: GraduationCap, to: "/admin/courses", tint: "bg-primary/10 text-primary" },
        { label: "Filiallar", value: stats.branches, icon: MapPin, to: "/admin/branches", tint: "bg-sky-50 text-sky-600" },
        { label: "Yangiliklar", value: stats.news, icon: Newspaper, to: "/admin/news", tint: "bg-violet-50 text-violet-600" },
        { label: "Mashg'ulotlar", value: stats.lessons, icon: BookOpen, to: "/admin/lessons", tint: "bg-amber-50 text-amber-600" },
        { label: "Natijalar", value: stats.results, icon: Trophy, to: "/admin/results", tint: "bg-rose-50 text-rose-500" },
        { label: "Yangi arizalar", value: stats.applications_new, icon: Inbox, to: "/admin/applications", tint: "bg-emerald-50 text-emerald-600" },
        { label: "O'qilmagan xabarlar", value: stats.contact_unread, icon: MessageSquare, to: "/admin/contact", tint: "bg-orange-50 text-orange-500" },
        { label: "Jami arizalar", value: stats.applications_total, icon: Phone, to: "/admin/applications", tint: "bg-primary/10 text-primary" },
      ]
    : [];

  return (
    <div className="animate-fade-up">
      <h2 className="text-2xl font-extrabold uppercase tracking-tight text-ink">Boshqaruv paneli</h2>
      <p className="mt-1 text-sm text-ink/55">Saytning barcha ma'lumotlarini shu yerdan boshqaring.</p>

      {!stats ? (
        <div className="mt-10 flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {cards.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="group rounded-2xl border border-primary/5 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.tint}`}>
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-2xl font-extrabold tracking-tight text-ink">{c.value}</p>
                <p className="mt-0.5 text-xs font-semibold text-ink/55">{c.label}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card overflow-hidden !shadow-card-hover">
              <div className="flex items-center justify-between border-b border-primary/5 bg-surface/70 px-5 py-4">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-ink/70">So'nggi arizalar</h3>
                <Link to="/admin/applications" className="text-xs font-bold text-primary hover:underline">
                  Barchasi
                </Link>
              </div>
              {stats.recent_applications.length === 0 ? (
                <div className="py-10 text-center text-sm font-semibold text-ink/40">Arizalar yo'q</div>
              ) : (
                <ul className="divide-y divide-primary/5">
                  {stats.recent_applications.map((a) => {
                    const st = STATUS[a.status] || STATUS.new;
                    return (
                      <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-ink">
                            {a.first_name} {a.last_name}
                          </p>
                          <p className="truncate text-xs text-ink/50">
                            {a.phone} {a.course_title ? "· " + a.course_title : ""}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${st.cls}`}>
                          {st.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="card overflow-hidden !shadow-card-hover">
              <div className="flex items-center justify-between border-b border-primary/5 bg-surface/70 px-5 py-4">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-ink/70">So'nggi murojaatlar</h3>
                <Link to="/admin/contact" className="text-xs font-bold text-primary hover:underline">
                  Barchasi
                </Link>
              </div>
              {stats.recent_contact.length === 0 ? (
                <div className="py-10 text-center text-sm font-semibold text-ink/40">Murojaatlar yo'q</div>
              ) : (
                <ul className="divide-y divide-primary/5">
                  {stats.recent_contact.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">
                          {m.name}
                          {!m.is_read && (
                            <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-500">
                              Yangi
                            </span>
                          )}
                        </p>
                        <p className="truncate text-xs text-ink/50">{m.message}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-ink/40">{m.phone}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
