Hud markers
===========

Game minimap style google maps where if marker is outside the viewport it shows an arrow
![Hud markers](http://mikepolatoglou.com/screenshot.jpg)

What it does
------------
The script finds all the markers that are out view from the google maps viewport and shows arrows on the edge of the map pointing to the direction of the markers.

To use it you need to include the script and pass the array of markers to the initialization function:


	var output = [[51.508515, -0.125487, 'train station', 'img/airport.png'],
				[51.528515, -0.127487, 'underground', 'img/apartment.png'],
				[51.498515, -0.122487, 'property', 'img/helicopter.png'],
				[51.518515, -0.120487, 'bus stop', 'img/office-building.png']];

			
			
			google.maps.event.addDomListener(window, 'load', initialize_hud_markers(output));
			

Requires the google maps API js file:

	<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>

The markers array is formated as:

	marker[i] = [latitude (float), longitude (float), title (when hovering), marker image];

For a live demo: <http://mikepolatoglou.com/hud-markers>

Marker images taken from: <http://mapicons.nicolasmollet.com/>
