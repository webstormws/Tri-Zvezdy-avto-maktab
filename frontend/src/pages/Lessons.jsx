import { useEffect, useState } from "react";
import { api } from "../services/api";
import { usePageMeta } from "../utils/seo";
import PageHeader from "../components/ui/PageHeader";
import LessonCard from "../components/cards/LessonCard";
import { CardGridSkeleton, ErrorState, EmptyState } from "../components/ui/States";
import Pagination from "../components/ui/Pagination";
import CtaBanner from "../components/home/CtaBanner";

const PAGE_SIZE = 12;

export default function Lessons() {
  usePageMeta("Mashg'ulotlar", "Nazariy va amaliy mashg'ulotlar haqida.");
  const [lessons, setLessons] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLessons(null);
    setError(null);
    api
      .lessons(page)
      .then((d) => {
        if (!active) return;
        const list = d.results || d;
        setLessons(list);
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
        kicker="O'quv jarayoni"
        title="Mashg'ulotlar"
        description="Nazariy bilimdan amaliy mahoratgacha — to'liq o'quv jarayoni."
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="container-site">
          {error ? (
            <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
          ) : !lessons ? (
            <CardGridSkeleton count={3} type="icon" />
          ) : lessons.length === 0 ? (
            <EmptyState title="Mashg'ulotlar topilmadi" description="Hozircha ma'lumotlar qo'shilmagan." />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson, i) => (
                  <LessonCard key={lesson.id} lesson={lesson} index={i} />
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
