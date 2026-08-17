import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { MapPin, Phone } from "lucide-react";
import { formatPhoneTel } from "../../services/api";

const defaultIcon = L.divIcon({
  className: "",
  html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:#005B3A;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,.3)"><span style="transform:rotate(45deg);color:#fff;font-size:14px">&#9733;</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
});

export function BranchMarker({ branch }) {
  if (!branch.latitude || !branch.longitude) return null;
  const lat = parseFloat(branch.latitude);
  const lng = parseFloat(branch.longitude);
  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker position={[lat, lng]} icon={defaultIcon}>
      <Popup>
        <div className="min-w-[180px] p-1">
          <p className="font-bold text-ink">{branch.title}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink/60">
            <MapPin className="h-3 w-3" /> {branch.address}
          </p>
          {branch.phone && (
            <a
              href={formatPhoneTel(branch.phone)}
              className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <Phone className="h-3 w-3" /> {branch.phone}
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default function BranchMap({ branches, center, zoom = 11, className = "" }) {
  const validBranches = (branches || []).filter(
    (b) => b.latitude && b.longitude && !isNaN(parseFloat(b.latitude)) && !isNaN(parseFloat(b.longitude))
  );

  if (validBranches.length === 0) return null;

  const defaultCenter = center || [
    parseFloat(validBranches[0].latitude),
    parseFloat(validBranches[0].longitude),
  ];

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ minHeight: "260px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validBranches.map((branch) => (
          <BranchMarker key={branch.id} branch={branch} />
        ))}
      </MapContainer>
    </div>
  );
}
