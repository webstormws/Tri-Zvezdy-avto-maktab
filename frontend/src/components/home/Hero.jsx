import { Link } from "react-router-dom";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { useEnrollment } from "../ui/EnrollmentModal";
import { formatPhoneTel } from "../../services/api";

function CarIllustration() {
  return (
    <div className="relative" aria-hidden="true">
      <img
        src="/onix.png"
        alt="Onix avtomobil"
        className="relative z-10 h-auto w-full max-w-[560px]"
        loading="eager"
      />
    </div>
  );
}

export default function Hero() {
  const { settings } = useSite();
  const { openEnrollment } = useEnrollment();
  const mainPhone = settings.phones?.[0] || "990 077 170";

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-40 -top-40 hidden h-[560px] w-[560px] rounded-full bg-primary/[0.04] lg:block" />
      <div className="container-site grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div className="relative z-10 max-w-xl">
          <span className="chip animate-fade-up bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {settings.hero_subtitle}
          </span>
          <h1
            className="mt-6 animate-fade-up text-[42px] font-extrabold uppercase leading-[1.04] tracking-tight text-ink sm:text-6xl"
            style={{ animationDelay: "100ms" }}
          >
            Tri Zvezdy
            <span className="block text-primary">Avto Maktab</span>
          </h1>
          <p
            className="mt-6 animate-fade-up text-base leading-relaxed text-ink/65 sm:text-lg"
            style={{ animationDelay: "200ms" }}
          >
            {settings.hero_description}
          </p>
          <div
            className="mt-8 flex animate-fade-up flex-col gap-3.5 sm:flex-row sm:items-center"
            style={{ animationDelay: "300ms" }}
          >
            <button onClick={() => openEnrollment()} className="btn-primary">
              Kurslarga yozilish
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link to="/about" className="btn-outline">
              Batafsil ma'lumot
            </Link>
          </div>
          <div
            className="mt-10 flex animate-fade-up items-center gap-4"
            style={{ animationDelay: "400ms" }}
          >
            <a
              href={formatPhoneTel(mainPhone)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-soft transition-transform hover:-translate-y-0.5"
              aria-label="Telefon qilish"
            >
              <Phone className="h-5 w-5" />
            </a>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40">
                Qo'ng'iroq qiling
              </p>
              <a
                href={formatPhoneTel(mainPhone)}
                className="text-lg font-extrabold text-ink transition-colors hover:text-primary"
              >
                {mainPhone}
              </a>
            </div>
          </div>
        </div>

        <div className="relative animate-fade-up" style={{ animationDelay: "200ms" }}>
          <CarIllustration />
        </div>
      </div>
    </section>
  );
}
