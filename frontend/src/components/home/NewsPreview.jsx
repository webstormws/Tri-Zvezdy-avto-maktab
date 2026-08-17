import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import SectionTitle from "../ui/SectionTitle";
import NewsCard from "../cards/NewsCard";
import { CardGridSkeleton, ErrorState } from "../ui/States";

export default function NewsPreview() {
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setNews(null);
    setError(null);
    api
      .news()
      .then((d) => active && setNews((d.results || d).slice(0, 3)))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-site">
        <SectionTitle
          kicker="So'nggi yangiliklar"
          title="Yangiliklar"
          description="Avtomaktabimiz hayotidagi so'nggi voqealar va e'lonlar."
        />
        {error ? (
          <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : !news ? (
          <CardGridSkeleton count={3} />
        ) : news.length === 0 ? (
          <p className="text-center text-ink/50">Yangiliklar hozircha mavjud emas.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, i) => (
              <NewsCard key={item.id} news={item} index={i} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/news" className="btn-outline">
            Barcha yangiliklar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
