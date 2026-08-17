import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BookOpen,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Newspaper,
  Settings,
  Trophy,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Logo from "../../components/layout/Logo";

const NAV = [
  { to: "/admin", label: "Boshqaruv", icon: LayoutDashboard, end: true },
  { to: "/admin/courses", label: "Kurslar", icon: GraduationCap },
  { to: "/admin/branches", label: "Filiallar", icon: MapPin },
  { to: "/admin/news", label: "Yangiliklar", icon: Newspaper },
  { to: "/admin/lessons", label: "Mashg'ulotlar", icon: BookOpen },
  { to: "/admin/results", label: "Natijalar", icon: Trophy },
  { to: "/admin/applications", label: "Arizalar", icon: Inbox },
  { to: "/admin/contact", label: "Murojaatlar", icon: MessageSquare },
  { to: "/admin/settings", label: "Sozlamalar", icon: Settings },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const toast = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_staff && !user.is_superuser) return <Navigate to="/" replace />;

  const handleLogout = () => {
    logout();
    toast.success("Chiqdingiz", "Qaytib keling!");
  };

  return (
    <div className="min-h-screen bg-surface lg:flex">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-ink px-4 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="text-sm font-extrabold uppercase tracking-wide text-white">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
          aria-label="Menyu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-ink text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="hidden items-center gap-3 px-6 pb-6 pt-7 lg:flex">
            <Logo size={40} withText={false} />
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-white">Tri Zvezdy</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                Admin panel
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 pb-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-soft"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-1 border-t border-white/10 px-3 py-4">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <GraduationCap className="h-[18px] w-[18px]" />
              Saytga qaytish
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Chiqish
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-primary/5 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
          <h1 className="text-base font-extrabold uppercase tracking-tight text-ink sm:text-lg">
            Tri Zvezdy <span className="text-primary">Admin</span>
          </h1>
          {user && (
            <div className="flex items-center gap-2.5">
              <span className="hidden text-sm font-bold text-ink/70 sm:block">{user.username}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-extrabold uppercase text-white">
                {user.username?.[0] || "U"}
              </span>
            </div>
          )}
        </header>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
