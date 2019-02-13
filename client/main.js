import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Entities } from '/imports/api/collections.js';

import './main.html';
import './commands.js';
//MONGO_URL=mongodb://anau0005:Juventus1998@ds125273.mlab.com:25273/fyp2019 meteor
function getTimeDecimal(){
  var currentTime = clock.get();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes()/60;

  return (hours+minutes).toFixed(2);
}
function SwapDivsWithClick(div1,div2)
{
   d1 = document.getElementById(div1);
   d2 = document.getElementById(div2);
   if( d2.style.display == "none" )
   {
      d1.style.display = "none";
      d2.style.display = "block";
   }
   else
   {
      d1.style.display = "block";
      d2.style.display = "none";
   }
}
function getTime(){
  var currentTime = clock.get();
  return currentTime;
}
function between(x, min, max) {
  return x >= min && x <= max;
}
function setLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setOrigin, showError);
      calculateDistance();
  } else {
      alert("Geolocation is not supported by this browser.");
  }
}
function setOrigin(position) {
  Session.set('oLong', position.coords.longitude);
  Session.set('oLat', position.coords.latitude);
}
function calculateDistance(){
  var currentIndex = Session.get('currentIndex');
  var p = Entities.findOne({'index':currentIndex});
  var pLat = p.latitude;
  var pLong = p.longitude;
  var oLong = Session.get('oLong');
  var oLat = Session.get('oLat');

  var destination = pLat + ',' + pLong;
  var origin = oLat + ',' + oLong;

  var directionsService = new google.maps.DirectionsService();

  var request = {
    origin      : origin, // a city, full address, landmark etc
    destination : destination,
    travelMode  : google.maps.DirectionsTravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
  if ( status == google.maps.DirectionsStatus.OK ) {
    var val = response.routes[0].legs[0].distance.value; // the distance in metres
    Session.set('distanceFromOrigin', val);
  }
  else {
    return 0;
  }
  });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function isOptimalFn(index){
  index = parseInt(index);
  //var init = getInitialValueFn(index);

  var optimality = 0;

  var init = 0;
  var dep = 6;

  if(init >= 5){
    optimality += 1;
  }
  if(dep >= 5){
    optimality += 1;
  }

  return optimality > 0;
}

function getInitialValueFn(index){
  var p = Entities.findOne({'index':index});
  var clock = getTime();
  var hours = clock.getHours();
  var minutes = clock.getMinutes();
  /*if(hours == 9 && between(minutes, 55, 59)){
      alert('It is 9:55');
  }
  else if(hours == 10 && between(minutes, 0, 4)){
      alert('It is 10');
  }
  else{
      alert('No data available');
  }
  if(minutes <17){
    return p.initial.NineFF;
  }else{
    return p.initial.Ten;
  }*/
  return p.initial.NineFF;
}

Template.new.onCreated(function newOnCreated() {
  Session.set('currentIndex',0);
  //setTimeout(function() { setLocation(); }, 1000);
  Meteor.setInterval(function() {
    clock.set(new Date());
  }, 1000);

});


var clock = new ReactiveVar(new Date());

Template.new.helpers({
  getEntitiies: function(){
    var p = Entities.find().fetch();
    return p;
  },
  getDistance: function(){
    return Session.get('distanceFromOrigin');
  },
  getName: function(){
    var currentIndex = Session.get('currentIndex');
    var p = Entities.findOne({'index':currentIndex});
    return p.name;
  },
  getRange: function(){
    var clock = getTime();
    var hours = clock.getHours();
    var minutes = clock.getMinutes();
    var minutesRanges = [[10,12],[13,15],[16,20],[21,49]];
    var hoursRanges = [9,10];
    var inHour = false;
    var s = '';

    hoursRanges.forEach(function(hour) {
      if(hours == hour){
          inHour = true;
      }
    });

    if(inHour == true){
      minutesRanges.forEach(function(range) {
        var a = range[0];
        var b = range[1];
        if(between(minutes, a, b)){
            a = ('0' + a).slice(-2);
            b = ('0' + b).slice(-2);
            s = hours + ':'+a+' - ' +hours+ ':'+b;
        }
      });
    }

    if(s == ''){
        s = 'No data for this range';
    }
    return s;
  },
  getInitialValue: function(index) {
      index = parseInt(index);
      var value = getInitialValueFn(index);
      return value;
  },
  getInitialValueCurrent: function() {
      var index = parseInt(Session.get('currentIndex'));
      var value = getInitialValueFn(index);
      return value;
  },
  isOptimal: function(index){
    return isOptimalFn(index);
  },
  isOptimalCurrent: function(){
    return isOptimalFn(Session.get('currentIndex'));
  },
  timeDecimal: function() {
    return getTimeDecimal();
  }
});

Template.new.events({
  'click #swap-btn'(){
    SwapDivsWithClick('locations-screen','main-screen');
    //alert('hello');
  },
  'click #directions-btn'(event, instance) {
    //getLocation();

    var currentIndex = Session.get('currentIndex');
    var p = Entities.findOne({'index':currentIndex});
    var location = p.location;
    // meteor add cordova:org.apache.cordova.inappbrowser@0.5.4
    window.open(location, '_system');
  },
  'click #next-btn'(event,instance){
    var currentIndex = Session.get('currentIndex');
    var nextIndex = 0;
    if(currentIndex + 1 < 2){
      nextIndex = currentIndex+1;
    }

    Session.set('currentIndex', nextIndex);

    // setLocation();

    //var audio = new Audio('link to mp3');
    //audio.play();



    var msg = new SpeechSynthesisUtterance('One slot available');
    //var voices = window.speechSynthesis.getVoices()
    //msg.rate = 1.5;
    window.speechSynthesis.speak(msg);
  },
  'click #previous-btn'(event,instance){
    var currentIndex = Session.get('currentIndex');
    var prevIndex;
    if(currentIndex == 0){
      prevIndex = 1;
    }else{
        prevIndex = currentIndex-1;
    }

    Session.set('currentIndex', prevIndex);
  },
  'click .grid-item':function(e){
      var id = e.target.id;
      var clickedDiv = document.getElementById(id);
      var value = clickedDiv.getAttribute('value');
      value = parseInt(value);
      Session.set('currentIndex', value);
      //setLocation();
      document.getElementById('close-btn').click();
  }
});
