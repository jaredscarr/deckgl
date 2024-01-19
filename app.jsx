/* global window */
import React, {useEffect, useRef, useState, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import {GeoJsonLayer, ArcLayer} from 'deck.gl';
import {Wrapper, Status} from '@googlemaps/react-wrapper';
import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';


const NAT_PARKS = 'https://nationalparkservice.github.io/data/projects/network_to_freedom/public_sites.geojson';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAP_ID = process.env.GoogleMapsMapId; // eslint-disable-line

const renderMap = status => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

function MyMapComponent({center, zoom}) {
  const ref = useRef();
  const [map, setMap] = useState(null);
  const overlay = useMemo(
    () =>
      new DeckOverlay({
        layers: [
          new GeoJsonLayer({
            id: 'nat_parks',
            data: NAT_PARKS,
            // Styles
            filled: true,
            pointRadiusMinPixels: 2,
            pointRadiusScale: 2000,
            getPointRadius: f => 100 - f.properties.Score,
            getFillColor: [200, 0, 80, 180],
            // Interactive props
            pickable: true,
            autoHighlight: true,
            onClick: info =>
              info.object &&
              // eslint-disable-next-line
              alert(`${info.object.properties.Location_Name} (${info.object.properties.X}, ${info.object.properties.Y})`)
          }),
          new ArcLayer({
            id: 'arcs',
            data: NAT_PARKS,
            dataTransform: d => d.features.filter(f => f.properties.Score < 90), // show parks withs scores > 90
            // Styles
            getSourcePosition: f => [-75.596037, 39.951913], // Frederick Douglas
            getTargetPosition: f => f.geometry.coordinates,
            getSourceColor: [0, 128, 200],
            getTargetColor: [200, 0, 80],
            getWidth: 1
          })
        ]
      }),
    []
  );

  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
      overlay.setMap(map);
    }
  }, [map, center, zoom, overlay]);

  useEffect(() => {
    const mapInstance = new window.google.maps.Map(ref.current, {
      mapId: GOOGLE_MAP_ID
    });
    setMap(mapInstance);
  }, []);
  return (
    <>
      <div ref={ref} id="map" style={{height: '100vh', width: '100wh'}} />
    </>
  );
}

function Root() {
  // Center set to Washington, DC
  const center = {lat: 38.889805, lng: -77.009056};
  const zoom = 8;

  return (
    <>
      <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={renderMap}>
        <MyMapComponent center={center} zoom={zoom} />
      </Wrapper>
    </>
  );
}

/* global document */
const container = document.body.appendChild(document.createElement('div'));
createRoot(container).render(<Root />);
