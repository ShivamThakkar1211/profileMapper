import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ location }) => {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(location);

  useEffect(() => {
    if (location) {
      setMarkerPosition(location); // Update marker position when location changes
    }
  }, [location]); // Dependency array ensures it updates only when the location changes

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: markerPosition?.lat || 0,
    lng: markerPosition?.lng || 0,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={(map) => setMap(map)} // Initialize the map on load
      >
        {markerPosition && (
          <Marker position={markerPosition} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
