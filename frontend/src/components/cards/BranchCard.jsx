import { ExternalLink, MapPin, Phone } from "lucide-react";
import { formatPhoneTel } from "../../services/api";
import SafeImage from "../ui/SafeImage";
import BranchMap from "../ui/BranchMap";

export default function BranchCard({ branch }) {
  const hasCoords = branch.latitude && branch.longitude;

  return (
    <article className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1.5">
      {hasCoords ? (
        <div className="relative h-48 w-full overflow-hidden">
          <BranchMap
            branches={[branch]}
            center={[parseFloat(branch.latitude), parseFloat(branch.longitude)]}
            zoom={15}
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/80 to-transparent pt-8">
            <h3 className="px-5 pb-2 text-lg font-extrabold tracking-tight text-ink">
              {branch.title}
            </h3>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <SafeImage
            src={branch.image || ""}
            alt={branch.title}
            loading="lazy"
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
          <h3 className="absolute bottom-4 left-5 text-lg font-extrabold tracking-tight text-white">
            {branch.title}
          </h3>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="flex items-start gap-2.5 text-sm text-ink/65">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {branch.address}
        </p>
        <a
          href={formatPhoneTel(branch.phone)}
          className="flex items-center gap-2.5 text-sm font-bold text-ink transition-colors hover:text-primary"
        >
          <Phone className="h-4 w-4 shrink-0 text-primary" />
          {branch.phone}
        </a>
        <div className="mt-auto border-t border-primary/5 pt-4">
          {branch.map_link ? (
            <a
              href={branch.map_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full !py-2.5 !text-xs"
            >
              Google Maps
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <p className="text-center text-xs font-medium text-ink/40">Xarita havolasi mavjud emas</p>
          )}
        </div>
      </div>
    </article>
  );
}
