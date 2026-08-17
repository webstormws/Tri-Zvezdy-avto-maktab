import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { formatDate } from "../../services/api";
import SafeImage from "../ui/SafeImage";

export default function NewsCard({ news, index = 0 }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1.5">
      <div className="relative overflow-hidden">
        <SafeImage
          src={news.image || ""}
          alt={news.title}
          loading={index < 3 ? "eager" : "lazy"}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {news.published_at && (
          <span className="chip absolute left-4 top-4 bg-white/90 text-primary backdrop-blur">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(news.published_at)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-ink">
          {news.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">
          {news.short_content || news.content}
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <Link
            to={`/news/${news.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary-light"
          >
            Batafsil
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
