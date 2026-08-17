import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import SectionTitle from "../ui/SectionTitle";
import CourseCard from "../cards/CourseCard";
import { CardGridSkeleton, ErrorState } from "../ui/States";

export default function CoursesPreview() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setCourses(null);
    setError(null);
    api
      .courses()
      .then((d) => active && setCourses(d.results || d))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-site">
        <SectionTitle
          kicker="Bizning kurslar"
          title="Haydovchilik kurslarimiz"
          description="B, C, D, E toifalari bo'yicha zamonaviy o'quv dasturi asosida professional tayyorgarlik."
        />
        {error ? (
          <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : !courses ? (
          <CardGridSkeleton count={4} />
        ) : courses.length === 0 ? (
          <p className="text-center text-ink/50">Kurslar hozircha mavjud emas.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course, i) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/courses" className="btn-outline">
            Barcha kurslar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
