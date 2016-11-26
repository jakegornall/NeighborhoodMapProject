/***********************
NEIGHBORHOOD MAP PROJECT
************************/
//  WRITTEN BY: JAKE GORNALL
//  
//  WRITTEN FOR: UDACITY - FULL STACK WEB DEVELOPMENT NANODEGREE
//  
//  DESCRIPTION: 
//  At runtime, this application attempts to find the user's current location. 
//  once found, the user is able to search and save nearby places as well as
//  access a variety of information about each location via various APIs.
//
//  FRAMEWORKS:
//  - Knockout.js => MVVM
//
//  LIBRARIES:
//  - jQuery 3.1.1
//
//  APIs:
//  - Google Maps
//  - Google PlacesService
//
//  THE CODE IS BROKEN INTO THE FOLLOWING SECTION (IN THIS ORDER AND HIERARCHY):
//  - Cache Repeatedly Accessed Objects/Elements
//  - Global Function Definitions
//  - Model Definitions
//  - Google Map Function (Contains the viewModel and runs the app)
//      - Knockout.js ViewModel
//      - Google placesService API supporting functions


/*****************************************
CACHE REPEATEDLY ACCESSED OBJECTS/ELEMENTS
******************************************/
var $mainWindow = $('#main-ui-window-bottom');
var mainWindowClosedPos = $mainWindow.offset();
var $newPlaceTextbox = $('#new-place-textbox');
var $newPlaceSearchList = $("#new-place-search-list");


/***************************
GLOBAL FUNCTION DEFINITIONS:
****************************/
// any functions that don't need to access the viewModel or maps object.

// handles errors when attempting geolocation for Google maps.
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
function Place(PlacesObj, marker) {
	this.id = PlacesObj.id;
    this.PlacesObj = PlacesObj;
    this.marker = marker;
    this.searchMatched = ko.observable(true);
}


/******************************
CREATES THE GOOGLE MAP FUNCTION
CONTAINS THE VIEWMODEL
RUNS THE APP
*******************************/
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
            infoWindow.setContent('Current Location');
            map.setCenter(pos);
            var newPlace = {
            	name: "Current Location",
            	geometry: {
            		location: pos
            	}
            }
            var Home = new Place(newPlace, infoWindow);
            viewModel.places.push(Home);
            viewModel.selectedPlace(Home);
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
    	selectedPlace : ko.observable(null),
    	modalIsOpen : function() {
    		if (this.mainWindowState()) {
    			this.mainWindowControl();
    		}
    	},
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
            if (this.mainWindowState()) {
            	this.mainWindowControl();
            }
            $newPlaceSearchList.fadeIn();
        },
        addNewPlace : function(place) {
            $newPlaceSearchList.fadeOut();

            var Latlng = place.geometry.location;

            var marker = new google.maps.Marker({
                position: Latlng,
                title: place.name
            });

            var newPlace = new Place(place, marker);

            marker.addListener('click', function() {
                viewModel.selectedPlace(newPlace);
                map.setZoom(13);
                map.setCenter(marker.getPosition());
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 2000);
            });

            viewModel.places.push(newPlace);
            viewModel.selectedPlace(newPlace);
            marker.setMap(map);
            marker.setAnimation(google.maps.Animation.DROP);
            map.panTo(Latlng);
        },

        // Places search filter
        placesFilterText: ko.observable(),

        // Places list event handling.
        goToPlace : function(place) {
        	viewModel.mainWindowControl();
        	map.panTo(place.PlacesObj.geometry.location);
        	viewModel.selectedPlace(place);
        },
        showAllPlaces : function() {
        	for (i = 0; i < this.places().length; i++) {
        		this.places()[i].searchMatched(true);
        		this.places()[i].marker.setMap(map);
        	}
        }
    }

    /***************************
    VIEWMODEL EXTENDED FUNCTIONS
    /***************************/
    //Deletes Place List Item
    viewModel.deletePlace = function(place) {
    	var id = place.id;
        for (i = 0; i < viewModel.places().length; i++) {
        	if (viewModel.places()[i].id === id) {
        		place.marker.setMap(null);
        		viewModel.places.splice(i, 1);
        		if (viewModel.selectedPlace() === place) {
        			viewModel.selectedPlace(null);
        		}
        		break
        	}
        }
    }

    // filters places list as user types into search box.
    viewModel.filterLocations = ko.computed(function() {
	    for (i = 0; i < this.places().length; i++) {
	       	var searchString = this.placesFilterText();
		    var place = this.places()[i];
		    if (searchString) {
		    	if (place.PlacesObj.name.toLowerCase().indexOf(searchString.toLowerCase()) === -1) {
		    		if (place.PlacesObj.formatted_address) {
		    			if (place.PlacesObj.formatted_address.toLowerCase().indexOf(searchString.toLowerCase()) === -1) {
		    				place.searchMatched(false);
		    				place.marker.setMap(null);
		    			} else {
		    				place.searchMatched(true);
		    				place.marker.setMap(map);
		    			}
		    		} else {
		    			place.searchMatched(false);
		    			place.marker.setMap(null);
		    		}
		    		
		    	} else {
		    		place.searchMatched(true);
		    		place.marker.setMap(map);
		    	}
		    } else {
		    	this.showAllPlaces();
		    }
	    }
    }, viewModel)

    // bind viewModel to DOM
    ko.applyBindings(viewModel);


    /********************************************************
    These functions use Google's PlacesService API to
    search locations that match the string given by the user.
    *********************************************************/
    // prepares and sends a search request to Google's PlacesService API.
    function searchPlaces(searchString) {
        var request = {
            location: map.getCenter(),
            radius: '500',
            query: searchString
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, returnPlacesResults);
    }

	// populates the newPlacesSearchResults array with the results
	// from a Google PlacesService API call.
    function returnPlacesResults(results, status) {
        
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            viewModel.newPlaceSearchResults.removeAll();
            for (var i = 0; i < results.length; i++) {
                viewModel.newPlaceSearchResults.push(results[i]);
            }
        }
    }
}