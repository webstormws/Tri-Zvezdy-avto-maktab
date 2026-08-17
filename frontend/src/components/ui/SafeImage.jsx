import { useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' fill='%23e5e7eb'%3E%3Crect width='120' height='80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%239ca3af'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E";

export default function SafeImage({ src, alt, className, loading, ...rest }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  if (failed || !imgSrc) {
    return <img src={PLACEHOLDER} alt={alt || ""} className={className} {...rest} />;
  }

  return (
    <img
      src={imgSrc}
      alt={alt || ""}
      className={className}
      loading={loading}
      onError={() => {
        setFailed(true);
      }}
      {...rest}
    />
  );
}
