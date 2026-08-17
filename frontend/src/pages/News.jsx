import { useEffect, useState } from "react";
import { api } from "../services/api";
import { usePageMeta } from "../utils/seo";
import PageHeader from "../components/ui/PageHeader";
import NewsCard from "../components/cards/NewsCard";
import { CardGridSkeleton, ErrorState, EmptyState } from "../components/ui/States";
import Pagination from "../components/ui/Pagination";
import CtaBanner from "../components/home/CtaBanner";

const PAGE_SIZE = 12;

export default function News() {
  usePageMeta("Yangiliklar", "Avtomaktab hayotidagi so'nggi yangiliklar.");
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setNews(null);
    setError(null);
    api
      .news(page)
      .then((d) => {
        if (!active) return;
        const list = d.results || d;
        setNews(list);
        if (d.count != null) setTotalPages(Math.ceil(d.count / PAGE_SIZE));
      })
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [page, reloadKey]);

  return (
    <>
      <PageHeader
        kicker="Yangiliklar"
        title="So'nggi yangiliklar"
        description="Avtomaktabimiz hayotidagi e'lonlar va voqealar."
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="container-site">
          {error ? (
            <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
          ) : !news ? (
            <CardGridSkeleton count={6} />
          ) : news.length === 0 ? (
            <EmptyState title="Yangiliklar topilmadi" description="Hozircha yangiliklar qo'shilmagan." />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((item, i) => (
                  <NewsCard key={item.id} news={item} index={i} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
