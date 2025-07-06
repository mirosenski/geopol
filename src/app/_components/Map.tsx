"use client";

import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  showPoliceStations?: boolean;
  enableClustering?: boolean;
}

// Hochwertige SVG Icons als Data URLs
const POLICE_ICONS = {
  'police-hq': `data:image/svg+xml;base64,${btoa(`
    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="32" height="24" fill="#1e40af" rx="2"/>
      <path d="M 6 20 L 24 8 L 42 20 Z" fill="#1e3a8a"/>
      <rect x="12" y="24" width="3" height="16" fill="#dbeafe"/>
      <rect x="19" y="24" width="3" height="16" fill="#dbeafe"/>
      <rect x="26" y="24" width="3" height="16" fill="#dbeafe"/>
      <rect x="33" y="24" width="3" height="16" fill="#dbeafe"/>
      <rect x="21" y="32" width="6" height="8" fill="#1e3a8a"/>
      <path d="M 24 14 L 25.5 17 L 29 17.5 L 26.5 20 L 27 23.5 L 24 22 L 21 23.5 L 21.5 20 L 19 17.5 L 22.5 17 Z" fill="#fbbf24"/>
    </svg>
  `)}`,
  'police-station': `data:image/svg+xml;base64,${btoa(`
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="24" height="20" fill="#3b82f6" rx="2"/>
      <path d="M 6 16 L 20 8 L 34 16 Z" fill="#2563eb"/>
      <rect x="12" y="20" width="4" height="4" fill="#e0f2fe"/>
      <rect x="24" y="20" width="4" height="4" fill="#e0f2fe"/>
      <rect x="17" y="26" width="6" height="10" fill="#1e40af"/>
      <circle cx="20" cy="14" r="4" fill="#fbbf24"/>
      <text x="20" y="17" font-size="6" font-weight="bold" text-anchor="middle" fill="#1e3a8a">P</text>
    </svg>
  `)}`,
  'police-marker': `data:image/svg+xml;base64,${btoa(`
    <svg width="40" height="48" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 0 C 8.95 0 0 8.95 0 20 C 0 25 2 29.5 5 32.5 L 20 48 L 35 32.5 C 38 29.5 40 25 40 20 C 40 8.95 31.05 0 20 0 Z" fill="#2563eb"/>
      <circle cx="20" cy="18" r="12" fill="white"/>
      <path d="M 20 10 L 22 14 L 26 14.5 L 23 17.5 L 23.5 21.5 L 20 19.5 L 16.5 21.5 L 17 17.5 L 14 14.5 L 18 14 Z" fill="#2563eb"/>
    </svg>
  `)}`
};

