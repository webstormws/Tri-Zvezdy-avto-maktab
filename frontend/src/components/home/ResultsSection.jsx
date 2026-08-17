import { useEffect, useState } from "react";
import { Award, GraduationCap, MapPin, Users } from "lucide-react";
import { api } from "../../services/api";
import SectionTitle from "../ui/SectionTitle";
import { ErrorState, Skeleton } from "../ui/States";

const ICON_MAP = {
  GraduationCap,
  Award,
  Users,
  MapPin,
};

export default function ResultsSection({ title = "Natijalarimiz", showHeading = true }) {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setResults(null);
    setError(null);
    api
      .results()
      .then((d) => active && setResults(d.results || d))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-white/[0.04]" />
      <div className="container-site relative">
        {showHeading && (
          <SectionTitle
            kicker="Bizning yutuqlarimiz"
            title={title}
            light
            description="Avtomaktabimizning muvaffaqiyat ko'rsatkichlari o'zimiz uchun so'zlamaydi."
          />
        )}
        {error ? (
          <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : !results ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-7 backdrop-blur-sm">
                <Skeleton className="h-12 w-12 rounded-2xl bg-white/15" />
                <Skeleton className="mt-5 h-8 w-1/2 bg-white/15" />
                <Skeleton className="mt-3 h-4 w-3/4 bg-white/10" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((result, i) => {
              const Icon = ICON_MAP[result.icon] || GraduationCap;
              return (
                <div
                  key={result.id}
                  className="group rounded-2xl border border-white/10 bg-white/10 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white transition-all duration-300 group-hover:bg-white group-hover:text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="mt-6 text-4xl font-extrabold tracking-tight text-white">
                    {result.number}
                  </p>
                  <p className="mt-2 font-bold uppercase tracking-wide text-white/85">
                    {result.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                    {result.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
