import { useEffect } from "react";

const DEFAULT_TITLE = "Tri Zvezdy Avto Maktab — Sifatli Haydovchilik Ta'limi";
const DEFAULT_DESCRIPTION =
  "Tri Zvezdy Avto Maktab — eng sifatli darslar, tajribali o'qituvchilar va zamonaviy yondashuv bilan haydovchilikni oson va ishonchli o'rganing.";

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Tri Zvezdy` : DEFAULT_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description || DEFAULT_DESCRIPTION);
    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute("content", title || DEFAULT_TITLE);
    return () => {
      document.title = DEFAULT_TITLE;
      const m = document.querySelector('meta[name="description"]');
      if (m) m.setAttribute("content", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
