export default function SectionTitle({ kicker, title, description, align = "center", light = false }) {
  return (
    <div className={`mb-12 ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {kicker && (
        <span
          className={`chip mb-4 ${light ? "bg-white/10 text-white" : "bg-primary/10 text-primary"}`}
        >
          {kicker}
        </span>
      )}
      <h2 className={`section-title ${light ? "text-white" : ""}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-ink/60"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
