import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { useCorridors } from '@/context/CorridorContext';
import { useNavigate } from 'react-router-dom';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

const CorridorMap = () => {
  const { corridors, selectCorridor } = useCorridors();
  const navigate = useNavigate();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY ?? '',
  });

  const center = useMemo(() => ({ lat: 20.5937, lng: 78.9629 }), []);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  const mapOptions = {
    zoom: 5,
    center: center,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  const handleMarkerClick = (corridorId: string) => {
    setSelectedMarker(selectedMarker === corridorId ? null : corridorId);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  const handleViewDetails = (corridorId: string) => {
    selectCorridor(corridorId);
    navigate('/insights');
  };

  // No directions fetching; straight-line polylines will be drawn

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg p-6 text-center">
        <div>
          <p className="font-semibold">Google Maps API key missing</p>
          <p className="text-muted-foreground mt-1">Set VITE_GOOGLE_MAPS_API_KEY in a .env file and restart dev server.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg p-6 text-center">
        <div>
          <p className="font-semibold">Failed to load Google Maps</p>
          <p className="text-muted-foreground mt-1">{String(loadError)}</p>
          <p className="text-muted-foreground mt-1">Check API enablement, billing, and referrer restrictions.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={5}
      options={mapOptions}
    >
      {corridors.map((corridor) => {
        const color =
          corridor.riskLevel === 'safe'
            ? '#22c55e'
            : corridor.riskLevel === 'at-risk'
            ? '#eab308'
            : '#ef4444';

        const routePath = [
          { lat: corridor.coordinates[1], lng: corridor.coordinates[0] },
          { lat: corridor.routeEndCoordinates[1], lng: corridor.routeEndCoordinates[0] },
        ];

        return (
          <Polyline
            key={`route-${corridor.id}`}
            path={routePath}
            options={{
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 4,
              icons: [
                {
                  icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 3,
                    strokeColor: color,
                    fillColor: color,
                    fillOpacity: 1,
                  },
                  offset: '100%',
                },
              ],
            }}
          />
        );
      })}

      {/* Origin and destination markers with demo-style icons */}
      {corridors.map((corridor) => {
        const color =
          corridor.riskLevel === 'safe'
            ? '#22c55e'
            : corridor.riskLevel === 'at-risk'
            ? '#eab308'
            : '#ef4444';

        const riskIconUrl = corridor.riskLevel === 'safe'
          ? 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png'
          : corridor.riskLevel === 'at-risk'
          ? 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png'
          : 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png';

        const markerIcon = {
          url: riskIconUrl,
          scaledSize: new google.maps.Size(36, 36),
        } as google.maps.Icon;

        const destIcon = {
          url: 'https://maps.gstatic.com/mapfiles/ms2/micons/man.png',
          scaledSize: new google.maps.Size(36, 36),
        } as google.maps.Icon;

        return (
          <>
            <Marker
              key={`start-${corridor.id}`}
              position={{ lat: corridor.coordinates[1], lng: corridor.coordinates[0] }}
              icon={markerIcon}
              onClick={() => handleMarkerClick(corridor.id)}
            >
            {selectedMarker === corridor.id && (
              <InfoWindow onCloseClick={handleInfoWindowClose}>
                <div style={{ padding: '8px', minWidth: '200px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                    {corridor.name}
                  </h3>
                  <p style={{ margin: '4px 0', fontSize: '14px' }}>
                    Score: <strong>{corridor.score}</strong>
                  </p>
                  <p
                    style={{
                      margin: '4px 0',
                      color: color,
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    {corridor.riskLevel === 'safe'
                      ? '✓ Safe'
                      : corridor.riskLevel === 'at-risk'
                      ? '⚠ At Risk'
                      : '✗ Failing'}
                  </p>
                  <button
                    onClick={() => handleViewDetails(corridor.id)}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      backgroundColor: color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    View Details
                  </button>
                </div>
              </InfoWindow>
            )}
            </Marker>
            <Marker
              key={`end-${corridor.id}`}
              position={{ lat: corridor.routeEndCoordinates[1], lng: corridor.routeEndCoordinates[0] }}
              icon={destIcon}
            />
          </>
        );
      })}
    </GoogleMap>
  );
};

export default CorridorMap;
