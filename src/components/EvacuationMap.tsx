import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { LocationData, ShelterData } from '../types/poster';

interface EvacuationMapProps {
  userLocation: LocationData;
  shelter: ShelterData;
  className?: string;
}

export const EvacuationMap: React.FC<EvacuationMapProps> = ({
  userLocation,
  shelter,
  className = 'h-48 w-full rounded-lg overflow-hidden border border-slate-700',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const bounds = L.latLngBounds(
      [userLocation.lat, userLocation.lon],
      [shelter.lat, shelter.lon]
    );

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          background-color: #2563eb;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 8px rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
        ">H</div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const shelterIcon = L.divIcon({
      className: 'custom-shelter-marker',
      html: `
        <div style="
          background-color: #dc2626;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(220,38,38,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 14px;
        ">S</div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
      .addTo(map)
      .bindTooltip('Twój Adres', { permanent: true, direction: 'top', offset: [0, -10] });

    L.marker([shelter.lat, shelter.lon], { icon: shelterIcon })
      .addTo(map)
      .bindTooltip('Schron / Ukrycie', { permanent: true, direction: 'bottom', offset: [0, 10] });

    const routeCoords: [number, number][] = [
      [userLocation.lat, userLocation.lon],
      [shelter.lat, shelter.lon],
    ];

    L.polyline(routeCoords, {
      color: '#dc2626',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9,
    }).addTo(map);

    map.fitBounds(bounds, { padding: [35, 35] });
    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation.lat, userLocation.lon, shelter.lat, shelter.lon]);

  return (
    <div className={className}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[160px]" />
    </div>
  );
};
