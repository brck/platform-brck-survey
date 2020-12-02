import React, { useState } from 'react';
import Map from 'react-js-google-maps';

function PostMap ({field, onChange, language}) {
  const mapOptions = {zoom: 10, center: { lat: -1.35, lng: 36.7 }};
  const [markers, setMarker] = useState([]);
  const initMap = (map, ref) => {
    setMapOnAll(map);
    map.addListener('click', async (e) => {
      let lat = e.latLng.lat();
      let lon = e.latLng.lng();
      const newMarker = new window.google.maps.Marker({
        position: e.latLng,
        map: map,
        ref: ref
      });
      setMarker([newMarker]);
      onChange(field.id, {lat, lon});
      return false;
    })
  };

  const setMapOnAll = (map) => {  
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      map.panTo(new window.google.maps.LatLng(markers[i].getPosition().lat(),markers[i].getPosition().lng()));
      map.setCenter(markers[i].getPosition());
    }
  }
  return (
    <div key={field.id} className="medium-12 columns">
        <label htmlFor={field.id}>
          <strong>{field.translations[language] && field.translations[language].label ? field.translations[language].label : field.label}</strong>
        </label>
        <em>
          <small>{field.translations[language] && field.translations[language].instructions ? field.translations[language].instructions : field.instructions} </small>
        </em>
        <div id={field.label} className="map">
            <Map
              id="map"
              apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              mapOptions={mapOptions}
              style={{ width: '100%', height: 480 }}
              onLoad={e => {initMap(e, field.id)}}
            />
        </div>
    </div>
  );
}
export default React.memo(PostMap);
