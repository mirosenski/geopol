"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            "osm": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors"
            }
          },
          layers: [
            {
              id: "osm-tiles",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 22
            }
          ]
        },
        center: [9.1829, 48.7758], // Stuttgart coordinates
        zoom: 12
      });

      // Add police stations data
      const policeStations = [
        { id: 1, name: "Polizeipräsidium", lat: 48.7758, lng: 9.1829, type: "hauptwache" },
        { id: 2, name: "Polizeirevier 1", lat: 48.7858, lng: 9.1929, type: "revier" },
        { id: 3, name: "Polizeirevier 2", lat: 48.7658, lng: 9.1729, type: "revier" },
        { id: 4, name: "Polizeirevier 3", lat: 48.7758, lng: 9.2029, type: "revier" },
        { id: 5, name: "Polizeirevier 4", lat: 48.7558, lng: 9.1629, type: "revier" }
      ];

      map.current.on("load", () => {
        if (!map.current) return;

        // Add police stations source
        map.current.addSource("police-stations", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: policeStations.map(station => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [station.lng, station.lat]
              },
              properties: {
                id: station.id,
                name: station.name,
                type: station.type
              }
            }))
          }
        });

        // Add police stations layer
        map.current.addLayer({
          id: "police-stations",
          type: "circle",
          source: "police-stations",
          paint: {
            "circle-radius": 8,
            "circle-color": [
              "case",
              ["==", ["get", "type"], "hauptwache"], "#dc2626",
              ["==", ["get", "type"], "revier"], "#2563eb",
              "#6b7280"
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff"
          }
        });

        // Add hover effect
        map.current.on("mouseenter", "police-stations", () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "pointer";
          }
        });

        map.current.on("mouseleave", "police-stations", () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = "";
          }
        });

        // Add click handler
        map.current.on("click", "police-stations", (e) => {
          if (e.features && e.features[0]) {
            const feature = e.features[0];
            const properties = feature.properties;
            if (properties) {
              alert(`${properties.name}\nTyp: ${properties.type}`);
            }
          }
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ fontFamily: "Arial, sans-serif" }}
    />
  );
}
