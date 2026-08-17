import { useEffect, useState } from "react";
import { BookOpen, Car, School, Users2 } from "lucide-react";
import { api } from "../services/api";
import { useSite } from "../context/SiteContext";
import { usePageMeta } from "../utils/seo";
import PageHeader from "../components/ui/PageHeader";
import LessonCard from "../components/cards/LessonCard";
import ResultsSection from "../components/home/ResultsSection";
import { CardGridSkeleton, ErrorState } from "../components/ui/States";
import CtaBanner from "../components/home/CtaBanner";

const PILLARS = [
  {
    icon: School,
    title: "Tajriba",
    text: "Yillar davomida minglab o'quvchilarni muvaffaqiyatli tayyorlab, haydovchilik guvohnomasi olishiga erishdik.",
  },
  {
    icon: Users2,
    title: "Tajribali ustozlar",
    text: "Har bir ustozimiz katta amaliy tajribaga ega va har bir o'quvchiga individual yondashadi.",
  },
  {
    icon: BookOpen,
    title: "O'quv jarayoni",
    text: "Zamonaviy metodikalar, interaktiv darslar va doimiy nazorat asosida yuqori natijaga erishiladi.",
  },
  {
    icon: Car,
    title: "Zamonaviy avtomobillar",
    text: "O'quv parkimiz zamonaviy va texnik xavfsizlik talablariga to'liq javob beradigan avtomobillardan iborat.",
  },
];

export default function About() {
  usePageMeta("Biz haqimizda", "Tri Zvezdy Avto Maktab haqida.");
  const { settings } = useSite();
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .lessons()
      .then((d) => active && setLessons((d.results || d).slice(0, 3)))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        kicker="Biz haqimizda"
        title={settings.about_title}
        description="Professional, ishonchli va zamonaviy haydovchilik ta'limi."
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="chip bg-primary/10 text-primary">Bizning maqsadimiz</span>
            <h2 className="mt-5 text-3xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              Zamonaviy, sifatli va ishonchli haydovchilik ta'limi
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/65">
              <p>{settings.about_content}</p>
              <p>
                Bizning asosiy vazifamiz — yo'l harakati xavfsizligini ta'minlash uchun yuksak
                bilim va ko'nikmalarga ega bo'lgan haydovchilarni tayyorlash. Har bir dars,
                har bir mashg'ulot sizning kelajakdagi xavfsiz haydash tajribangizga qo'shilgan
                hissadir.
              </p>
              <p>
                Nazariy bilimlar, amaliy mahorat va yo'l harakati qoidalarini chuqur o'rgatish
                orqali imtihonlardan ishonch bilan o'tishingizga ko'maklashamiz.
              </p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="card group p-6 transition-all hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-extrabold tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResultsSection title="Bizning natijalarimiz" />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-site">
          <div className="mb-12 text-center">
            <span className="chip mb-4 bg-primary/10 text-primary">O'quv jarayoni</span>
            <h2 className="section-title">Qanday o'qiymiz</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink/60">
              O'quv jarayonimizning asosiy yo'nalishlari.
            </p>
          </div>
          {error ? (
            <ErrorState message={error?.friendlyMessage} onRetry={() => setError(null)} />
          ) : !lessons ? (
            <CardGridSkeleton count={3} type="icon" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson, i) => (
                <LessonCard key={lesson.id} lesson={lesson} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
