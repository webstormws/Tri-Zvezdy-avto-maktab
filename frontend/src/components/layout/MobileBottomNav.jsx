import { NavLink } from "react-router-dom";
import { GraduationCap, Home, MapPin, MessageSquare } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Bosh sahifa", icon: Home },
  { to: "/courses", label: "Kurslar", icon: GraduationCap },
  { to: "/branches", label: "Filiallar", icon: MapPin },
  { to: "/contact", label: "Aloqa", icon: MessageSquare },
];

export default function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[75] border-t border-primary/5 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(11,27,20,0.08)] backdrop-blur-xl lg:hidden"
      aria-label="Mobil pastki navigatsiya"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                isActive ? "text-primary" : "text-ink/45 hover:text-ink"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-primary/10" : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
