import { useEffect } from "react";

const SITE_URL = "https://trizvezdy.webstorm.uz";
const DEFAULT_TITLE = "Tri Zvezdy Avto Maktab — Sifatli Haydovchilik Ta'limi";
const DEFAULT_DESCRIPTION =
  "Tri Zvezdy Avto Maktab — eng sifatli darslar, tajribali o'qituvchilar va zamonaviy yondashuv bilan haydovchilikni oson va ishonchli o'rganing.";

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function usePageMeta(title, description, options = {}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | Tri Zvezdy` : DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const pageUrl = options.url || window.location.href;

    document.title = pageTitle;
    setMeta('meta[name="description"]', "content", pageDescription);
    setMeta("link[rel='canonical']", "href", pageUrl);
    setMeta('meta[property="og:title"]', "content", pageTitle);
    setMeta('meta[property="og:description"]', "content", pageDescription);
    setMeta("meta[name='twitter:title']", "content", pageTitle);
    setMeta("meta[name='twitter:description']", "content", pageDescription);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', "content", DEFAULT_DESCRIPTION);
      setMeta("link[rel='canonical']", "href", SITE_URL + "/");
      setMeta('meta[property="og:title"]', "content", DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', "content", DEFAULT_DESCRIPTION);
    };
  }, [title, description, options.url]);
}