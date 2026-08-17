import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageMeta } from "../utils/seo";

export default function NotFound() {
  usePageMeta("Sahifa topilmadi");

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-surface px-4 py-20">
      <div className="text-center">
        <p className="text-7xl font-extrabold tracking-tight text-primary">404</p>
        <h1 className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-ink">
          Sahifa topilmadi
        </h1>
        <p className="mt-2 text-ink/60">
          Siz izlagan sahifa mavjud emas yoki ko'chirilgan.
        </p>
        <Link to="/" className="btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" />
          Bosh sahifaga qaytish
        </Link>
      </div>
    </section>
  );
}
