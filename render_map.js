// First, create an object containing LatLng and population for each city.
var dataFileNames = ["2014_unofficial_crimes.json", "2015_unofficial_crimes(1).json", "all_unofficial_crimes.json"]
var dataLocationRoot = "https://raw.githubusercontent.com/adinger/Unofficial-Trackr/master/data/";


var json2014, json2015, jsonAll;
var locmap2014, locmap2015, locmapAll;
var map2014, map2015, mapAll;
var circles2014 = [];
var circles2015 = [];
var circlesAll = [];

var slider = 0;
var endTime;

var year;
var averageAge;
var mapCenterCoords = {lat: 40.110588, lng: -88.2355};

//var placesService = initializePlacesService();
// create the map
function initMap() {
	console.log('initMap()');

	// retrieve all the data from a public location (github)
	$.when(
		$.getJSON(dataLocationRoot + dataFileNames[0]),
		$.getJSON(dataLocationRoot + dataFileNames[1]),
		$.getJSON(dataLocationRoot + dataFileNames[1])
	).done(function (data2014, data2015, data2016) {
		json2014 = JSON.parse(data2014[2].responseText);
		json2015 = JSON.parse(data2015[2].responseText);
		jsonAll = JSON.parse(data2016[2].responseText);

		locmap2014 = createCrimesArray(json2014, 0, 0);
		locmap2015 = createCrimesArray(json2015, 0, 0);
		locmapAll = createCrimesArray(json2015, 0, 0);


		(json2014.crimes).sort(function(a,b){return a['time']-b['time']});
		(json2015.crimes).sort(function(a,b){return a['time']-b['time']});
		(jsonAll.crimes).sort(function(a,b){return a['time']-b['time']});

	

		// map's initial configuration
		console.log("Initializing maps");
		
		map2014 = new google.maps.Map(document.getElementById('map2014'),  {
			zoom: 15,
			center: mapCenterCoords,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});
		map2014.setOptions({styles: styles});

		map2015 = new google.maps.Map(document.getElementById('map2015'),  {
			zoom: 15,
			center: mapCenterCoords,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});
		map2015.setOptions({styles: styles});

		mapAll = new google.maps.Map(document.getElementById('mapAll'),  {
			zoom: 15,
			center: mapCenterCoords,
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});
		mapAll.setOptions({styles: styles});

		console.log("Done initializing maps");

		initializePlacesService(map2014);	// inside bars.js
		initializePlacesService(map2015);	// inside bars.js
		initializePlacesService(mapAll);
	});
	
}	 // end initMap()


