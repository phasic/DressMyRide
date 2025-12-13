import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types';
import { reverseGeocode } from '../services/weatherService';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
}

export function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null);
  const [cityName, setCityName] = useState<string>('');

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    // Check if container already has Leaflet instance
    if ((mapRef.current as any)._leaflet_id) return;

    // Create default icon (used for clicked locations)
    const defaultIcon = L.icon({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Create person icon for current location
    const personIcon = L.divIcon({
      className: 'person-marker-icon',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background-color: #007AFF;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        ">👤</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });

    // Function to initialize map with a center location
    const initializeMap = (centerLat: number, centerLon: number) => {
      // Double-check container is not already initialized
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) {
        return mapInstanceRef.current;
      }
      
      // Initialize map
      const map = L.map(mapRef.current!, {
        center: [centerLat, centerLon],
        zoom: 13,
        zoomControl: true,
      });
      
      // Set ref immediately to prevent re-initialization
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

    // Handle map clicks
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Remove existing marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Add new marker
      const marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
      markerRef.current = marker;

      // Try to get city name
      let city: string | undefined;
      try {
        const cityName = await reverseGeocode(lat, lng);
        if (cityName) {
          city = cityName;
          setCityName(cityName);
        } else {
          setCityName('');
        }
      } catch {
        setCityName('');
      }

      const location: Location = { lat, lon: lng, city };
      setSelectedLocation(location);
      onLocationSelect(location);
    });

      return map;
    };

    // Try to get current location first
    const getCurrentLocationAndInitMap = async () => {
      let centerLat = 51.505; // Default to London
      let centerLon = -0.09;
      let currentLocation: Location | null = null;

      // Use initialLocation if provided
      if (initialLocation) {
        centerLat = initialLocation.lat;
        centerLon = initialLocation.lon;
        currentLocation = initialLocation;
      } else if (navigator.geolocation) {
        // Try to get user's current location
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 60000, // Use cached location if available (up to 1 minute old)
            });
          });
          
          centerLat = position.coords.latitude;
          centerLon = position.coords.longitude;
          currentLocation = {
            lat: centerLat,
            lon: centerLon,
          };

          // Try to get city name for current location
          try {
            const city = await reverseGeocode(centerLat, centerLon);
            if (city) {
              currentLocation.city = city;
              setCityName(city);
            }
          } catch {
            // Silently fail - city name is optional
          }
        } catch (error) {
          // Geolocation failed or denied - use default location
          console.log('Could not get current location, using default');
        }
      }

      // Initialize map with determined center
      const map = initializeMap(centerLat, centerLon);
      
      // If map initialization was skipped (already initialized), return early
      if (!map) return;

      // Add initial marker if we have a location (use person icon for current location)
      if (currentLocation) {
        const marker = L.marker([currentLocation.lat, currentLocation.lon], { icon: personIcon })
          .addTo(map);
        markerRef.current = marker;
        setSelectedLocation(currentLocation);
        onLocationSelect(currentLocation);
      }
    };

    getCurrentLocationAndInitMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // Note: onLocationSelect and initialLocation are intentionally omitted from deps
    // - initialLocation is handled by the second useEffect
    // - onLocationSelect is a stable callback prop
  }, []);

  // Update map if initialLocation changes externally
  useEffect(() => {
    if (mapInstanceRef.current && initialLocation && 
        (!selectedLocation || 
         Math.abs(selectedLocation.lat - initialLocation.lat) > 0.001 ||
         Math.abs(selectedLocation.lon - initialLocation.lon) > 0.001)) {
      mapInstanceRef.current.setView([initialLocation.lat, initialLocation.lon], 13);
      
      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }
      
      // Use person icon for initial location (current location)
      const personIcon = L.divIcon({
        className: 'person-marker-icon',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background-color: #007AFF;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          ">👤</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
      
      const marker = L.marker([initialLocation.lat, initialLocation.lon], { icon: personIcon })
        .addTo(mapInstanceRef.current);
      markerRef.current = marker;
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation, selectedLocation]);

  return (
    <div className="map-picker-container">
      <div ref={mapRef} className="map-picker" style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden' }} />
      {selectedLocation && (
        <div className="map-picker-info">
          <div className="map-picker-coords">
            {cityName ? (
              <>
                <strong>{cityName}</strong>
                <span className="map-picker-coords-text">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                </span>
              </>
            ) : (
              <span className="map-picker-coords-text">
                {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
              </span>
            )}
          </div>
          <p className="map-picker-hint">Click on the map to select a location</p>
        </div>
      )}
    </div>
  );
}

