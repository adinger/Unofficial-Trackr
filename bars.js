var placesService;
var barInfoWindow;

// initializes the Maps Places Service to find bars. 
// Call this in initMap(): global var placesService = initializePlacesService();
function initializePlacesService() {
	console.log('initializePlacesService()');
	var placesService = new google.maps.places.PlacesService(map);
	var champaign = {lat: 40.1081958, lng: -88.2297984};
	barInfoWindow = new google.maps.InfoWindow();

	placesService.nearbySearch({
		location: champaign,
		radius: 1000,
		type: ['bar']
	}, placesServiceCallback);
	
	return placesService;
}

// creates all the bar markers when the Places service responds
function placesServiceCallback(results, status) {
	var barMarkers = [];
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var barMarker = createBarMarker(results[i]);
			barMarkers.push(barMarker);
		}
	}
	return barMarkers;
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

/* 
params: 
	location: e.g. {'lat': 123, 'lng': 456}
	scope: radius in miles of surrounding circle to search for bars 

return: 
	int for # of bars	
*/ 
function getNearbyBarsCount(latlng, scope) {

}

function getChampaignBarsMarkers(latlng, scope) {

}


// TODO: get all bars in champaign 


/*
https://developers.google.com/maps/documentation/javascript/examples/place-search
http://stackoverflow.com/questions/18364715/google-maps-api-radius-search-for-markers-using-places
*/