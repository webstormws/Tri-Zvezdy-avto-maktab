import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, Car, Check, Wallet } from "lucide-react";
import { api, formatPrice } from "../services/api";
import { usePageMeta } from "../utils/seo";
import { Skeleton, ErrorState } from "../components/ui/States";
import { useEnrollment } from "../components/ui/EnrollmentModal";
import SafeImage from "../components/ui/SafeImage";

const HIGHLIGHTS = [
  "Tajribali ustozlar",
  "Zamonaviy avtomobillar",
  "Moslashuvchan jadval",
  "Amaliy va nazariy darslar",
  "Imtihonga tayyorgarlik",
];

export default function CourseDetail() {
  const { slug } = useParams();
  const { openEnrollment } = useEnrollment();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setCourse(null);
    setError(null);
    api
      .courseBySlug(slug)
      .then((d) => active && setCourse(d))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [slug, reloadKey]);

  usePageMeta(course ? `${course.title} — Tri Zvezdy` : "Kurs", course?.short_description);

  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="container-site">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Barcha kurslar
        </Link>

        {error ? (
          <div className="mt-8">
            <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
          </div>
        ) : !course ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Skeleton className="h-[360px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-12 w-48 rounded-full" />
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="overflow-hidden rounded-3xl">
              <SafeImage
                src={course.image || ""}
                alt={course.title}
                className="h-full max-h-[460px] w-full object-cover"
              />
            </div>
            <div>
              <span className="chip bg-primary/10 text-primary">{course.category} toifa</span>
              <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-2 text-lg font-semibold text-primary-light">
                {course.short_description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="card p-5">
                  <CalendarClock className="h-6 w-6 text-primary" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink/45">
                    Davomiylik
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-ink">
                    {course.duration || "3 oy"}
                  </p>
                </div>
                <div className="card p-5">
                  <Wallet className="h-6 w-6 text-primary" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink/45">
                    Narx
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-ink">
                    {formatPrice(course.price)}
                  </p>
                </div>
              </div>

              {course.description && (
                <p className="mt-6 text-base leading-relaxed text-ink/70">{course.description}</p>
              )}

              <ul className="mt-6 space-y-3">
                {HIGHLIGHTS.map((h) => (
                  <li key={h} className="flex items-center gap-3 text-sm font-medium text-ink/75">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <button onClick={() => openEnrollment(course.slug)} className="btn-primary">
                  <Car className="h-4 w-4" />
                  Kursga yozilish
                </button>
                <Link to="/contact" className="btn-outline">
                  Savol berish
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
