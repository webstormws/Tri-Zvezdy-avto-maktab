import { useEffect, useState } from "react";
import { api } from "../services/api";
import { usePageMeta } from "../utils/seo";
import PageHeader from "../components/ui/PageHeader";
import BranchCard from "../components/cards/BranchCard";
import BranchMap from "../components/ui/BranchMap";
import { CardGridSkeleton, ErrorState, EmptyState } from "../components/ui/States";
import Pagination from "../components/ui/Pagination";
import CtaBanner from "../components/home/CtaBanner";

const PAGE_SIZE = 12;

export default function Branches() {
  usePageMeta("Filiallar", "Izboskan, Haqqulobod va To'rtko'l filiallarimiz.");
  const [branches, setBranches] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setBranches(null);
    setError(null);
    api
      .branches(page)
      .then((d) => {
        if (!active) return;
        const list = d.results || d;
        setBranches(list);
        if (d.count != null) setTotalPages(Math.ceil(d.count / PAGE_SIZE));
      })
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [page, reloadKey]);

  return (
    <>
      <PageHeader
        kicker="Manzillar"
        title="Bizning filiallarimiz"
        description="Viloyat bo'ylab filiallar — eng yaqin filialga tashrif buyuring."
      />
      <section className="bg-white py-16 lg:py-24">
        <div className="container-site">
          {error ? (
            <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
          ) : !branches ? (
            <CardGridSkeleton count={3} />
          ) : branches.length === 0 ? (
            <EmptyState title="Filiallar topilmadi" description="Hozircha filiallar qo'shilmagan." />
          ) : (
            <>
              <BranchMap
                branches={branches}
                zoom={10}
                className="mb-10 h-[320px] sm:h-[400px]"
              />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {branches.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
