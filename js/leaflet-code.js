import { Map, TileLayer, Marker, Control, Icon, LayerGroup, FeatureGroup } from 'leaflet';
import { GPX } from 'leaflet-gpx';

// define tile layers for the map
const histMap = new TileLayer('https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=BnDgv89mXDjK9jv4TIw9', {
    attribution: '&copy; MapTiler',
    maxZoom: 17
});
const osmMap = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
});
// Base layers
const baseLayers = {
  "OSM": osmMap,
  "Historical": histMap
}

// Initialize the map, set a sensible default view and add the historical map layer
const map = new Map('map').setView([51.45994857367072, -0.16281375795570904], 13);
histMap.addTo(map);

// Custom icon for the marker at the home of Edward Thomas, and add it to the map
const MapIcon = new Icon({
    iconUrl: './house-solid.svg',
    iconSize: [18, 18],
    iconAnchor: [18, 18]
});
new Marker([51.45994857367072, -0.16281375795570904], {title:'The home of Edward Thomas', icon: MapIcon}).addTo(map);

// Load GPX files and fit the map to their bounds

fetch('./gpx-index.json')
  .then(res => res.json())
  .then(data => {

    const overlays = {};
    const allOverlays = new FeatureGroup();

    data.folders.forEach(folder => {
      const group = new LayerGroup();

      folder.files.forEach(file => {
        const gpx = new GPX(file, {
          async: true,
          polyline_options: {
            color: folder.color,
            weight: 3
          }
        });

        gpx.addTo(group);
      });

      overlays[folder.name] = group;
      group.addTo(map);
      allOverlays.addLayer(group);
    });

    // single combined layers control (base layers + overlays)
    new Control.Layers(baseLayers, overlays).addTo(map);

    // fit map to the bounds of all GPX tracks if available
    try {
      const bounds = allOverlays.getBounds();
      if (bounds && (typeof bounds.isValid !== 'function' || bounds.isValid())) {
        map.fitBounds(bounds);
      }
    } catch (e) {
      // ignore if bounds can't be computed yet
      console.warn('Could not compute bounds for GPX overlays', e);
    }
  });

// (Layer control has been added after GPX overlays are loaded)