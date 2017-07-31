//My Global Vars

var map;
var largeInfowindow ;
var  myWindowInfo;
var contentStringString;
var locations = [
        {title: 'University of oxford', location: {lat:  51.754816, lng: -1.254367},lat:  51.754816, lng: -1.254367},
        {title: 'Havard University', location: {lat: 42.377003, lng: -71.116660},lat: 42.377003, lng: -71.116660},
        {title: 'Massachusetts Institute of Technology', location: {lat: 42.360091, lng: -71.094160},lat: 42.360091, lng: -71.094160},
        {title: 'Stanford University', location: {lat: 37.427475, lng: -122.169719},lat: 37.427475, lng: -122.169719},
        {title: 'University of Cambridge', location: {lat: 52.204267, lng: 0.114908},lat: 52.204267, lng: 0.114908},
		{title: 'California Institute of Technology', location: {lat: 34.137658, lng: -118.125269},lat: 34.137658, lng: -118.125269}
    ];
var markers = []


// The Model 
var Unversity = function(data){
  var self = this;
  this.title = data.title;
  this.lat = data.lat;
  this.lng = data.lng;
  this.position = data.location;
  };

  
// Init The Map   
function initMap() {
	self.searchKey = ko.observable('');
	self.UniversityList = ko.observableArray([]);
	for (var i = 0 ; i<locations.length ; i++) {
		self.UniversityList.push(new Unversity(locations[i]));
	}
    map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7413549, lng: -73.9980244},
          zoom: 2
    });
    PutDataInMarkers();
   
   self.filteredRecored = ko.computed( function() {
   var filter = self.searchKey().toLowerCase();

   if (!filter) { // if search box is empty show all MyMarkers 

    markers.forEach(function(rec){
      rec.setMap(map);

    });

    return self.UniversityList(); 
  }
  else 
  {
	
    var counter = 0 ;
    return ko.utils.arrayFilter(self.UniversityList(), function(rec) { 
     var filter = self.searchKey().toLowerCase();
	console.log("A8A");

     var string = rec.title.toLowerCase();

     var result = (string.search(filter) >= 0);
     marker = markers[counter];
     if (result === true){
      marker.setMap(map); 
    }else{
      marker.setMap(null);
    }
    counter = counter + 1;

    return result;
    
  });

  }

}, self);
}	


//Put Data In Markers   
function PutDataInMarkers() {
	largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
        // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
		// Get the position from the location array.
		var position = locations[i].location;
		var title = locations[i].title;
		var x = locations[i].lat ; 
		var y = locations[i].lng ;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
			map: map,
            position: position,
			lat: x,
			lng: y,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i	
		});
      
        marker.addListener('click', function() {
            showinfo(this, largeInfowindow);
        });
		markers.push(marker);
      //  bounds.extend(markers[i].position);
    }
	//map.fitBounds(bounds);
}  

// Show Info In the Pop Up Window 
var currentMarker = null;
function showinfo(marker, largeInfowindow) {
    if (largeInfowindow.marker != marker) {
      var URL = 'https://api.foursquare.com/v2/venues/search?ll='+ marker.lat + ',' +
                        marker.lng + '&client_id=' + 'FI3FR2GZE4WRBTAQ2WQIYPKTWGKAMKRCZWIUK1H3LQTXVMMF' +
                       '&client_secret=' + 'WCEMA33ZKZZ34GEDOY3VYJF0U3BXPC4Q2K5Q2BDM4NE3HT4H' + '&v=20160118'+
                       '&query='+marker.title;
    $.getJSON(URL).done(function(data) {
      var results = data.response.venues[0];
      var site = results.url; 
      if (typeof site === 'undefined'){
        site = "no website";
      }

      location.site = site;
      var phone = results.contact.formattedPhone;
          if (typeof phone === 'undefined'){
        phone = "no phone";
      }
      apiKey=' AIzaSyC2eaRWhPrmEBG27r_tUPwUoAtmnnlKgN4';
      largeInfowindow.marker = marker;
      largeInfowindow.setContent('<div>' + marker.title + '</div><br>'+
                            '<div>' + site + '</div><br>'+
                            '<div>' + phone + '</div><br>'+
                            '<img src="https://maps.googleapis.com/maps/api/streetview?size=400x200&location=' + 
                             marker.lat +','+marker.lng+'&heading=100&pitch=12&scale=2&key=' + apiKey + '">');
      largeInfowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
          marker.setAnimation(null);
      }, 2500);
      largeInfowindow.open(map, marker);
      largeInfowindow.addListener('closeclick',function(){
        largeInfowindow.setMarker = null;
      });
      
    }).fail(function() {
      alert("Please refresh the page and try again to load API Data.");
    });
    }
    if (currentMarker) currentMarker.setAnimation(null);
    currentMarker = marker;
}

// On click listener for the list 
function onClickList(name)
{
  var mymarker;
  for (i = 0; i < markers.length; i++) {
    if (markers[i].title == name){
      mymarker= markers[i];
    }
  }
  showinfo(mymarker,largeInfowindow);
}
 
 //Handle the Error 
function errorHandling() {
  alert("Please check your internet connection.");
}

//This function which bind the main function and google api called it
function listener(){
  ko.applyBindings(new initMap());
}
