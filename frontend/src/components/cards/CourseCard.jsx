import { Link } from "react-router-dom";
import { ArrowRight, Car, Clock } from "lucide-react";
import { formatPrice } from "../../services/api";
import SafeImage from "../ui/SafeImage";

export default function CourseCard({ course }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1.5">
      <div className="relative overflow-hidden">
        <SafeImage
          src={course.image || ""}
          alt={course.title}
          loading="lazy"
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="chip absolute left-4 top-4 bg-primary/90 text-white backdrop-blur">
          {course.category} toifa
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-extrabold tracking-tight text-ink">{course.title}</h3>
        <p className="mt-1 text-sm font-medium text-primary">{course.short_description}</p>
        <div className="mt-4 flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-ink/70">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {course.duration || "3 oy"}
          </span>
          {course.price !== null && course.price !== undefined && (
            <span className="text-sm font-extrabold text-ink">{formatPrice(course.price)}</span>
          )}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-primary/5 pt-5">
          <Link
            to={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-light"
          >
            <Car className="h-4 w-4" />
            Batafsil
          </Link>
          <ArrowRight className="h-4 w-4 text-ink/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </article>
  );
}
