// First, create an object containing LatLng and population for each city.
var dataFileNames = ["2014_unofficial_crimes.json", "2015_unofficial_crimes(1).json", "Unofficial2016.json"]
var dataLocationRoot = "https://raw.githubusercontent.com/adinger/Unofficial-Trackr/master/";
var json1, json2, json3;
var locmap = {};
var map;
var circles = [];
var obj;

//var placesService = initializePlacesService();
// create the map
function initMap() {
	console.log('initMap()');

	// retrieve all the data from a public location (github)
	$.when(
		$.getJSON(dataLocationRoot + dataFileNames[0]),
		$.getJSON(dataLocationRoot + dataFileNames[1]),
		$.getJSON(dataLocationRoot + dataFileNames[2])

	).done(function (data2014, data2015, data2016) {
		json1 = JSON.parse(data2014[2].responseText);
		json2 = JSON.parse(data2015[2].responseText);
		json3 = JSON.parse(data2016[2].responseText);

		obj = json1;
		//console.log(obj);

		locmap = createCrimeLocationObject(obj);

		(obj.crimes).sort(function(a,b){return a['time']-b['time']});	// how does this sort work???
	});

	// map's initial configuration
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: {lat: 40.110588, lng: -88.20727},
		mapTypeId: google.maps.MapTypeId.TERRAIN
	});
	addMarkersToMap();
	var placesService = initializePlacesService();
	map.setOptions({styles: styles});
}	 // end initMap()

function addMarkersToMap() {
	// Construct the circle for each value in citymap.
	// Note: We scale the area of the circle based on the population.
	var i=0;
	
	for (var place in locmap) {
		var contentString = "Charge: " + obj.crimes[i]['charge'] + "<br>" + 
							"Time: " + obj.crimes[i]['time'] + "<br>" + 
							"School/city person is from: " + obj.crimes[i]['school/city'];
		i++;

		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		// Add the circle for this city to the map.
		var size = locmap[place].number;
		var circle = getCircle(locmap[place], size, '#DC143C')

		circles.push(circle);
		bindInfoWindow(circle, map, infowindow);
	}
}

var previousInfoWindow;
function bindInfoWindow(circle, map, infowindow) {	
	circle.addListener('click', function() {
		if(previousInfoWindow){
			previousInfoWindow.close();
		}

		infowindow.open(map, this);		
		previousInfoWindow = infowindow;

	});
}

// ???
function addMarkerWithTimeout(position, contentString,timeout) {
	window.setTimeout(function() {
		//console.log('test');
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});

		var size = locmap[place].number;
		var local_circle = getCircle(locmap[place], size, '#DC143C');

		circles.push(local_circle);
		bindInfoWindow(local_circle, map, infowindow);

	}, timeout);
}

function clearMarkers() {
	for (var i = 0; i < circles.length; i++) {
		circles[i].setMap(null);
	}
	circles = [];
}

// ???
function drop() {
	clearMarkers();
	var i=0;
	for (place in locmap){
	var contentString = "Charge: " + obj.crimes[i]['charge'] + "<br>" + 
						"Time: " + obj.crimes[i]['time'] + "<br>" + 
						"School/city person is from: " + obj.crimes[i]['school/city'];
		//console.log(locmap[place]['center']);
		addMarkerWithTimeout(locmap[place]['center'],contentString, i * 200);
		i++;
	}
}

// click listener that is attached to the year buttons ('2014' and '2015')
function refresh(year, txt) {
	console.log(year);
	if (year=='2014'){
		//console.log('im in 2014')
		document.getElementById('name').innerHTML = txt;	// hardcodes average age
		obj = json1;
	}
	if (year=='2015'){
		//console.log('im in 2015')
		document.getElementById('name').innerHTML = txt;
		obj = json2;
	}

	refresh_helper();
	clearMarkers();
	addMarkersToMap();
}


function refresh_helper(){
	locmap = createCrimeLocationObject(obj);
	(obj.crimes).sort(function(a,b){return a['time']-b['time']});
}


// Creates 'locmap', an object mapping a crime to its coordinates and 
// number of crimes happening at that same location and time
function createCrimeLocationObject(jsonObject) {
	crimeLocations = {};
	//console.log(jsonObject);
	for (i = 0; i < jsonObject.crimes.length; i++){
		var size = 1;
		jsonObject.crimes[i].time = Number(jsonObject.crimes[i].time);

		var latitude = obj.crimes[i].location.lat;
		var longitude = obj.crimes[i].location.lng;

		// add the object for this crime location
		crimeLocations['crime' + i] = { 'center': { 'lat': latitude, 'lng': longitude }};

		// set number of crimes at this same location & time
		for (j = 0; i != j && j < jsonObject.crimes.length; j++){
			if (jsonObject.crimes[i].location == jsonObject.crimes[j].location && 
				jsonObject.crimes[i].time == jsonObject.crimes[j].time){
				size+=2;
			}
		}		
		crimeLocations['crime' + i]['number'] = size;	
	}
	//console.log(crimeLocations);
	return crimeLocations;
}

// creates and returns the circle object
function getCircle(place, size, fillColor) {
	// calculate circle's radius based on # of nearby bars
	var scalingFactor = 1;

	var circle = {
		path: google.maps.SymbolPath.CIRCLE,
		//position: locmap[place].center,
		strokeColor: '#FFA07A',
		strokeOpacity: 0,
		strokeWeight: 2,
		fillColor: fillColor,
		fillOpacity: 0.35,
		scale: scalingFactor*getCircleRadius(place.center)
	};

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(place.center),
		map: map,
		icon: circle
	});

	return marker;
}


