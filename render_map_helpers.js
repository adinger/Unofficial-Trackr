function bindInfoWindow(circle, map, infowindow) {	
	//console.log("bindInfoWindow()");
	circle.addListener('mouseover', function() {
		infowindow.open(map, this);
	});
	circle.addListener('mouseout', function() {
		infowindow.close(map, this);
	})
}

// click listener that is attached to the year buttons ('2014' and '2015')
function refresh(year, averageAge, isSlider, endTime) {
	var crimes;
	document.getElementById('name').innerHTML = averageAge;

	if (year == 'all') refresh_helper(mapAll, jsonAll, isSlider, endTime);
	else if (year == '2014') refresh_helper(map2014, json2014, isSlider, endTime);
	else if (year == '2015') refresh_helper(map2015, json2015, isSlider, endTime);
}

function refresh_helper(map, json, isSlider, endTime) {
	var crimes = createCrimesArray(json, isSlider, endTime);
	(json.crimes).sort(function(a,b){return a['time']-b['time']});
	dropMarkers(map, json, crimes);
}

function clearMarkers(map) {
	if (map === map2014) markers = circles2014;
	else if (map === map2015) markers = circles2015;
	else if (map === mapAll) markers = circlesAll;

	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];
}

// Takes users input and creates a new map.
function map_slider(time){
	//if (time > 5) {	// if time > 5 AM
		endTime = time*100;
		var isSlider = 1;
		refresh('2014', '19.3', isSlider, endTime);
		refresh('2015', '20.4', isSlider, endTime);
		refresh('all', '19.5', isSlider, endTime)
 	//}
}


// Creates 'crimes', an object mapping a crime to its coordinates and 
// number of crimes happening at that same location
function createCrimesArray(jsonObject, isSlider, endTime) {
	//console.log("createCrimesArray()");
	var crimes = {};

	for (var i = 0; i < jsonObject.crimes.length; i++) {
		if(isSlider === 1) {	// if slider has been moved => show times within time range
			jsonObject.crimes[i].time = Number(jsonObject.crimes[i].time);

			if(jsonObject.crimes[i].time <= endTime) {
				var latitude = jsonObject.crimes[i].location.lat;
				var longitude = jsonObject.crimes[i].location.lng;

				// add the object for this crime location
				crimes['crime' + i] = { 'center': { 'lat': latitude, 'lng': longitude }};	
				crimes['crime' + i]['school'] = jsonObject.crimes[i].school;
			}
		}
		else {	// slider has not been moved => show all crimes
			//console.log("creating crime");
			jsonObject.crimes[i].time = Number(jsonObject.crimes[i].time);

			var latitude = jsonObject.crimes[i].location.lat;
			var longitude = jsonObject.crimes[i].location.lng;

			// add the object for this crime location
			crimes['crime' + i] = { 'center': { 'lat': latitude, 'lng': longitude }};	
			crimes['crime' + i]['school'] = jsonObject.crimes[i].school;

		}	
	}
	console.log("CRIMES ARRAY:\n"+crimes);
	return crimes;
}


// creates and returns the circle object
function getCircle(school, latLng, map) {
	console.log("getCircle(): school: "+school);
	var schoolColors = {
		'UIUC':'#DC143C',
		'Illinois, Univ of':'#DC143C',
		'Illinois State Univ':'#0000ff',
		'Loyola':'#00ff00',
		'Chicago':'#ffa500',
		'Parkland College':'#663300',
		'Champaign':'#00e5ee'
	}

	var color = schoolColors[school];

	// calculate circle's radius based on # of nearby bars
	var scalingFactor = 0.3;

	var circle = {
		path: google.maps.SymbolPath.CIRCLE,
		strokeColor: '#FFA07A',
		strokeOpacity: 0,
		strokeWeight: 2,
		fillColor: color,
		fillOpacity: 0.35,
		scale: scalingFactor*getCircleRadius(latLng.center) // bars.js
	};

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(latLng.center),
		map: map,	// MAP IS SET HERE
		icon: circle
	});

	return marker;
}

///////////////////////////// functions for animation ///////////////////////////////////

// listener for "animate" button
function dropMarkers(map, json, crimes) {
	clearMarkers(map);
	console.log("dropping markers");
	var i=0;
	for (var place in crimes){
		var contentString = "Charge: " + json.crimes[i]['charge'] + "<br>" + 
						"Time: " + json.crimes[i]['time'] + "<br>" + 
						"School/city person is from: " + json.crimes[i]['school'];
		//console.log(crimes[place]['center']);

		var school = json.crimes[i]['school'];
		addMarkerWithTimeout(map, crimes[place], contentString, school, json.crimes[i]['time'], i * 200);

		i++;
	}
}

// helper for above function
function addMarkerWithTimeout(map, latLng, contentString, school, time1, timeout) {
	window.setTimeout(function() {
		//console.log('test');
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		var time = time1.toString();
		var sliceLocation = time.length-2;
		document.getElementById('time').textContent = time.slice(0,sliceLocation)+":"+time.slice(sliceLocation,time.length);
		var circle = getCircle(school, latLng, map);

		if (map === map2014) circles2014.push(circle);
		else if (map === map2015) circles2015.push(circle);
		else if (map === mapAll) circlesAll.push(circle);

		bindInfoWindow(circle, map, infowindow);	// fix map

	}, timeout);
}