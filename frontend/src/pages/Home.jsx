import { usePageMeta } from "../utils/seo";
import Hero from "../components/home/Hero";
import Advantages from "../components/home/Advantages";
import CoursesPreview from "../components/home/CoursesPreview";
import ResultsSection from "../components/home/ResultsSection";
import BranchesPreview from "../components/home/BranchesPreview";
import NewsPreview from "../components/home/NewsPreview";
import CtaBanner from "../components/home/CtaBanner";

export default function Home() {
  usePageMeta(null);

  return (
    <>
      <Hero />
      <Advantages />
      <CoursesPreview />
      <ResultsSection />
      <BranchesPreview />
      <NewsPreview />
      <CtaBanner />
    </>
  );
}
