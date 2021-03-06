import './style.css';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-easyprint';
import * as turf from '@turf/turf'

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,

});

const geojson1 = {
  "type": "Feature",
  "properties": {
    "stroke": "#555555",
    "stroke-width": 2,
    "stroke-opacity": 1,
    "fill": "#ff2600",
    "fill-opacity": 0.5
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          139.78074789047238,
          35.67279423641376
        ],
        [
          139.79008197784424,
          35.67279423641376
        ],
        [
          139.79008197784424,
          35.674171302420035
        ],
        [
          139.78074789047238,
          35.674171302420035
        ],
        [
          139.78074789047238,
          35.67279423641376
        ]
      ]
    ]
  }

}

const geojson2 = {

  "type": "Feature",
  "properties": {
    "stroke": "#555555",
    "stroke-width": 2,
    "stroke-opacity": 1,
    "fill": "#ff2600",
    "fill-opacity": 0.5
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          139.7877860069275,
          35.67279423641376
        ],
        [
          139.79008197784424,
          35.67279423641376
        ],
        [
          139.79008197784424,
          35.67947017023017
        ],
        [
          139.7877860069275,
          35.67947017023017
        ],
        [
          139.7877860069275,
          35.67279423641376
        ]
      ]
    ]
  }
}

const init = () => {

  const map = L.map("map", L.extend({
    zoom: 15,
    center: [35.6707, 139.7852],
    renderer: L.canvas()
  }));

  const layers = L.control.layers({
    'OpenStreetMap': L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
    }).addTo(map),
    '航空写真': L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", {
      attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
    }),
    '標準地図': L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
      attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
    }),
    '淡色地図': L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", {
      attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
    }),
    '色別標高図': L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png", {
      attribution: "<a href='http://maps.gsi.go.jp/development/ichiran.html'>地理院タイル</a>"
    })
  }).addTo(map);

  L.control.scale({
    imperial: false,
    metric: true
  }).addTo(map);

  const drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  const drawControl = new L.Control.Draw({
    edit: {
      featureGroup: drawnItems
    }
  });
  map.addControl(drawControl);
  map.on(L.Draw.Event.CREATED, event => {
    const layer = event.layer;
    drawnItems.addLayer(layer);
  });

  const printer = L.easyPrint({
    sizeModes: ['Current', 'A4Landscape', 'A4Portrait'],
    filename: 'demoPrint',
    exportOnly: true,
    hideControlContainer: false
  }).addTo(map);

  const manualPrint = () => {
    printer.printMap('CurrentSize', 'demoPrint')
  }

  L.geoJSON(geojson1).addTo(map);
  L.geoJSON(geojson2).addTo(map);

  const intersection = turf.intersect(geojson1, geojson2);
  const p = turf.polygon(intersection.geometry.coordinates);
  const center = turf.centerOfMass(p);

  L.geoJSON(center).addTo(map);

  const point1 = turf.point(intersection.geometry.coordinates[ 0 ][ 0 ]);
  const point2 = turf.point(center.geometry.coordinates);

  const bearing = turf.bearing(point1, point2);

  console.log(bearing)
  const distance = 1;
  const destination = turf.destination(point1, distance, bearing);
  L.geoJSON(destination).addTo(map);


  const line = turf.lineString([
    intersection.geometry.coordinates[ 0 ][ 0 ],
    destination.geometry.coordinates,
  ]);

  const radius = 0.05;
  const options = { steps: 4, units: 'kilometers', properties: { foo: 'bar' } };
  const circle = turf.circle(center, radius, options);
  console.log(center)
  console.log(circle);

  L.circle([35.6707, 139.7852], {
    radius: 500,
    color: 'red',
    weight: 5,
    fillColor: 'blue',
    fillOpacity: 0.4
  }).addTo(map);

  L.geoJSON(line).addTo(map);

  L.geoJSON(circle).addTo(map);


};

if(document.readyState !== 'loading') {
  setTimeout(() => init(), 100);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(() => init(), 100));
}