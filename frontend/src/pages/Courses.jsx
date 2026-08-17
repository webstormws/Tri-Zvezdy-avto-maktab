import { useEffect, useState } from "react";
import { api } from "../services/api";
import { usePageMeta } from "../utils/seo";
import PageHeader from "../components/ui/PageHeader";
import CourseCard from "../components/cards/CourseCard";
import { CardGridSkeleton, ErrorState, EmptyState } from "../components/ui/States";
import Pagination from "../components/ui/Pagination";
import CtaBanner from "../components/home/CtaBanner";

const PAGE_SIZE = 12;

export default function Courses() {
  usePageMeta("Kurslar", "B, C, D, E toifalari bo'yicha haydovchilik kurslari.");
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setCourses(null);
    setError(null);
    api
      .courses(page)
      .then((d) => {
        if (!active) return;
        const list = d.results || d;
        setCourses(list);
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
        kicker="Kurslar"
        title="Haydovchilik kurslarimiz"
        description="O'zingizga mos toifani tanlang va zamonaviy o'quv dasturi bo'yicha o'rganing."
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="container-site">
          {error ? (
            <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
          ) : !courses ? (
            <CardGridSkeleton count={4} />
          ) : courses.length === 0 ? (
            <EmptyState title="Kurslar topilmadi" description="Hozircha kurslar qo'shilmagan." />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
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
