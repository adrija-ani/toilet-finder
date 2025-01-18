import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Navigation2 } from 'lucide-react';
import type { ToiletLocation } from '../types';

// Custom location icon
const locationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'location-pin'
});

interface MapProps {
  onToiletSelect: (toilet: ToiletLocation) => void;
}

// Component to handle location updates and routing
function LocationMarker({ selectedToilet }: { selectedToilet: ToiletLocation | null }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  // Handle routing when a toilet is selected
  useEffect(() => {
    if (position && selectedToilet) {
      // Remove existing routing control if it exists
      if (routingControl) {
        map.removeControl(routingControl);
      }

      // Create new routing control
      const control = L.Routing.control({
        waypoints: [
          L.latLng(position.lat, position.lng),
          L.latLng(selectedToilet.position.lat, selectedToilet.position.lng)
        ],
        routeWhileDragging: true,
        showAlternatives: true,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [{ color: '#6366f1', weight: 4 }]
        }
      }).addTo(map);

      setRoutingControl(control);
    }

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, position, selectedToilet]);

  return position === null ? null : (
    <Marker position={position} icon={locationIcon}>
      <Popup>
        <div className="text-center">
          <Navigation2 className="mx-auto mb-2 text-blue-500" size={24} />
          <p className="font-semibold">You are here</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function Map({ onToiletSelect }: MapProps) {
  const [toilets, setToilets] = useState<ToiletLocation[]>([]);
  const [selectedToilet, setSelectedToilet] = useState<ToiletLocation | null>(null);
  const defaultPosition: [number, number] = [8.5241, 76.9366];

  useEffect(() => {
    // Simulate fetching nearby toilets based on user location
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Generate sample toilets around user location
      const sampleToilets: ToiletLocation[] = [
        {
          id: '1',
          name: 'Public Toilet 1',
          position: { lat: userLat + 0.002, lng: userLng + 0.002 },
          paid: true,
          hygieneRating: 4,
          wheelchairAccessible: true,
          familyFriendly: true,
          showers: false,
          reviews: []
        },
        {
          id: '2',
          name: 'Public Toilet 2',
          position: { lat: userLat - 0.002, lng: userLng - 0.002 },
          paid: false,
          hygieneRating: 3,
          wheelchairAccessible: false,
          familyFriendly: true,
          showers: true,
          reviews: []
        }
      ];

      setToilets(sampleToilets);
    });
  }, []);

  const handleToiletSelect = (toilet: ToiletLocation) => {
    setSelectedToilet(toilet);
    onToiletSelect(toilet);
  };

  return (
    <MapContainer
      center={defaultPosition}
      zoom={15}
      className="w-full h-[400px] rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker selectedToilet={selectedToilet} />
      {toilets.map((toilet) => (
        <Marker
          key={toilet.id}
          position={[toilet.position.lat, toilet.position.lng]}
          eventHandlers={{
            click: () => handleToiletSelect(toilet),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{toilet.name}</h3>
              <p>Rating: {toilet.hygieneRating}/5</p>
              <p>{toilet.paid ? 'Paid' : 'Free'}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}