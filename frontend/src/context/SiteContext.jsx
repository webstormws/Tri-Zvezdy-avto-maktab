import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const SiteContext = createContext(null);

const FALLBACK_SETTINGS = {
  site_name: "Tri Zvezdy Avto Maktab",
  logo: "/logo.png",
  hero_subtitle: "SIFATLI TA'LIM — XAVFSIZ HAYOT",
  hero_title: "TRI ZVEZDY AVTO MAKTAB",
  hero_description:
    "Eng sifatli darslar, tajribali o'qituvchilar va zamonaviy yondashuv bilan haydovchilikni oson va ishonchli o'rganing.",
  phones: ["990 077 170", "911 675 560", "944 888 879", "991 729 090"],
  instagram: "",
  telegram: "",
  facebook: "",
  webstorm_name: "WebStorm",
  webstorm_tagline: "Zamonaviy web yechimlar va sifatli dasturlash xizmatlari",
  webstorm_link: "https://webstorm.uz",
  webstorm_logo: null,
  footer_description:
    "Professional haydovchilik maktabi — sifatli ta'lim, tajribali ustozlar va zamonaviy yondashuv.",
  about_title: "BIZ HAQIMIZDA",
  about_content:
    "Tri Zvezdy Avto Maktab — zamonaviy, sifatli va ishonchli haydovchilik ta'limini taqdim etuvchi avtomaktab.",
};

function toRelativeMedia(val) {
  if (!val || typeof val !== "string") return val;
  const m = val.match(/\/media\/(.+)$/);
  return m ? `/media/${m[1]}` : val;
}

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await api.settings();
      data.logo = toRelativeMedia(data.logo);
      data.webstorm_logo = toRelativeMedia(data.webstorm_logo);
      setSettings({ ...FALLBACK_SETTINGS, ...data });
    } catch {
      // keep fallbacks so the site still renders
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SiteContext.Provider value={{ settings, loading, reload: load }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
