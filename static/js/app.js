// Caches repeatedly accessed objects.
var $mainWindow = $('#main-ui-window-bottom');
var mainWindowClosedPos = $mainWindow.offset();
var $newPlaceTextbox = $('#new-place-textbox');

/***************************
GLOBAL FUNCTION DEFINITIONS:
****************************/
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

/*****************
MODEL DEFINITIONS:
******************/
// holds all the data for a single place.
function Place(title, pos) {
    this.title = title;
    this.pos = pos;
}

/***********
RUNS THE APP
************/
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -25.363, lng: 131.044},
        zoom: 6,
        disableDefaultUI: true
    });
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation to find users location.
    // If geolocation works, create a new Place() call "Current Location".
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
            var Home = new Place("Current Location", pos);
            viewModel.places.push(Home);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }


/********************
KNOCKOUT.JS VIEWMODEL
*********************/
// NOTE: ViewModel must be contained within the initMap function
//       in order to make changes to the map object.
    var viewModel = {
        mapCenter : ko.observable(),
        // Main Window Controller
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
        // New Places Search Handling.
        newPlaceSearchResults : ko.observableArray(),
        places : ko.observableArray(),
        newPlacesSearchValue : ko.observable("Add New Location!"),
        searchNewPlaces : function() {
            searchPlaces(this.newPlacesSearchValue());
            $('.new-place-search-list').fadeIn();
        },
        addNewPlace : function() {
            $(".new-place-search-list").fadeOut();
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
            marker.setMap(map);
            map.panTo(myLatlng);
        }
    }
    ko.applyBindings(viewModel);

    // Uses Google's PlacesService API to search locations
    // that match the string given by the user.
    function searchPlaces(searchString) {
        var request = {
            location: viewModel.mapCenter(),
            radius: '500',
            query: searchString
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, returnPlacesResults);
    }

    function returnPlacesResults(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            viewModel.newPlaceSearchResults.removeAll();
            for (var i = 0; i < results.length; i++) {
                viewModel.newPlaceSearchResults.push(results[i]);
            }
        }
    }
}