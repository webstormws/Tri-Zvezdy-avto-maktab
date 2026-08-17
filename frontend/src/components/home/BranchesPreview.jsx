import { Link } from "react-router-dom";
import { ArrowRight, MapPinned } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import SectionTitle from "../ui/SectionTitle";
import BranchCard from "../cards/BranchCard";
import { CardGridSkeleton, ErrorState } from "../ui/States";

export default function BranchesPreview() {
  const [branches, setBranches] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setBranches(null);
    setError(null);
    api
      .branches()
      .then((d) => active && setBranches(d.results || d))
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="container-site">
        <SectionTitle
          kicker="Manzillarimiz"
          title="Bizning filiallarimiz"
          description="Viloyat bo'ylab 3 ta filial — sizga eng yaqin joyda sifatli ta'lim."
        />
        {error ? (
          <ErrorState message={error.friendlyMessage} onRetry={() => setReloadKey((k) => k + 1)} />
        ) : !branches ? (
          <CardGridSkeleton count={3} />
        ) : branches.length === 0 ? (
          <p className="text-center text-ink/50">Filiallar hozircha mavjud emas.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link to="/branches" className="btn-outline">
            <MapPinned className="h-4 w-4" />
            Barcha filiallar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