export default function Map({
  className = "w-full h-full",
  initialCenter = [9.1829, 48.7758], // Stuttgart Zentrum
  initialZoom = 11,
  showPoliceStations = true,
  enableClustering = false
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Stuttgart police stations GeoJSON data (optimierte Koordinaten - 6 Dezimalstellen)
  const policeStationsGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: "pp-stuttgart",
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
          id: "pr-stuttgart-1",
          name: "Polizeirevier 1 Theodor-Heuss-Straße",
          address: "Theodor-Heuss-Straße 11, 70174 Stuttgart",
          type: "revier",
          phone: "0711 8990-3100"
        },
        geometry: { type: "Point", coordinates: [9.174450, 48.776927] }
      },
      {
        type: "Feature",
        properties: {
          id: "pr-stuttgart-2",
          name: "Polizeirevier 2 Wolframstraße",
          address: "Wolframstraße 36, 70191 Stuttgart",
          type: "revier",
          phone: "0711 8990-3200"
        },
        geometry: { type: "Point", coordinates: [9.183011, 48.792233] }
      },
      {
        type: "Feature",
        properties: {
          id: "pr-stuttgart-3",
          name: "Polizeirevier 3 Gutenbergstraße",
          address: "Gutenbergstraße 109/111, 70197 Stuttgart",
          type: "revier",
          phone: "0711 8990-3300"
        },
        geometry: { type: "Point", coordinates: [9.153933, 48.770066] }
      },
      {
        type: "Feature",
        properties: {
          id: "pr-stuttgart-4",
          name: "Polizeirevier 4 Balinger Straße",
          address: "Balinger Straße 31, 70567 Stuttgart",
          type: "revier",
          phone: "0711 8990-3400"
        },
        geometry: { type: "Point", coordinates: [9.142720, 48.729910] }
      },
      {
        type: "Feature",
        properties: {
          id: "pr-stuttgart-5",
          name: "Polizeirevier 5 Ostendstraße",
          address: "Ostendstraße 88, 70188 Stuttgart",
          type: "revier",
          phone: "0711 8990-3500"
        },
        geometry: { type: "Point", coordinates: [9.207963, 48.783734] }
      },
      {
        type: "Feature",
        properties: {
          id: "pr-stuttgart-6",
          name: "Polizeirevier 6 Martin-Luther Straße",
          address: "Martin-Luther-Straße 40/42, 70372 Stuttgart",
          type: "revier",
          phone: "0711 8990-3600"
        },
        geometry: { type: "Point", coordinates: [9.224090, 48.805090] }
      },
      {
        type: "Feature",
        properties: {
          id: "pr-stuttgart-7",
          name: "Polizeirevier 7 Ludwigsburger Straße",
          address: "Ludwigsburger Straße 126, 70435 Stuttgart",
          type: "revier",
          phone: "0711 8990-3700"
        },
        geometry: { type: "Point", coordinates: [9.174645, 48.831760] }
      },
      {
        type: "Feature",
        properties: {
          id: "pr-stuttgart-8",
          name: "Polizeirevier 8 Kärntner Straße",
          address: "Kärntner Straße 18, 70469 Stuttgart",
          type: "revier",
          phone: "0711 8990-3800"
        },
        geometry: { type: "Point", coordinates: [9.160630, 48.813125] }
      }
    ]
  };

      // Function to load icons into the map
  const loadIcons = async (mapInstance: maplibregl.Map) => {
    try {
      // For now, we'll use a simpler approach with circle markers
      // Custom icons require additional setup that might not be available
      console.log('✅ Using circle markers instead of custom icons');
    } catch (err) {
      console.error('❌ Error loading icons:', err);
    }
  };

  // Function to add police stations to the map
  const addPoliceStations = async (mapInstance: maplibregl.Map) => {
    try {
      console.log('🗺️ Adding police stations...');

      // Wait for map to be fully loaded
      if (!mapInstance.isStyleLoaded()) {
        console.log('⏳ Waiting for map style to load...');
        await new Promise(resolve => {
          mapInstance.once('styledata', resolve);
        });
      }

      // Remove existing layers and source first to avoid conflicts
      const layersToRemove = [
        'police-stations-circles',
        'clusters'
        // 'police-stations-labels', // commented out
        // 'cluster-count' // commented out
      ];

      layersToRemove.forEach(layerId => {
        try {
          if (mapInstance.getLayer(layerId)) {
            mapInstance.removeLayer(layerId);
            console.log(`🗑️ Removed layer: ${layerId}`);
          }
        } catch (err) {
          console.warn(`⚠️ Could not remove layer ${layerId}:`, err);
        }
      });

      try {
        if (mapInstance.getSource('police-stations')) {
          mapInstance.removeSource('police-stations');
          console.log('🗑️ Removed source: police-stations');
        }
      } catch (err) {
        console.warn('⚠️ Could not remove source police-stations:', err);
      }

      // Add GeoJSON source
      console.log('➕ Adding police stations source...');
      mapInstance.addSource('police-stations', {
        type: 'geojson',
        data: policeStationsGeoJSON as any,
        cluster: enableClustering,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add circle layer for individual stations
      console.log('➕ Adding police stations circles...');
      mapInstance.addLayer({
        id: 'police-stations-circles',
        type: 'circle',
        source: 'police-stations',
        filter: ['!', ['has', 'point_count']],
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
            '#DC2626',
            '#2563EB'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add labels for police stations (commented out due to glyphs requirement)
      // console.log('➕ Adding police stations labels...');
      // mapInstance.addLayer({
      //   id: 'police-stations-labels',
      //   type: 'symbol',
      //   source: 'police-stations',
      //   filter: ['!', ['has', 'point_count']],
      //   layout: {
      //     'text-field': ['get', 'name'],
      //     'text-font': ['Arial'],
      //     'text-size': [
      //       'interpolate',
      //       ['linear'],
      //       ['zoom'],
      //       10, 0,
      //       12, 11,
      //       14, 13
      //     ],
      //     'text-offset': [0, 1.5],
      //     'text-anchor': 'top',
      //     'text-max-width': 12,
      //     'text-optional': true
      //   },
      //   paint: {
      //     'text-color': '#1f2937',
      //     'text-halo-color': '#ffffff',
      //     'text-halo-width': 2,
      //     'text-halo-blur': 0.5
      //   }
      // });

      // Add cluster layer if clustering is enabled
      if (enableClustering) {
        console.log('➕ Adding cluster layers...');

        mapInstance.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'police-stations',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#3b82f6',
              5,
              '#2563eb',
              10,
              '#1e40af'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              5,
              25,
              10,
              30
            ],
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Cluster count labels (commented out due to glyphs requirement)
        // mapInstance.addLayer({
        //   id: 'cluster-count',
        //   type: 'symbol',
        //   source: 'police-stations',
        //   filter: ['has', 'point_count'],
        //   layout: {
        //     'text-field': '{point_count_abbreviated}',
        //     'text-font': ['Arial'],
        //     'text-size': 14
        //   },
        //   paint: {
        //     'text-color': '#ffffff'
        //   }
        // });
      }

      console.log('✅ Police stations added successfully');

      // Add click handler for stations
      mapInstance.on('click', 'police-stations-circles', (e) => {
        if (!e.features || e.features.length === 0) return;

        const feature = e.features[0];
        if (!feature) return;

        const coordinates = (feature.geometry as any).coordinates.slice();
        const properties = feature.properties;

        // Create enhanced popup content
        const popupContent = `
          <div class="p-4 max-w-xs">
            <div class="flex items-center gap-2 mb-2">
              ${properties.type === 'präsidium' ?
                '<span class="text-2xl">🏛️</span>' :
                '<span class="text-2xl">🚔</span>'}
              <h3 class="font-bold text-gray-900 text-base">${properties.name}</h3>
            </div>
            <div class="space-y-1 text-sm">
              <p class="text-gray-600 flex items-center gap-2">
                <span>📍</span> ${properties.address}
              </p>
              <p class="text-gray-600 flex items-center gap-2">
                <span>📞</span>
                <a href="tel:${properties.phone}" class="text-blue-600 hover:underline">
                  ${properties.phone}
                </a>
              </p>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-200">
              <button class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                🧭 Route hierher
              </button>
            </div>
          </div>
        `;

        new maplibregl.Popup({
          closeButton: true,
          closeOnClick: true,
          maxWidth: '300px'
        })
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(mapInstance);

        setSelectedStation(properties.id);
      });

      // Change cursor on hover
      mapInstance.on('mouseenter', 'police-stations-circles', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });

      mapInstance.on('mouseleave', 'police-stations-circles', () => {
        mapInstance.getCanvas().style.cursor = '';
      });

              // Handle cluster clicks
        if (enableClustering) {
          mapInstance.on('click', 'clusters', (e) => {
            const features = mapInstance.queryRenderedFeatures(e.point, {
              layers: ['clusters']
            });
            if (features.length > 0 && features[0]) {
              const clusterId = features[0].properties?.cluster_id;
              const source = mapInstance.getSource('police-stations') as any;

              if (clusterId && source) {
                source.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
                  if (err) return;

                  if (features[0] && features[0].geometry) {
                    mapInstance.easeTo({
                      center: (features[0].geometry as any).coordinates,
                      zoom: zoom
                    });
                  }
                });
              }
            }
          });

        mapInstance.on('mouseenter', 'clusters', () => {
          mapInstance.getCanvas().style.cursor = 'pointer';
        });

        mapInstance.on('mouseleave', 'clusters', () => {
          mapInstance.getCanvas().style.cursor = '';
        });
      }

    } catch (err) {
      console.error('Error adding police stations:', err);
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map with CartoDB Light tiles (schneller und moderner)
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          glyphs: 'https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=no-key',
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors, © CartoDB'
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
        center: initialCenter,
        zoom: initialZoom,
        attributionControl: false
      });

      // Add navigation controls
      map.current.addControl(
        new maplibregl.NavigationControl({
          visualizePitch: true
        }),
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

      // Add attribution control with custom position
      map.current.addControl(
        new maplibregl.AttributionControl({
          compact: true
        }),
        'bottom-right'
      );

      // Handle map load
      map.current.on('load', async () => {
        setIsLoading(false);
        console.log('🗺️ Map loaded successfully');

        // Add police stations if enabled
        if (showPoliceStations && map.current) {
          try {
            await addPoliceStations(map.current);
          } catch (err) {
            console.error('❌ Error adding police stations:', err);
            setError('Fehler beim Laden der Polizeistationen');
          }
        }
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('❌ Map error:', e);
        setError(`Fehler beim Laden der Karte: ${e.error?.message || 'Unbekannter Fehler'}`);
      });

    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError('Karte konnte nicht initialisiert werden');
    }

    // Cleanup
    return () => {
      if (map.current) {
        // Layer entfernen
        const layers = [
          'police-stations-circles',
          'police-stations-labels',
          'clusters',
          'cluster-count'
        ];
        for (const layer of layers) {
          if (map.current.getLayer(layer)) {
            map.current.removeLayer(layer);
          }
        }
        // Quelle entfernen
        if (map.current.getSource('police-stations')) {
          map.current.removeSource('police-stations');
        }
        map.current.remove();
      }
    };
  }, [initialCenter, initialZoom, showPoliceStations, enableClustering]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className={className} />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg">🚔</span>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">Karte wird geladen...</span>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 backdrop-blur-sm">
          <div className="rounded-lg bg-white p-6 shadow-xl max-w-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900">Fehler</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info panel */}
      <div className="absolute left-4 top-4 rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur-sm max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🚔</span>
          <h3 className="text-base font-bold text-gray-900">GeoPol Stuttgart</h3>
        </div>
        <p className="text-sm text-gray-600">Polizei-Einsatzgebiete</p>
        {showPoliceStations && (
          <div className="mt-3 pt-3 border-t border-gray-200 space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="inline-block w-3 h-3 bg-blue-800 rounded"></span>
              <span>1 Polizeipräsidium</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded"></span>
              <span>8 Polizeireviere</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected station info */}
      {selectedStation && (
        <div className="absolute right-4 bottom-20 rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm text-sm">
          <span className="text-gray-600">Ausgewählt: </span>
          <span className="font-medium text-gray-900">{selectedStation}</span>
        </div>
      )}
    </div>
  );
}
