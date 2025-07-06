"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: "https://demotiles.maplibre.org/style.json", // public Tile Style
      center: [9.1829, 48.7758], // Stuttgart
      zoom: 9,
    });

    return () => map.remove();
  }, []);

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-gray-300">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}
