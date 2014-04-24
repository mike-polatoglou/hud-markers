/*
 * Hud markers - javascript plugin displaying google maps markers outside the viewport
 * Revision: 1.00 - 24/04/2014
 * Distributed under GPLv2 Licence
 */

var map, bounds, markers = new Array(), temp_markers = new Array();

function initialize_hud_markers(output) {
	
	var mapOptions = {
		zoom: 16,
		center: new google.maps.LatLng(51.508515, -0.125487)
	}
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	var image = {
	    size: new google.maps.Size(30, 30),
	    origin: new google.maps.Point(0,0),
	    anchor: new google.maps.Point(15, 15)
	}

	for (var i in output) {
		

		var lat_lng = new google.maps.LatLng(parseFloat(output[i][0]), parseFloat(output[i][1]));

		markers[i] = new google.maps.Marker({
			position: lat_lng,
			map: map,
			icon: {
				url: output[i][3],
				size: new google.maps.Size(32, 37),
			    origin: new google.maps.Point(0,0),
			    anchor: new google.maps.Point(16, 37)
			}
		});
		temp_markers[i] = new google.maps.Marker({
			position: lat_lng,
			map: map,
			icon: image,
			title: output[i][2]
		});

		var thisMarker = temp_markers[i];

		google.maps.event.addListener(temp_markers[i], 'click', function(i) {
			console.log(this);
			var new_center = markers[temp_markers.indexOf(this)].getPosition()	
			map.panTo(new google.maps.LatLng(new_center.lat() , new_center.lng() ));
		});
		thisMarker.setVisible(false);
		thisMarker.hidden = true;
	}
	
	google.maps.event.addListener(map, 'center_changed', end_movement);
	
}

function check_line_intersection(line_1_start_x, line_1_start_y, line_1_end_x, line_1_end_y, line_2_start_x, line_2_start_y, line_2_end_x, line_2_end_y) {
	// if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
	var denominator, a, b, numerator1, numerator2, result = {
		x: null,
		y: null
	};
	denominator = ((line_2_end_y - line_2_start_y) * (line_1_end_x - line_1_start_x)) - ((line_2_end_x - line_2_start_x) * (line_1_end_y - line_1_start_y));
	if (denominator == 0) {
		return result;
	}
	a = line_1_start_y - line_2_start_y;
	b = line_1_start_x - line_2_start_x;
	numerator1 = ((line_2_end_x - line_2_start_x) * a) - ((line_2_end_y - line_2_start_y) * b);
	numerator2 = ((line_1_end_x - line_1_start_x) * a) - ((line_1_end_y - line_1_start_y) * b);
	a = numerator1 / denominator;
	b = numerator2 / denominator;

	// if we cast these lines infinitely in both directions, they intersect here:
	result.x = line_1_start_x + (a * (line_1_end_x - line_1_start_x));
	result.y = line_1_start_y + (a * (line_1_end_y - line_1_start_y));
	
	// if line1 is a segment and line2 is infinite, they intersect if:
	if (a > 0 && a < 1 && b > 0 && b < 1) {
		return result;
	} else {
		return false;
	}
	
}



function end_movement() {

	bounds = map.getBounds();
	var south_west = bounds.getSouthWest(); 
	var north_east = bounds.getNorthEast(); 
	var center = map.getCenter();
	var center_lat = center.lat(), center_lng = center.lng();
	var south_west_lat = south_west.lat(), south_west_lng = south_west.lng(), north_east_lat = north_east.lat(), north_east_lng = north_east.lng()

	for (var i = 0; i < markers.length; ++i) {
			
		var marker = markers[i], temp_marker = temp_markers[i];

		if(!map.getBounds().contains(marker.getPosition())) {
			
			var position = marker.getPosition();
			var marker_lat = position.lat(), marker_lng = position.lng();

			// top line
			result = check_line_intersection(
				center_lat, 
				center_lng, 
				marker_lat, 
				marker_lng, 
				north_east_lat, 
				south_west_lng, 
				north_east_lat, 
				north_east_lng
				);
			
			if(result != false) {
				temp_marker.setPosition(new google.maps.LatLng(result.x, result.y));
				temp_marker.setIcon({ 
					url: 'img/north.png',
					size: new google.maps.Size(30, 30),
				    origin: new google.maps.Point(0,0),
				    anchor: new google.maps.Point(15, 15)
				});
				if(temp_marker.hidden) { temp_marker.hidden = false; temp_marker.setVisible(true); }
				continue;
			}
			// right line
			result = check_line_intersection(
				center_lat, 
				center_lng, 
				marker_lat, 
				marker_lng, 
				south_west_lat, 
				north_east_lng,
				north_east_lat, 
				north_east_lng
				);
			
			if(result != false) {
				temp_marker.setPosition(new google.maps.LatLng(result.x, result.y));
				temp_marker.setIcon({ 
					url: 'img/east.png',
					size: new google.maps.Size(30, 30),
				    origin: new google.maps.Point(0,0),
				    anchor: new google.maps.Point(15, 15)
				});
				if(temp_marker.hidden) { temp_marker.hidden = false; temp_marker.setVisible(true); }
				continue;
			}
			// bottom line
			result = check_line_intersection(
				center_lat, 
				center_lng,  
				marker_lat, 
				marker_lng, 
				south_west_lat, 
				south_west_lng, 
				south_west_lat, 
				north_east_lng
				);
			
			if(result != false) {
				temp_marker.setPosition(new google.maps.LatLng(result.x, result.y));
				temp_marker.setIcon({ 
					url: 'img/south.png',
					size: new google.maps.Size(30, 30),
				    origin: new google.maps.Point(05,0),
				    anchor: new google.maps.Point(15, 30)
				});
				if(temp_marker.hidden) { temp_marker.hidden = false; temp_marker.setVisible(true); }
				continue;
			}
			// left line
			result = check_line_intersection(
				center_lat, 
				center_lng, 
				marker_lat, 
				marker_lng, 
				south_west_lat, 
				south_west_lng,
				north_east_lat, 
				south_west_lng
				);
			
			if(result != false) {
				temp_marker.setPosition(new google.maps.LatLng(result.x, result.y));
				temp_marker.setIcon({ 
					url: 'img/west.png',
					size: new google.maps.Size(30, 30),
				    origin: new google.maps.Point(0,0),
				    anchor: new google.maps.Point(15, 15)
				});
				if(temp_marker.hidden) { temp_marker.hidden = false; temp_marker.setVisible(true); }
				continue;
			}


		} else {
			if(!temp_marker.hidden) { temp_marker.hidden = true; temp_marker.setVisible(false); }
		}
	}
}