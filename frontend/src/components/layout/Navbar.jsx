import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, LogIn, LogOut, Menu, Phone, X } from "lucide-react";
import Logo from "./Logo";
import { useSite } from "../../context/SiteContext";
import { formatPhoneTel, ADMIN_URL } from "../../services/api";
import { useEnrollment } from "../ui/EnrollmentModal";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/courses", label: "Kurslar" },
  { to: "/branches", label: "Filiallar" },
  { to: "/lessons", label: "Mashg'ulotlar" },
  { to: "/results", label: "Natijalar" },
  { to: "/news", label: "Yangiliklar" },
  { to: "/about", label: "Biz haqimizda" },
  { to: "/contact", label: "Aloqa" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSite();
  const { user, logout } = useAuth();
  const { openEnrollment } = useEnrollment();
  const location = useLocation();
  const mainPhone = settings.phones?.[0] || "990 077 170";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-primary/5 bg-white/90 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-white"
      }`}
    >
      <div className="container-site flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label="Bosh sahifa">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Asosiy menyu">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-ink/70 hover:bg-surface hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              {user.is_staff || user.is_superuser ? (
                <a
                  href={ADMIN_URL}
                  className="btn hidden !px-4 lg:inline-flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin panel
                </a>
              ) : null}
              <span className="hidden items-center gap-2 rounded-full bg-surface py-1.5 pl-1.5 pr-3.5 text-sm font-bold text-ink lg:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-extrabold uppercase text-white">
                  {user.username?.[0] || "U"}
                </span>
                {user.username}
              </span>
              <button
                onClick={logout}
                className="hidden h-11 w-11 items-center justify-center rounded-full bg-surface text-ink/60 transition-colors hover:bg-red-50 hover:text-red-500 lg:flex"
                title="Chiqish"
                aria-label="Chiqish"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-1 lg:flex">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-ink/70 transition-colors hover:bg-surface hover:text-ink"
              >
                <LogIn className="h-4 w-4" />
                Kirish
              </Link>
            </div>
          )}

          <a
            href={formatPhoneTel(mainPhone)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white lg:hidden"
            aria-label="Telefon qilish"
          >
            <Phone className="h-5 w-5" />
          </a>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-primary hover:text-white xl:hidden"
            aria-label={mobileOpen ? "Menyuni yopish" : "Menyuni ochish"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden">
          <nav
            className="container-site max-h-[calc(100vh-72px)] animate-fade-in space-y-1 overflow-y-auto pb-6 pt-2"
            aria-label="Mobil menyu"
          >
            {NAV_ITEMS.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                style={{ animationDelay: `${i * 40}ms` }}
                className={({ isActive }) =>
                  `flex animate-fade-up items-center justify-between rounded-2xl px-4 py-3.5 text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-ink/75 hover:bg-surface hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="grid gap-3 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-extrabold uppercase text-white">
                      {user.username?.[0] || "U"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{user.username}</p>
                      {(user.is_staff || user.is_superuser) && (
                        <p className="text-xs font-semibold text-primary">Administrator</p>
                      )}
                    </div>
                  </div>
                  {user.is_staff || user.is_superuser ? (
                    <a href={ADMIN_URL} className="btn-primary w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin panel
                    </a>
                  ) : null}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="btn-outline w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline w-full">
                    <LogIn className="h-4 w-4" />
                    Kirish
                  </Link>
                  <a href={formatPhoneTel(mainPhone)} className="btn-outline w-full">
                    <Phone className="h-4 w-4" />
                    {mainPhone}
                  </a>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openEnrollment();
                    }}
                    className="btn-primary w-full"
                  >
                    Kurslarga yozilish
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
