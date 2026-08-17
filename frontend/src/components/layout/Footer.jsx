import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Facebook, Instagram, MapPin, Phone, Send } from "lucide-react";
import Logo from "./Logo";
import { useSite } from "../../context/SiteContext";
import { api, formatPhoneTel } from "../../services/api";

const FOOTER_MENU = [
  { to: "/", label: "Bosh sahifa" },
  { to: "/courses", label: "Kurslar" },
  { to: "/branches", label: "Filiallar" },
  { to: "/lessons", label: "Mashg'ulotlar" },
  { to: "/results", label: "Natijalar" },
  { to: "/news", label: "Yangiliklar" },
  { to: "/about", label: "Biz haqimizda" },
  { to: "/contact", label: "Aloqa" },
];

export default function Footer() {
  const { settings } = useSite();
  const [branchCount, setBranchCount] = useState(null);
  const phones = settings.phones?.length ? settings.phones : ["990 077 170", "911 675 560", "944 888 879", "991 729 090"];

  useEffect(() => {
    let active = true;
    api.branches().then((d) => {
      if (active) setBranchCount(d.count ?? (d.results || d).length);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <footer className="bg-primary text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            {settings.footer_description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-white/50">Filiallar:</span>
            <MapPin className="h-4 w-4 text-white/60" />
            <span className="text-sm font-semibold text-white/80">{branchCount ?? "—"}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/50">Menyu</h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {FOOTER_MENU.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/50">Aloqa</h3>
          <ul className="mt-5 space-y-3">
            {phones.map((phone) => (
              <li key={phone}>
                <a
                  href={formatPhoneTel(phone)}
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-white/85 transition-colors hover:text-white"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  {phone}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3">
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings.telegram && (
              <a
                href={settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            )}
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/50">
            Web sayt yaratildi
          </h3>
          <a
            href={settings.webstorm_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 group inline-flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white transition-transform group-hover:-translate-y-0.5">
              {settings.webstorm_logo ? (
                <img
                  src={settings.webstorm_logo}
                  alt="WebStorm logo"
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-lg font-extrabold text-primary">W</span>
              )}
            </div>
            <div>
              <p className="text-base font-extrabold leading-tight tracking-tight">
                {settings.webstorm_name}
              </p>
              <p className="text-[11px] text-white/55">
                {settings.webstorm_tagline}
              </p>
            </div>
          </a>
          <a
            href={settings.webstorm_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white/60 transition-colors hover:text-white"
          >
            webstorm.uz
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <p className="text-xs text-white/55">
            В© {new Date().getFullYear()} {settings.site_name}. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs text-white/40">Sifatli ta'lim вЂ” xavfsiz hayot</p>
        </div>
      </div>
    </footer>
  );
}

