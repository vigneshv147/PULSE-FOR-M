import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { hospitals } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { getUserLocation } from '@/lib/geolocation';

const MumbaiMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const { toast } = useToast();

  //  ALWAYS USE DEFAULT TOKEN
  const mapboxToken =
    'pk.eyJ1Ijoic3JpZGVzaXlhbjciLCJhIjoiY21pMGJsZnp4MG84ZjJpczVtaDhzcGI0ZCJ9.w68SpgYy4HU3mesKKnssxA';

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // colorful map
        center: [72.8777, 19.0760], // Mumbai
        zoom: 11,
        pitch: 45,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      //  Add hospital markers
      hospitals.forEach((hospital) => {
        const el = document.createElement('div');
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

        const alertColors = {
          low: '#10b981',
          moderate: '#f59e0b',
          high: '#ef4444',
        };
        el.style.backgroundColor = alertColors[hospital.alertLevel];

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold;">${hospital.name}</h3>
            <p>${hospital.ward}</p>
            <p>Beds: ${hospital.bedsAvailable}/${hospital.totalBeds}</p>
            <p>Doctors: ${hospital.doctorsOnDuty}</p>
            <p style="margin-top: 4px; color:${alertColors[hospital.alertLevel]};">
              ● ${hospital.alertLevel.toUpperCase()}
            </p>
          </div>
        `);

        new mapboxgl.Marker(el)
          .setLngLat(hospital.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });

      // 🧍 User location
      map.current.on('load', () => {
        getUserLocation()
          .then((location) => {
            if (!map.current) return;

            const el = document.createElement('div');
            el.style.width = '20px';
            el.style.height = '20px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = '#10b981';
            el.style.border = '3px solid white';
            el.style.boxShadow = '0 0 10px rgba(16,185,129,0.5)';

            userMarker.current = new mapboxgl.Marker(el)
              .setLngLat([location.longitude, location.latitude])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                  '<div style="padding: 8px;"><b>Your Location</b></div>'
                )
              )
              .addTo(map.current);

            map.current.flyTo({
              center: [location.longitude, location.latitude],
              zoom: 12,
              duration: 2000,
            });
          })
          .catch(() => {
            // user denied location
          });
      });
    } catch (error) {
      toast({
        title: 'Map Error',
        description: 'Mapbox token invalid or map failed to load.',
        variant: 'destructive',
      });
    }

    return () => {
      userMarker.current?.remove();
      map.current?.remove();
    };
  }, [toast, mapboxToken]);

  return (
    <div className="relative w-full h-[500px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow" />

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border-2 border-gray-200">
        <h4 className="text-sm font-bold mb-2 text-gray-900">Hospital Alert Status</h4>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-md" style={{ background: '#10b981' }} />
            <span className="font-medium text-gray-800">Low Alert</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-md" style={{ background: '#f59e0b' }} />
            <span className="font-medium text-gray-800">Moderate Alert</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-white shadow-md" style={{ background: '#ef4444' }} />
            <span className="font-medium text-gray-800">High Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MumbaiMap;
