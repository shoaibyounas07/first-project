// URL for the WMS service
var wmsUrl = 'http://ows.mundialis.de/services/service?';

// Options for the map, such as center coordinates and zoom level
var mapOptions = {
    center: [31.45818, 73.70693], // Coordinates for the map center (latitude, longitude)
    zoom: 5 // Initial zoom level
};

// Create the map and assign it to the 'map' div with the specified options
var map = L.map('map', mapOptions);

// Basemap layers
var basemaps = {
   
    // OSM from WMS
    // 'OSM': L.tileLayer.wms(wmsUrl, {
    //     layers: 'OSM-WMS',
    //     format: 'image/png',
    //     transparent: true,
    //     attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA'
    // }),
    
    // // Topographic from WMS
    // 'Topographic (WMS)': L.tileLayer.wms(wmsUrl, {
    //     layers: 'TOPO-WMS',
    //     format: 'image/png',
    //     transparent: true,
    //     attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA'
    // }),
    


    // OSM from Leaflet
    'OSM': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }),

    // Topographic from Leaflet
    'Topographic': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
    })
};
// Add scalebar
L.control.scale({ position: 'bottomright', maxWidth: 200 }).addTo(map);

// Add layer control to switch between basemaps
L.control.layers(basemaps, null, {
    //  position: 'bottomright'
     }).addTo(map);


// Add a default basemap to the map
basemaps['OSM'].addTo(map);


// add mapclick function when you click on map show lat lng

// Function to handle map click events
function onMapClick(e) {
    var latlng = e.latlng;

    // Create a popup at the clicked location
    var popup = L.popup()
        .setLatLng(latlng)
        .setContent('You click at'+ '  Latitude: ' + latlng.lat.toFixed(5) + '<br>Longitude: ' + latlng.lng.toFixed(5))
        .openOn(map);

    // Optionally, add a circle layer at the clicked location
    // var newLayer = L.circle(latlng, {
    //     color: 'red',
    //     fillColor: '#f03',
    //     fillOpacity: 0.5,
    //     radius: 50
    // }).addTo(map);

    // console.log('A new layer has been added at:', latlng);
}

// Register the click event on the map
// map.on('click', onMapClick);

// add geosearch script

const search = new GeoSearch.GeoSearchControl({
    provider: new GeoSearch.OpenStreetMapProvider(),
  });
  
  map.addControl(search);
  
// When location is found, show it on the map

L.control.locate().addTo(map);


 // leaflet draw 
 var drawnFeatures = new L.FeatureGroup();
 map.addLayer(drawnFeatures);

 var drawControl = new L.Control.Draw({
    //  position: "topright",
     edit: {
         featureGroup: drawnFeatures,
         remove: true
     },
     draw: {
         polygon: {
          shapeOptions: {
           color: 'purple'
          },
         //  allowIntersection: false,
         //  drawError: {
         //   color: 'orange',
         //   timeout: 1000
         //  },
         },
         polyline: {
          shapeOptions: {
           color: 'red'
          },
         },
         rect: {
          shapeOptions: {
           color: 'green'
          },
         },
         circle: {
          shapeOptions: {
           color: 'steelblue'
          },
         },
        },

 });
 map.addControl(drawControl);

 map.on("draw:created", function(e){
     var type = e.layerType;
     var layer = e.layer;
     console.log(layer.toGeoJSON())

     layer.bindPopup(`<p>${JSON.stringify(layer.toGeoJSON())}</p>`)
     drawnFeatures.addLayer(layer);
 });

 map.on("draw:edited", function(e){
     var layers = e.layers;
     var type = e.layerType;

     layers.eachLayer(function(layer){
         console.log(layer)
     })
     
 });

// Function to run the routing code
function runRouting() {
    console.log('Button clicked, running routing...');
    var control = L.Routing.control(L.extend(window.lrmConfig || {}, {
        // waypoints: [
        //     L.latLng(31.45505, 73.70556),
        //     L.latLng(31.49099, 74.30273)
        // ],
        geocoder: L.Control.Geocoder.nominatim(),
        routeWhileDragging: true,
        reverseWaypoints: true,
        showAlternatives: true,
        altLineOptions: {
            styles: [
                {color: 'black', opacity: 0.15, weight: 9},
                {color: 'white', opacity: 0.8, weight: 6},
                {color: 'blue', opacity: 0.5, weight: 2}
            ]
        }
    })).addTo(map);

    // Add error control to handle routing errors
    L.Routing.errorControl(control).addTo(map);
}

// Add event listener to the button
document.getElementById('routingButton').addEventListener('click', runRouting);

  // Add GeoJSON layer to the map
  L.geoJSON(PakDitricts, {
    style: function (feature) {
     
    },
    onEachFeature: function (feature, layer) {
      // Optional: Add popup for each feature
      layer.bindPopup('District: ' + feature.properties.name_2);
    }
  }).addTo(map);

