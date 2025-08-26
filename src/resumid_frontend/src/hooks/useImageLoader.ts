import { useState } from "react";

export function useImageLoader() {
  const [loaded, setLoaded] = useState(false);
  const handleLoad = () => setLoaded(true);
  return { loaded, handleLoad };
}
