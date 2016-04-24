var placesService;
var barInfoWindow;
var barMarkers = [];	// list of bar markers

// Initializes the Maps Places Service to find all bars near UIUC. 
// Call this in initMap(): global var placesService = initializePlacesService();
function initializePlacesService() {
	console.log('Initializing Maps Places service');
	var placesService = new google.maps.places.PlacesService(map);
	var uiucCoordinates = {lat: 40.1081958, lng: -88.2297984};

	// initialize popup for when someone clicks on a bar's marker
	barInfoWindow = new google.maps.InfoWindow();


	// search for bars within 1000 coordinate units of UIUC
	placesService.nearbySearch({
		location: uiucCoordinates,
		radius: 1000,
		type: ['bar']
	}, placesServiceCallback);

	return placesService;
}

// creates all the bar markers when the Places service responds
function placesServiceCallback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var barMarker = createBarMarker(results[i]);
			barMarkers.push(barMarker);
		}

		setAllCirclesRadii();
	}
}

// creates a marker for a place and returns a Marker object
function createBarMarker(place) {
	// todo: custom wine glass marker
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		barInfoWindow.setContent(place.name);
		barInfoWindow.open(map, this);
	});
	return marker;
}

// Sets the radius of every circle in circles array (defined in render_map.js)
// based on number of bars that are within a certain search radius
function setAllCirclesRadii() {
	for (var c = 0; c < circles.length; c++) {
		var crimeCoords = circles[c].position;
		var searchRadius = 5;
		var numBars = getNearbyBarsCount(crimeCoords, searchRadius);
		console.log(numBars)
	}
}

/* 
params: 
	location: the location for which you want to find nearby bars.
				this is a LatLng object: {'lat': 123, 'lng': 456}
	searchRadius: radius in meters of surrounding circle to search for bars 

return: 
	number of bars within x meters of a location
*/ 
function getNearbyBarsCount(location, searchRadius) {
		var cLat = location.lat;
		var cLng = location.lng;

		var totalBars = 0;
		// go through all bars and add up the ones in this circle's vicinity
		for (var b = 0; b < barMarkers.length; b++) {
			var bLat = barMarkers[b].position.lat;
			var bLng = barMarkers[b].position.lng;
			var barCrimeDistance = Math.sqrt(Math.pow(bLat-cLat,2)+Math.pow(bLng-cLng,2))

			if (barCrimeDistance <= searchRadius) {
				totalBars++;
			}
		}

		return totalBars;
}


/*
https://developers.google.com/maps/documentation/javascript/examples/place-search
http://stackoverflow.com/questions/18364715/google-maps-api-radius-search-for-markers-using-places
*/

