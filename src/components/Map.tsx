import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [9.1829, 48.7758], // Stuttgart
      zoom: 10,
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      className="h-[400px] w-full rounded-md border border-gray-300"
      aria-label="Karte mit Routen"
    />
  );
}
