import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Maximize2, ExternalLink } from 'lucide-react';

export function InteractiveMap({ 
  destination = 'Ujjain', 
  centerCoords = [23.1765, 75.7885], 
  activities = [],
  className = "h-80 sm:h-96 w-full"
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [mapStyle, setMapStyle] = useState('dark');

  // Destination Coordinate Registry
  const destinationCoords = {
    'Ujjain': [23.1765, 75.7885],
    'Ayodhya': [26.7922, 82.1998],
    'Varanasi': [25.3176, 82.9739],
    'Puri': [19.8135, 85.8312],
    'Rishikesh': [30.0869, 78.2676],
    'Amritsar': [31.6200, 74.8765],
    'Somnath': [20.8880, 70.4012],
    'Goa': [15.4926, 73.8180],
    'Paris': [48.8566, 2.3522],
    'Tokyo': [35.6762, 139.6503],
    'Dubai': [25.2048, 55.2708]
  };

  const defaultCoords = destinationCoords[destination] || centerCoords || [23.1765, 75.7885];

  useEffect(() => {
    if (!mapRef.current) return;
    const L = window.L;
    if (!L) return;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: defaultCoords,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Add Zoom Control to Top Right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Dark / Street Tile Layer
      const tileUrl = mapStyle === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    // Clear previous markers & polylines
    layerGroup.clearLayers();

    // Map Center Update
    map.setView(defaultCoords, activities.length > 0 ? 13 : 12);

    const latLngs = [];

    // Add Markers for Activities
    activities.forEach((act, idx) => {
      const lat = act.latitude || defaultCoords[0] + (idx * 0.008 - 0.008);
      const lng = act.longitude || defaultCoords[1] + (idx * 0.009 - 0.009);
      latLngs.push([lat, lng]);

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background: #10b981;
            color: #022c22;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 13px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
            transform: translate(-50%, -50%);
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(layerGroup);

      // Popup Content
      const popupContent = `
        <div style="padding: 4px; max-width: 220px; font-family: sans-serif;">
          ${act.image_url ? `<img src="${act.image_url}" alt="${act.name}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />` : ''}
          <div style="font-size: 11px; font-weight: 700; color: #34d399; text-transform: uppercase;">Stop #${idx + 1} • ${act.time_slot || act.period || 'Scheduled Spot'}</div>
          <div style="font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 2px;">${act.name}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">${act.category || 'Sightseeing'} ${act.cost ? `• ₹${act.cost}` : '• Free'}</div>
        </div>
      `;

      marker.bindPopup(popupContent);
    });

    // Draw Route Polyline connecting spots
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#10b981',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(layerGroup);

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }

    return () => {
      // clean up if necessary
    };
  }, [destination, activities, mapStyle]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Map Control Floating Header */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-200 shadow-lg">
        <MapPin size={14} className="text-emerald-400 animate-pulse" />
        <span>Live Route Radar: {destination}</span>
        {activities.length > 0 && (
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
            {activities.length} Waypoints
          </span>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapRef} className={className} style={{ minHeight: '300px' }} />

      {/* Footer Map Legend */}
      <div className="bg-slate-900 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-medium">Waypoints</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-500 border-dashed" />
            <span className="text-slate-300 font-medium">Optimized Circuit</span>
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Leaflet OpenStreetMap • Live Telemetry
        </span>
      </div>

    </div>
  );
}

export default InteractiveMap;
