$(function(){

	/* Here, we create variables that will instantiate the map. var api = google.maps sets the namespace for use later down the line. We'll be referencing it a lot */

	/*  This locally scoped copy will make the app run a little more efficiently*/

	/* All properties and methods used by the Google Maps API are namespaced */
	var api = google.maps,

	/* Now create an object literal with the configuration options */
		mapCenter = new api.LatLng(50.91710, -1.40419),
		mapOptions = {
			zoom: 13,
			center: mapCenter,
			mapTypeId: api.MapTypeId.ROADMAP,
			disableDefaultUI: true
		},

		/* Now we create a new map instance using the Map() constructor function */
		map = new api.Map(document.getElementById("map"), mapOptions),

		/* Now create a variable so we don't have to navigate the DOM each time we need to access it later*/
		ui = $("#ui"),

		/* Another Variable; this time to counts the clicks later on. We'll start at 0*/
		clicks = 0,

		/* Lastly, create an empty array literal that'll get populated later when we store ares of the map that have been clicked on. This needs to be at the top so that we can access ti from within different event handlers later on */
		positions = [];

/* Here, we add the custom marker to the map */

var homeMarker = new api.Marker({
		position: mapCenter,
		map: map,
		icon: "img/hq.png"
});

/* Extensive info on the next two chunks of code are on page 66 */

/* This var will tell the map about the new info window  - page 65*/

var infoWindow = new api.InfoWindow({
	content: document.getElementById("hqInfo")
});

/* This is a simple click handler that displays the info window. It gets passed the infoWindow variable we just created above - page 65*/

    google.maps.event.addListener(homeMarker, "click", function () {
        infoWindow.open(map, homeMarker);
    });

/* Now we'll add the event listeners. This first one  will be a function that is executed when the map is clicked. explanation on page 68*/

/* Here we're adding a function that's fired every time there's a click */

var addMarker = function(e) {

/* if the clicks are less than (or equal to) zero, we'll create a new marker using the Marker() constructor */

if (clicks <= 1){
	positions.push(e.latLng);

	var marker = new api.Marker({
			map: map,
			position: e.latLng,

	/* These ternary operators are checking to see if anything has been clicked before */
			flat: (clicks === 0) ? true : false,
			animation: api.Animation.DROP,
			title: (clicks === 0) ? "Start" : "End",
	/* this sets the green marker for the first click*/
			icon: (clicks === 0) ? "img/start.png" : "",
	/* set the markers so that we can drag them */
			draggable: true,
			id: (clicks === 0) ? "Start" : "End"
	});

	/* THIS CALL IS NOT IN THE BOOK OR THE PDF */

  api.event.addListener(marker, "dragend", markerDrag);

	api.event.trigger(map, "locationAdd", e);
/* if the clicks are larger than zero, remove the event listener */
	} else {
			api.event.removeListener(mapClick);
			return false;
	}
}

var mapClick = api.event.addListener(map, "click", addMarker);

/* We add the event handler for our custom locationAdd event in the same way that we
added our click events, using Google's addListener() method. Explanation on page 71*/

api.event.addListener(map, "locationAdd", function (e) {

	var journeyEl = ("#journey"),

	/* The next variable we set is then one of two things. If the jQuery object we set as the first
variable has length, we know the journey element exists on the page, so we just store a
reference to it. If it doesn't exist, we create a new element to use as the journey element and
set its id to journey. */
		outer = (journeyEl.length) ? journeyEl : $("<div>", {
			id: "journey"
		});

	new api.Geocoder().geocode({
			"latLng": e.latlng },
			function (results) {

				$("<h3 />", {
					text: (clicks === 0) ? "Start:" : "End:"
				}).appendTo(outer);

				$("<p />", {
					text: results[0].formatted_address,
					id: (clicks === 0) ? "StartPoint" : "EndPoint",
					"data-latLng" : e.latLng

				}).appendTo(outer);

		/* if the journey does not exist append it to the ui, if it does exist create the button and set it's properties and add it to journey */

				if (!journeyEl.length){
					outer.appendTo(ui);

				} else {
					$("<button/ >", {
							id: "getQuote",
							text: "Get quote"
					}).prop("disabled", true).appendTo(journeyEl);
				}
			clicks++;
	});
});

    //handle markers being dragged
    var markerDrag = function (e) {

        var elId = ["#", this.get("id"), "Point"].join("");

        //reverse geocode latlng to get address of place marker dragged to
        new api.Geocoder().geocode({ "latLng": e.latLng }, function (results) {
            $(elId).text(results[0].formatted_address);
        });
    };

    //enable button when weight entered
    $("#weight").on("keyup", function () {
        if (timeout) {
            clearTimeout(timeout);
        }

        var field = $(this),
            enableButton = function () {
                if (field.val()) {
                    $("#getQuote").prop("disabled", false);
                } else {
                    $("#getQuote").prop("disabled", true);
                }
            },
            timeout = setTimeout(enableButton, 250);
    });

    //compute distance and cost when button clicked
    $("body").on("click", "#getQuote", function (e) {
        e.preventDefault();

        $(this).remove();

        //get distance between points
        new api.DistanceMatrixService().getDistanceMatrix({
            origins: [$("#startPoint").attr("data-latLng")],
            destinations: [$("#endPoint").attr("data-latLng")],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL
        }, function (response) {

            var list = $("<dl/>", {
                    "class": "clearfix",
                    id: "quote"
                }),
                format = function (number) {

                    var rounded = Math.round(number * 100) / 100,
                        fixed = rounded.toFixed(2);

                    return fixed;
                },
                term = $("<dt/>"),
                desc = $("<dd/>"),
                distance = response.rows[0].elements[0].distance,
                weight = $("#weight").val(),
                distanceString = distance.text + "les",
                distanceNum = parseFloat(distance.text.split(" ")[0]),
                distanceCost = format(distanceNum * 3),
                weightCost = format(weight * 0.25 * distanceNum),
                totalCost = format(+distanceCost + +weightCost);

            //display results
            $("<h3>", {
                text: "Your quote",
                id: "quoteHeading"
            }).appendTo(ui);
            term.clone().html("Distance:").appendTo(list);
            desc.clone().text(distanceString).appendTo(list);
            term.clone().text("Distance cost:").appendTo(list);
            desc.clone().text("£" + distanceCost).appendTo(list);
            term.clone().text("Weight cost:").appendTo(list);
            desc.clone().text("£" + weightCost).appendTo(list);
            term.clone().addClass("total").text("Total:").appendTo(list);
            desc.clone().addClass("total").text("£" + totalCost).appendTo(list);
            list.appendTo(ui);
        });
    });

















});

