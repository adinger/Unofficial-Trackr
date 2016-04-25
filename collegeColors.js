function getColoredCircle(school, place) {
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
	return getCircle(place, color);
}