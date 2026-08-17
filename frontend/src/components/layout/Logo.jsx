import { useSite } from "../../context/SiteContext";

export default function Logo({ light = false, withText = true, size = 44 }) {
  const { settings } = useSite();

  return (
    <span className="inline-flex items-center gap-3">
      {settings.logo ? (
        <img
          src={settings.logo}
          alt="Tri Zvezdy logo"
          width={size}
          height={size}
          className="shrink-0 rounded-lg object-contain"
        />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-sm"
          role="img"
          aria-label="Tri Zvezdy logo"
        >
          <rect width="64" height="64" rx="16" fill="#005B3A" />
          <path
            d="M32 12.5 37.2 25.9 51.5 26.4 40.2 34.8 43.6 48.6 32 41.1 20.4 48.6 23.8 34.8 12.5 26.4 26.8 25.9Z"
            fill="#ffffff"
          />
          <circle cx="32" cy="18.5" r="3.2" fill="#087A4B" />
        </svg>
      )}
      {withText && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[15px] font-extrabold uppercase tracking-tight ${
              light ? "text-white" : "text-ink"
            }`}
          >
            Tri Zvezdy
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.28em] ${
              light ? "text-white/70" : "text-primary"
            }`}
          >
            Avto Maktab
          </span>
        </span>
      )}
    </span>
  );
}
