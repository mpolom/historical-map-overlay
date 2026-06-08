

import { Map, TileLayer, Marker } from 'leaflet';
import { GPX } from 'leaflet-gpx';

const map = new Map('map');
    new TileLayer('https://api.maptiler.com/tiles/uk-osgb10k1888/{z}/{x}/{y}.jpg?key=BnDgv89mXDjK9jv4TIw9', {
    attribution: '&copy; MapTiler',
    maxZoom: 17,
    }).addTo(map);

    // URL to your GPX file or the GPX itself as a XML string.
    const url1 = 'route.gpx';
    const url2 = 'route2.gpx';
    const url3 = 'route3.gpx';
    const url4 = 'route4.gpx';
    const options = {
    async: true,
    polyline_options: { color: 'green' },
};

new Marker([51.45994857367072, -0.16281375795570904], {title:'The home of Edward Thomas'}).addTo(map);

new GPX(url1, options).on('loaded', (e) => {
    map.fitBounds(e.target.getBounds());
}).addTo(map);
new GPX(url2, options).on('loaded', (e) => {
    map.fitBounds(e.target.getBounds());
}).addTo(map);
new GPX(url3, options).on('loaded', (e) => {
    map.fitBounds(e.target.getBounds());
}).addTo(map);
new GPX(url4, options).on('loaded', (e) => {
    map.fitBounds(e.target.getBounds());
}).addTo(map);