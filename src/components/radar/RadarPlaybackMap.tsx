import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { COVERAGE_RADIUS_KM, type RadarStation } from '@/data/radarStations';

interface RadarPlaybackMapProps {
  station: RadarStation;
  frameUrl: string | null;
  opacity: number;
  showCoverage: boolean;
  showStation: boolean;
}

export default function RadarPlaybackMap({
  station,
  frameUrl,
  opacity,
  showCoverage,
  showStation,
}: RadarPlaybackMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const frameLayerRef = useRef<L.TileLayer | null>(null);
  const coverageRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: [station.lat, station.lon],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    const coverage = L.circle([station.lat, station.lon], {
      radius: COVERAGE_RADIUS_KM * 1000,
      color: '#17274F',
      weight: 1.5,
      dashArray: '6 6',
      fillOpacity: 0.04,
    });
    coverageRef.current = coverage;

    const marker = L.circleMarker([station.lat, station.lon], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: '#F6B91A',
      fillOpacity: 1,
    });
    markerRef.current = marker;

    coverage.addTo(map);
    marker.addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      frameLayerRef.current = null;
      coverageRef.current = null;
      markerRef.current = null;
    };
  }, [station.lat, station.lon]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!frameUrl) {
      frameLayerRef.current?.remove();
      frameLayerRef.current = null;
      return;
    }

    if (frameLayerRef.current) {
      frameLayerRef.current.setUrl(frameUrl);
      frameLayerRef.current.setOpacity(opacity);
    } else {
      frameLayerRef.current = L.tileLayer(frameUrl, {
        opacity,
        maxNativeZoom: 7,
        maxZoom: 18,
        zIndex: 10,
      }).addTo(map);
    }
  }, [frameUrl, opacity]);

  useEffect(() => {
    const map = mapRef.current;
    const coverage = coverageRef.current;
    if (!map || !coverage) return;
    if (showCoverage) coverage.addTo(map);
    else coverage.remove();
  }, [showCoverage]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;
    if (showStation) marker.addTo(map);
    else marker.remove();
  }, [showStation]);

  return <div ref={containerRef} className="h-full w-full" role="region" aria-label={`Radar map for ${station.code}`} />;
}
