"use client";

import { useRef, useEffect, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import type { GeoJSON } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  className?: string;
}

export function MapComponent({ className = "w-full h-full" }: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Stuttgart police stations GeoJSON data
  const policeStationsGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Polizeipräsidium Stuttgart",
          address: "Hahnemannstraße 1, 70191 Stuttgart",
          type: "präsidium",
          phone: "0711 8990-0"
        },
        geometry: { type: "Point", coordinates: [9.18686, 48.81046] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 1 Theodor-Heuss-Straße",
          address: "Theodor-Heuss-Straße 11, 70174 Stuttgart",
          type: "revier",
          phone: "0711 8990-3100"
        },
        geometry: { type: "Point", coordinates: [9.1744498, 48.7769268] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 2 Wolframstraße",
          address: "Wolframstraße 36, 70191 Stuttgart",
          type: "revier",
          phone: "0711 8990-3200"
        },
        geometry: { type: "Point", coordinates: [9.1830113, 48.7922325] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 3 Gutenbergstraße",
          address: "Gutenbergstraße 109/111, 70197 Stuttgart",
          type: "revier",
          phone: "0711 8990-3300"
        },
        geometry: { type: "Point", coordinates: [9.1539327, 48.7700658] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 4 Balinger Straße",
          address: "Balinger Straße 31, 70567 Stuttgart",
          type: "revier",
          phone: "0711 8990-3400"
        },
        geometry: { type: "Point", coordinates: [9.14272, 48.72991] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 5 Ostendstraße",
          address: "Ostendstraße 88, 70188 Stuttgart",
          type: "revier",
          phone: "0711 8990-3500"
        },
        geometry: { type: "Point", coordinates: [9.2079634, 48.7837341] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 6 Martin-Luther Straße",
          address: "Martin-Luther-Straße 40/42, 70372 Stuttgart",
          type: "revier",
          phone: "0711 8990-3600"
        },
        geometry: { type: "Point", coordinates: [9.22409, 48.80509] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 7 Ludwigsburger Straße",
          address: "Ludwigsburger Straße 126, 70435 Stuttgart",
          type: "revier",
          phone: "0711 8990-3700"
        },
        geometry: { type: "Point", coordinates: [9.1746453, 48.8317597] }
      },
      {
        type: "Feature",
        properties: {
          name: "Polizeirevier 8 Kärntner Straße",
          address: "Kärntner Straße 18, 70469 Stuttgart",
          type: "revier",
          phone: "0711 8990-3800"
        },
        geometry: { type: "Point", coordinates: [9.16063, 48.8131253] }
      }
    ]
  };

  // Function to add police stations to the map
  const addPoliceStations = useCallback((mapInstance: maplibregl.Map) => {
    // Add GeoJSON source
    mapInstance.addSource('police-stations', {
      type: 'geojson',
      data: policeStationsGeoJSON
    });

    // Add layer for police stations
    mapInstance.addLayer({
      id: 'police-stations-layer',
      type: 'circle',
      source: 'police-stations',
      paint: {
        'circle-radius': [
          'case',
          ['==', ['get', 'type'], 'präsidium'],
          12,
          8
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'type'], 'präsidium'],
          '#DC2626', // Red for Präsidium
          '#2563EB'  // Blue for Revier
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add labels for police stations
    mapInstance.addLayer({
      id: 'police-stations-labels',
      type: 'symbol',
      source: 'police-stations',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Open Sans Regular'],
        'text-size': 11,
        'text-offset': [0, 1.5],
        'text-anchor': 'top',
        'text-max-width': 10
      },
      paint: {
        'text-color': '#1F2937',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.5
      }
    });

    // Add popups on click
    mapInstance.on('click', 'police-stations-layer', (e) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      if (!feature) return;

      const geometry = feature.geometry as { type: string; coordinates: [number, number] };
      const coordinates = geometry.coordinates.slice() as [number, number];
      const properties = feature.properties as { name: string; type: string; address: string; phone: string };

      // Create popup content
      const popupContent = `
        <div class="p-3 max-w-xs">
          <h3 class="font-semibold text-gray-900 text-sm">
            ${properties.type === 'präsidium' ? '🏛️' : '🚔'} ${properties.name}
          </h3>
          <p class="text-xs text-gray-600 mt-1">📍 ${properties.address}</p>
          <p class="text-xs text-gray-600">📞 ${properties.phone}</p>
        </div>
      `;

      new maplibregl.Popup({
        closeButton: true,
        closeOnClick: true
      })
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(mapInstance);
    });

    // Change cursor on hover
    mapInstance.on('mouseenter', 'police-stations-layer', () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });

    mapInstance.on('mouseleave', 'police-stations-layer', () => {
      mapInstance.getCanvas().style.cursor = '';
    });
  }, [policeStationsGeoJSON]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [9.1829, 48.7758], // Stuttgart center
      zoom: 11,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 200,
        unit: 'metric'
      }),
      'bottom-left'
    );

    // Add attribution control
    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true
      }),
      'bottom-right'
    );

    // Handle map load
    map.current.on('load', () => {
      if (map.current) {
        addPoliceStations(map.current);
      }
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [addPoliceStations]); // Füge addPoliceStations als Dependency hinzu

  return <div ref={mapContainer} className={className} />;
}
