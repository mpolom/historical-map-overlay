import { Map, TileLayer, Marker, LatLngBounds, Control, Icon } from 'leaflet';
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
// Initialize the map and add the historical map layer
const map = new Map('map');
histMap.addTo(map);

// Custom icon for the marker at the home of Edward Thomas, and add it to the map
const MapIcon = new Icon({
    iconUrl: './house-solid.svg',
    iconSize: [18, 18],
    iconAnchor: [18, 18]
});
new Marker([51.45994857367072, -0.16281375795570904], {title:'The home of Edward Thomas', icon: MapIcon}).addTo(map);

// Load GPX files and fit the map to their bounds

// URL to your GPX file or the GPX itself as a XML string.
const gpxUrls = [
    './gpx/route.gpx',
    './gpx/route2.gpx',
    './gpx/route3.gpx',
    './gpx/route4.gpx'
];

// GPX options
const options = {
    async: true,
    polyline_options: { color: 'green' }
};

const allBounds = new LatLngBounds();
let loadedCount = 0;

gpxUrls.forEach((url) => {
    new GPX(url, options).on('loaded', (e) => {
        allBounds.extend(e.target.getBounds());
        loadedCount += 1;

        if (loadedCount === gpxUrls.length) {
            map.fitBounds(allBounds);
        }
    }).addTo(map);
});

// Add layer control to switch between base layers
const baseLayers = {
    "OSM": osmMap,
    "Historical": histMap
}
new Control.Layers(baseLayers).addTo(map);