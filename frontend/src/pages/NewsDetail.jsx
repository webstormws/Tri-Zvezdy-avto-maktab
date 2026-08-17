import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { api, formatDate } from "../services/api";
import { usePageMeta } from "../utils/seo";
import { Skeleton, ErrorState } from "../components/ui/States";
import NewsCard from "../components/cards/NewsCard";
import SafeImage from "../components/ui/SafeImage";

export default function NewsDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setItem(null);
    setError(null);
    api
      .newsBySlug(slug)
      .then((d) => active && setItem(d))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [slug, reloadKey]);

  usePageMeta(item ? item.title : "Yangilik", item?.short_content);

  return (
    <section className="bg-surface py-12 lg:py-16">
      <div className="container-site">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Barcha yangiliklar
        </Link>

        {error ? (
          <div className="mt-8">
            <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
          </div>
        ) : !item ? (
          <div className="mt-8 space-y-6">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : (
          <>
            <div className="mx-auto mt-8 max-w-3xl">
              {item.image && (
                <div className="mb-8 overflow-hidden rounded-3xl">
                  <SafeImage src={item.image} alt={item.title} className="w-full object-cover" />
                </div>
              )}
              <div className="mb-4 flex items-center gap-3">
                {item.published_at && (
                  <span className="chip bg-primary/10 text-primary">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(item.published_at)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
                {item.title}
              </h1>
              <div className="mt-6 border-t border-primary/10 pt-6">
                <p className="whitespace-pre-line text-base leading-relaxed text-ink/70">
                  {item.content}
                </p>
              </div>
            </div>

            {item.related_news?.length > 0 && (
              <div className="mx-auto mt-16 max-w-5xl">
                <h2 className="mb-6 text-xl font-extrabold uppercase tracking-tight text-ink">
                  Boshqa yangiliklar
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {item.related_news.map((n, i) => (
                    <NewsCard key={n.id} news={n} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
