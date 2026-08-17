import {
  BookOpen,
  Car,
  ClipboardCheck,
  Settings2,
  Shield,
  Sparkles,
} from "lucide-react";
import SafeImage from "../ui/SafeImage";

const ICON_MAP = {
  BookOpen,
  Car,
  ClipboardCheck,
  Settings2,
  Shield,
  GraduationCap: Sparkles,
};

export default function LessonCard({ lesson, index = 0 }) {
  const Icon = ICON_MAP[lesson.icon] || Sparkles;

  return (
    <article
      className="card group flex h-full flex-col overflow-hidden p-7 hover:-translate-y-1.5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
          <Icon className="h-7 w-7" />
        </div>
        {lesson.image && (
          <SafeImage
            src={lesson.image}
            alt={lesson.title}
            loading="lazy"
            className="h-16 w-24 rounded-xl object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="mt-5 text-lg font-extrabold tracking-tight text-ink">{lesson.title}</h3>
      {lesson.subtitle && <p className="mt-1 text-sm font-semibold text-primary">{lesson.subtitle}</p>}
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        {lesson.description || "Kurs davomida batafsil o'rganilasiz."}
      </p>
    </article>
  );
}
