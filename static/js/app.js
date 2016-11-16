// initiates the map with user's current location.
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
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
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

(function() {
    var _dragged;
    ko.bindingHandlers.drag = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var dragElement = $(element);
            var dragOptions = {
                helper: 'clone',
                revert: true,
                revertDuration: 0,
                start: function() {
                    _dragged = ko.utils.unwrapObservable(valueAccessor().value);
                },
                cursor: 'default'
            };
            dragElement.draggable(dragOptions).disableSelection();
        }
    };

    ko.bindingHandlers.drop = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var dropElement = $(element);
            var dropOptions = {
                drop: function(event, ui) {
                    valueAccessor().value(_dragged);
                }
            };
            dropElement.droppable(dropOptions);
        }
    };
})();

// Knockout.js ViewModel
var viewModel = {
    mainWindowDrag : function(MainWindow, event) {
        var dragOptions = {
                start: function() {
                    var _dragged = ko.utils.unwrapObservable(valueAccessor().value);
                },
                cursor: 'default'
            };
        $('#main-ui-window-bottom').draggable(dragOptions);
    }
}