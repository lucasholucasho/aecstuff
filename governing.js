jQuery.ajaxSettings.traditional = true; 

function getTest() {
  var url = 'http://smarterwindow.lbl.gov/sensor/all'; 
  $.ajax({
	type: "GET",
	url: url,
	dataType: 'json',
	beforeSend: function(xhr) {xhr.setRequestHeader('Accept', 'application/json');},
	success: function(data) {
        if (! (data)) {
           alert ("no response");
        } else {
	alert ("YES");
            };
        }
});    
}

function setter() {
	alert ("Alarm set");
	//current time
	var now = new Date();
	
	//desired time
	var wanted = $('#time').val();
	//transform the desired time

	var colon = wanted.indexOf(":");
	var minutes = wanted.substr(colon+1, 2);
		
	//get the portion before the colon and add 12
	var hour = wanted.substr(0, colon);
	var hour2 = parseInt(hour);
	if (wanted.indexOf("PM") != -1 && wanted.indexOf("12:") == -1) //if it's afternoon and doesn't start with 12 add 12
	{
		hour2 += 12;
	}
		
	//add the new value to the end
	wanted = hour2 + ":" + minutes;
	
	//make the new date
	var months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	var index = new Date().getMonth();
	var month = months[index]; //month
	
	var day = new Date().getDate(); //day of month
	
	var year = new Date().getFullYear(); //year
	
	var dateString = month + " " + day + ", " +year + " " + wanted;
	var desired = new Date (dateString);
	
	
	//testing code
	/*desired = new Date ("March 16, 2014 6:00 AM");
	now = new Date ("March 15, 2014 10:00 PM");*/
	//execute the invert at this interval
	var interval = (desired - now);
	
	//need to handle PM to AM case
	if (interval < 0)
	{
		interval = 3600 * 24 * 1000 + interval;
	}
	alert (interval);
	
	setTimeout(function() {
		var isBright = true;
		var url = 'http://smarterwindow.lbl.gov/sensor/all'; 
		  $.ajax({
			type: "GET",
			url: url,
			dataType: 'json',
			beforeSend: function(xhr) {xhr.setRequestHeader('Accept', 'application/json');},
			success: function(data) {
		        if (! (data)) {
		           alert ("no response");
		        } else {
			 			if (data.lastSensorReading.outside_light_sensor1 < 100) isBright = false;
		            };
		        }
		});
	if (isBright) //only invert the shade if it is bright outside
	{	
	var url='http://smarterwindow.lbl.gov/actions/override?timeout_seconds=120&api_key=AEChackathon';
	
	$.ajax({
		type: "GET",
		url: url,
		dataType: 'jsonp',
		//beforeSend: function(xhr) {xhr.setRequestHeader('Accept', 'application/json');},
		success: function(data) {
	        if (! (data)) {
	           alert ("no response");
	        } else {
		alert ("Inversion successful");
	            };
	        }
	});}, interval);
    } 
}

$(document).ready(function() {
  $.ajaxSetup({ cache: false });  
  $("#go").on('click', setter);
  getTest();    
  
});
