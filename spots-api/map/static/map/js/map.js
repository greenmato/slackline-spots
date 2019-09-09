
var map;
var infoWindow;

/*
 * Initialise the spots map.
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.5074, lng: 0.1278},
        zoom: 12
    });
    infoWindow = new google.maps.InfoWindow;

    geolocate();

    initSpots();

    initControls();
}

/*
 * Center the map on the user's location if they allow it.
 */
function geolocate() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

/*
 * Import the map markers from the current_map.xml file
 */
function importFromXml() {
    downloadUrl('media/shared/map_info/current_map.xml', function(data) {
        var xml = data.responseXML;
        var markers = xml.documentElement.getElementsByTagName('marker');
        Array.prototype.forEach.call(markers, function(markerElem) {
            var id = markerElem.getAttribute('id');
            var point = new google.maps.LatLng(
                parseFloat(markerElem.getAttribute('latitude')),
                parseFloat(markerElem.getAttribute('longitude'))
            );
            var marker = new google.maps.Marker({
                map: map,
                position: point
            });

            marker.addListener('click', function() {
                var infowincontent = document.createElement('div');

                infoWindow.setContent(infowincontent);
                infoWindow.open(map, marker);

                downloadUrl(id, function(data) {
                    var template = document.createElement('div');
                    template.innerHTML = data.response.trim();
                    infowincontent.appendChild(template);
                });

            });
        });
    });
}

function initSpots() {
    request('spots/', 'GET', null, function (response) {
        spots = JSON.parse(response.response).data;

        Array.prototype.forEach.call(spots, function(spot) {
            var point = new google.maps.LatLng(
                parseFloat(spot.latitude),
                parseFloat(spot.longitude)
            );
            var marker = new google.maps.Marker({
                map: map,
                position: point
            });

            marker.addListener('click', function() {
                var infowincontent = document.createElement('div');

                infoWindow.setContent(infowincontent);
                infoWindow.open(map, marker);

                var template = document.createElement('div');
                template.innerHTML = spot;
                infowincontent.appendChild(template);
            });
        });
    });
}

/*
 * Initialise controls (buttons etc.)
 */
function initControls() {
    var createButtonDiv = document.createElement('div');
    var createButton = new CreateButton(createButtonDiv, map);

    createButtonDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(createButtonDiv);
}

function CreateButton(controlDiv, map) {
    var createButton = document.createElement('div');
    createButton.id = 'createbutton';
    createButton.title = 'Click to create a spot';
    controlDiv.appendChild(createButton);

    var createButtonText = document.createElement('div');
    createButtonText.innerHTML = 'Create Spot';
    createButton.appendChild(createButtonText);

    createButton.addEventListener('click', function() {
        map.setOptions({draggableCursor:'crosshair'});
        google.maps.event.addListener(map, "click", openForm);
    });
}

/*
 * Initialise the create spot form on the map where the user has clicked
 */
function openForm(event) {
    var clickPosition = event.latLng;
    var infowincontent = document.createElement('div');

    infoWindow.setContent(infowincontent);
    infoWindow.setPosition(clickPosition);
    infoWindow.open(map);

    downloadUrl('create', function(data) {
        var form = document.createElement('div');
        form.innerHTML = data.response.trim();
        infowincontent.appendChild(form);
        document.getElementById('id_latitude').value = clickPosition.lat().toFixed(7);
        document.getElementById('id_longitude').value = clickPosition.lng().toFixed(7);
    });
}

/*
 * Make an AJAX request. Used to get files and templates.
 */
function downloadUrl(url, callback) {
    var request = window.ActiveXObject ?
        new ActiveXObject('Microsoft.XMLHTTP') :
        new XMLHttpRequest;

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
        }
    };

    request.open('GET', url, true);
    request.send(null);
}

function request(url, method, data, callback) {
    var request = window.ActiveXObject ?
        new ActiveXObject('Microsoft.XMLHTTP') :
        new XMLHttpRequest;

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            // request.onreadystatechange = doNothing;

            callback(request, request.status);
        }
    };
    request.open(method, url, true);

    if (method == 'POST') {
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    request.send(data);
}

function doNothing() {}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}
