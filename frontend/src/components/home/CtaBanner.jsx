import { Phone } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { useEnrollment } from "../ui/EnrollmentModal";
import { formatPhoneTel } from "../../services/api";

export default function CtaBanner() {
  const { settings } = useSite();
  const { openEnrollment } = useEnrollment();
  const mainPhone = settings.phones?.[0] || "990 077 170";

  return (
    <section className="bg-white pb-16 lg:pb-24">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-light to-primary-dark px-6 py-12 text-center sm:px-12 lg:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/[0.07]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
              Haydovchilikni bugun o'rganishni boshlang
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75">
              Yozilish uchun hoziroq ariza qoldiring yoki qo'ng'iroq qiling. O'rinlar cheklangan.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <button onClick={() => openEnrollment()} className="btn-white">
                Kurslarga yozilish
              </button>
              <a
                href={formatPhoneTel(mainPhone)}
                className="btn inline-flex border-2 border-white/40 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                {mainPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
