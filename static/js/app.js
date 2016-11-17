// initiates the map with user's current location.
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -25.363, lng: 131.044},
        zoom: 6,
        disableDefaultUI: true
    });
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
            viewModel.mapCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


    // Knockout.js ViewModel
    var viewModel = {
        mapCenter : ko.observable(),
        places : ko.observableArray(),
        mainWindowState : ko.observable(false),
        mainWindowControl : function() {
            if (this.mainWindowState() === false) {
                $mainWindow.animate({
                    top: "25%"
                });
                this.mainWindowState(true);
            } else {
                $mainWindow.animate({
                    top: mainWindowClosedPos.top
                });
                this.mainWindowState(false);
            }
        },
        addNewPlace : function(formElement) {
            var title = $newPlaceTextbox.val();
            var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
            var marker = new google.maps.Marker({
                position: myLatlng,
                title:"Hello World!"
            });

            marker.addListener('click', function() {
                map.setZoom(8);
                map.setCenter(marker.getPosition());
            });
            
            var newPlace = new Place(title, myLatlng);
            this.places.push(newPlace);
            // To add the marker to the map, call setMap();
            marker.setMap(map);
            map.panTo(myLatlng);
        }
    }
    ko.applyBindings(viewModel);  
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

// Caches repeatedly accessed objects.
var $mainWindow = $('#main-ui-window-bottom');
var mainWindowClosedPos = $mainWindow.offset();
var $newPlaceTextbox = $('#new-place-textbox');


// MODEL DEFINITIONS:
function Place(title, pos) {
	// holds all the data for a single place.
    this.title = title;
	this.pos = pos;
}