import { useEffect, useRef } from "react";
import snazzyMapStyle from "../styles/mapStyle";
import { loadGoogleMaps } from "../loadGoogleMaps";

function ListingMap({ coordinates }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!coordinates || coordinates.length !== 2 || !mapRef.current) {
      return;
    }

    let cancelled = false;
    let mapInstance;

    async function initMap() {
      try {
        await loadGoogleMaps();

        const { Map, InfoWindow } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } =
          await google.maps.importLibrary("marker");

        if (cancelled || !mapRef.current) return;

        // Convert GeoJSON [longitude, latitude] to Google Maps coordinates
        const mapCenter = {
          lat: coordinates[1],
          lng: coordinates[0],
        };

        mapInstance = new Map(mapRef.current, {
          center: mapCenter,
          zoom: 12,
          styles: snazzyMapStyle,
        });

        const marker = new AdvancedMarkerElement({
          position: mapCenter,
          map: mapInstance,
          title: "Listing Location",
        });

        const popup = new InfoWindow({
          content: "<p>Exact location provided after booking</p>",
        });

        marker.addListener("click", () => {
          popup.open({ map: mapInstance, anchor: marker });
        });
      } catch (error) {
        console.error("Failed to initialize Google Map:", error);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstance) {
        // React will remove the map container when the component unmounts.
        mapInstance = null;
      }
    };
  }, [coordinates]);

  return <div id="map" ref={mapRef} />;
}

export default ListingMap;
