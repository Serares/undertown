function BuildLeafletMap(lat, lng, mapId) {
    this.mapId = mapId;
    this.lat = +lat;
    this.lng = +lng;
    this.zoomLevel = 15;
    this.mapElement;
    this.initMap();
    this.marker;
}

BuildLeafletMap.prototype.initMap = function () {
    try {
        this.mapElement = L.map(this.mapId).setView([this.lat, this.lng], this.zoomLevel);
        this.addTileLayer();
        this.setMarker();
    } catch (err) {
        this.handleError(err);
    }
}

BuildLeafletMap.prototype.addTileLayer = function () {
    L.tileLayer('https://api.mapbox.com/styles/v1/empten/ck9qwupj76bgi1ipde38gjsmg/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZW1wdGVuIiwiYSI6ImNrOXF3eWh0azBvbXkzbHFjMWNoY2x1NzIifQ.xolL5C6kDqZvZzRFoCmdMg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZW1wdGVuIiwiYSI6ImNrOXF3eWh0azBvbXkzbHFjMWNoY2x1NzIifQ.xolL5C6kDqZvZzRFoCmdMg'
    }).addTo(this.mapElement);
}

BuildLeafletMap.prototype.handleError = function (err) {
    console.log("No map in here", err);
}

BuildLeafletMap.prototype.setMarker = function () {
    this.marker = L.marker([this.lat, this.lng]).addTo(this.mapElement);
}

//leaflet map js
var lngLatElement = document.querySelector('input[name="lngLat"]').value;
let lngLat = lngLatElement.split(",");
var mapId = "mapid";
var leaflet_map = new BuildLeafletMap(lngLat[1], lngLat[0], mapId);