import './style.css';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-easyprint';

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,

});

const init = () => {

  const map = L.map("map", L.extend({
    zoom: 15,
    center: [ 35.6707, 139.7852 ],
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
  map.on(L.Draw.Event.CREATED, function(event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);
  });

  const printer = L.easyPrint({
    sizeModes: [ 'Current', 'A4Landscape', 'A4Portrait' ],
    filename: 'demoPrint',
    exportOnly: true,
    hideControlContainer: false
  }).addTo(map);

  const manualPrint = () => {
    printer.printMap('CurrentSize', 'demoPrint')
  }
};

if(document.readyState !== 'loading') {
  setTimeout(() => init(), 100);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(() => init(), 100));
}