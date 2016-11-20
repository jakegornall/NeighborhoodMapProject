/*********************************
CACHE REPEATEDLY ACCESSED OBJECTS
**********************************/
var $mainWindow = $('#main-ui-window-bottom');
var mainWindowClosedPos = $mainWindow.offset();
var $newPlaceTextbox = $('#new-place-textbox');
var $newPlaceSearchList = $(".new-place-search-list");

/***************************
GLOBAL FUNCTION DEFINITIONS:
****************************/
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    // handles errors when attempting geolocation for Google maps.
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

/*****************
MODEL DEFINITIONS:
******************/
// holds all the data for a single place.
function Place(PlacesObj) {
    this.PlacesObj = PlacesObj;
}

/****************************
CREATES THE GOOGLE MAP OBJECT
CONTAINS THE VIEWMODEL
RUNS THE APP
*****************************/
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -25.363, lng: 131.044},
        zoom: 12,
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
            var newPlace = {
            	name: "Current Location",
            	geometry: {
            		location: pos
            	}
            }
            var Home = new Place(newPlace);
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

        // New Places Search Event Handling.
        newPlaceSearchResults : ko.observableArray(),
        places : ko.observableArray(),
        newPlacesSearchValue : ko.observable(),
        searchNewPlaces : function() {
            searchPlaces(this.newPlacesSearchValue());
            $newPlaceSearchList.fadeIn();
        },
        addNewPlace : function(place) {
            $newPlaceSearchList.fadeOut();
            var Latlng = place.geometry.location;
            var marker = new google.maps.Marker({
                position: Latlng,
                title: place.name
            });

            marker.addListener('click', function() {
                map.setZoom(13);
                map.setCenter(marker.getPosition());
            });

            var newPlace = new Place(place);
            viewModel.places.push(newPlace);
            marker.setMap(map);
            map.panTo(Latlng);
        },

        // Places list event handling.
        goToPlace : function(place) {
        	viewModel.mainWindowControl();
        	map.panTo(place.PlacesObj.geometry.location);
        },
        deletePlace : function(place) {
        	viewModel.places.pop(place);
        }
    }
    ko.applyBindings(viewModel);

    /********************************************************
    These functions use Google's PlacesService API to
    search locations that match the string given by the user.
    *********************************************************/
    function searchPlaces(searchString) {
        // prepares and sends a search request to Google's PlacesService API.
        var request = {
            location: map.getCenter(),
            radius: '500',
            query: searchString
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, returnPlacesResults);
    }

    function returnPlacesResults(results, status) {
        // populates the newPlacesSearchResults array with the results
        // from a Google PlacesService API call.
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            viewModel.newPlaceSearchResults.removeAll();
            for (var i = 0; i < results.length; i++) {
                viewModel.newPlaceSearchResults.push(results[i]);
            }
        }
    }
    /*************************************************************/
}