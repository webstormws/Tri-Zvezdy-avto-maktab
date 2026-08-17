import { usePageMeta } from "../utils/seo";
import PageHeader from "../components/ui/PageHeader";
import ResultsSection from "../components/home/ResultsSection";
import CtaBanner from "../components/home/CtaBanner";

export default function Results() {
  usePageMeta("Natijalar", "Avtomaktabimizning muvaffaqiyat ko'rsatkichlari.");

  return (
    <>
      <PageHeader
        kicker="Yutuqlarimiz"
        title="Natijalarimiz"
        description="Raqamlar o'zimiz uchun so'zlamaydi — bitiruvchilarimiz natijalari."
      />
      <div className="bg-white">
        <ResultsSection showHeading={false} />
      </div>
      <CtaBanner />
    </>
  );
}
