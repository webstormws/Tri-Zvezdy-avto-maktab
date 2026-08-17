import { BadgeCheck, CarFront, ShieldCheck, UserRound } from "lucide-react";

const ADVANTAGES = [
  {
    icon: BadgeCheck,
    title: "100% Sifatli ta'lim",
    description: "Nazariy va amaliy darslar eng yuqori sifatda olib boriladi.",
  },
  {
    icon: UserRound,
    title: "Tajribali ustozlar",
    description: "Yillik tajribaga ega o'qituvchilar tomonidan dars beriladi.",
  },
  {
    icon: CarFront,
    title: "Zamonaviy yondashuv",
    description: "Zamonaviy avtomobil va metodlar bilan o'qitiladi.",
  },
  {
    icon: ShieldCheck,
    title: "Xavfsizlik kafolati",
    description: "Yo'l harakati qoidalari va xavfsizlik choralarini o'rgatamiz.",
  },
];

export default function Advantages() {
  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="container-site">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((item, i) => (
            <div
              key={item.title}
              className="card group flex flex-col gap-4 p-7 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                <item.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
