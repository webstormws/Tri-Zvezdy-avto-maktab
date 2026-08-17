export default function PageHeader({ kicker, title, description }) {
  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.07]" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/[0.05]" />
      <div className="container-site relative text-center">
        {kicker && (
          <span className="chip mb-4 bg-white/10 text-white">{kicker}</span>
        )}
        <h1 className="mx-auto max-w-3xl text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
