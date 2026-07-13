import { useState } from "react";

export default function SmartImage({ src, className, ...rest }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={`img-fallback ${className ?? ""}`}>unavailable</div>;
  }

  return (
    <img
      src={src}
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
