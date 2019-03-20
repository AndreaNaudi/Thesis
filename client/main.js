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
  return x >= min && x < max;
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

  if(optimality > getScoreSuggested()){
    Session.set('suggestedIndex', index);
  }

  return optimality > 0;
}

function getScoreSuggested(){
  //var suggestedIndex = Session.get('suggestedIndex')};
  var score = 0;
  if(Session.get('currentIndex') == 1){
    return 1;
  }


  // get from functions
  // var initial = getInitialValueFn(suggestedIndex)
  // var departures
  // var accumulation

  //calculate score
  return score;
}

function getPrediction(index, type){
  //type -> 0.Init 1.Dep 2. Arrivals 3.Accumulation
  var today = new Date();
  var day = today.getDay();
  if(day != 1 && day != 3 && day != 5){
    return "na";
  }
  var p = Entities.findOne({'index':index});
  var clock = getTime();
  var hours = clock.getHours();
  var minutes = clock.getMinutes();

  var x = 0;
  if(hours == 9 || hours == 11){
    if(minutes < 50){
      return x;
    }
  }
  if(hours == 9 || hours == 10){
    if(between(minutes, 56, 59)){
      x = p.values[day].nineFiftySix[type];
    }else if(minutes == 59 || minutes == 0 || minutes == 1 || minutes == 2){
      x = p.values[day].nineFiftyNine[type];
    }
    else if(between(minutes, 2, 5)){
      x = p.values[day].tenZeroTwo[type];
    }
    else if(between(minutes, 5, 8)){
      x = p.values[day].tenZeroFive[type];
    }
  }else if(hours == 11 || hours == 12){
    if(between(minutes, 56, 59)){
      x = p.values[day].elevenFiftySix[type];
    }else if(minutes == 59 || minutes == 0 || minutes == 1){
      x = p.values[day].elevenFiftyNine[type];
    }
    else if(between(minutes, 2, 5)){
      x = p.values[day].twelveZeroTwo[type];
    }
    else if(between(minutes, 5, 8)){
      x = p.values[day].twelveZeroFive[type];
    }
  }
  if(type == 3){
    x = p.totalSpaces - x;
  }
  return Math.round(x * 10)/10;
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
  isOnSuggested: function(){
    return Session.get('suggestedIndex') == Session.get('currentIndex');
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
    var minutesRanges = [[56,59],[2,5],[5,8]];
    var hoursRanges = [9,10,11,12];
    var inHour = false;
    var s = '';

    hoursRanges.forEach(function(hour) {
      if(hours == hour){
          inHour = true;
      }
    });

    if(inHour == true){
      if(minutes == 59 || minutes == 0 || minutes == 1){
        if(hours == 9 || hours == 10){
          s =  '9:59 - 10:02';
        }else if(hours == 11 || hours == 12){
          s =  '11:59 - 12:02';
        }
      }

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
    if(hours == 9 || hours == 11){
      if(minutes < 50){
        s = '';
      }
    }
    if(s == ''){
        s = 'No data for this time';
    }
    return s;
  },
  getInitialValue: function(index) {
      index = parseInt(index);
      var value = getPrediction(index, 0);
      return value;
  },
  getArrivalsValue: function(index) {
      index = parseInt(index);
      var value = getPrediction(index, 2);
      return value;
  },
  getDeparturesValue: function(index) {
      index = parseInt(index);
      var value = getPrediction(index, 1);
      return value;
  },
  getInitialValueCurrent: function() {
      var index = parseInt(Session.get('currentIndex'));
      var value = getPrediction(index,0);
      return value;
  },
  getArrivalsValueCurrent: function() {
      var index = parseInt(Session.get('currentIndex'));
      var value = getPrediction(index,2);
      return value;
  },
  getDeparturesValueCurrent: function() {
      var index = parseInt(Session.get('currentIndex'));
      var value = getPrediction(index,1);
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
  },
  getSchedule: function() {
    var type = Session.get('type');
    var today = new Date();
    var day = today.getDay();
    var clock = getTime();
    var hours = clock.getHours();

    if(day != 1 && day != 3 && day != 5){
      return ["na","na","na","na"];
    }

    var arr = [];
    var currentIndex = Session.get('currentIndex');
    var p = Entities.findOne({'index':currentIndex});
    if(hours == 9 || hours == 10){
      arr[0] = Math.round(p.values[day].nineFiftySix[type]);
      arr[1] = Math.round(p.values[day].nineFiftyNine[type]);
      arr[2] = Math.round(p.values[day].tenZeroTwo[type]);
      arr[3] = Math.round(p.values[day].tenZeroFive[type]);
      return arr;
    }

    if(hours == 11 || hours == 12){
      arr[0] = Math.round(p.values[day].elevenFiftySix[type]);
      arr[1] = Math.round(p.values[day].elevenFiftyNine[type]);
      arr[2] = Math.round(p.values[day].twelveZeroTwo[type]);
      arr[3] = Math.round(p.values[day].twelveZeroFive[type]);
      return arr;
    }
    return ["na","na","na","na"];

  },
  getTypeName: function(){
    return Session.get('type-name');
  },
  getTimeIntervals: function(){
    var clock = getTime();
    var hours = clock.getHours();
    if(hours == 9 || hours == 10){
      return ["9:56 - 9:59","9:59 - 10:02", "10:02 - 10:05", "10:05 - 10:08"];
    }

    if(hours == 11 || hours == 12){
      return ["11:56 - 11:59","11:59 - 12:02", "12:02 - 12:05", "12:05 - 12:08"];
    }

    return ["9:56 - 9:59","9:59 - 10:02", "10:02 - 10:05", "10:05 - 10:08"];
  },
  isCurrentInterval: function(time){
    var header = Session.get('time-header-text');
    var x = header.includes(time);
    return x;
    //return true;
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
    var p = Entities.find().count();
    var nextIndex = 0;
    if(currentIndex + 1 < p){
      nextIndex = currentIndex+1;
    }

    Session.set('currentIndex', nextIndex);

    // setLocation();

    var msg = new SpeechSynthesisUtterance('1 slot available');
    //var voices = window.speechSynthesis.getVoices()
    //msg.rate = 1.5;
    window.speechSynthesis.speak(msg);
  },
  'click #previous-btn'(event,instance){
    var currentIndex = Session.get('currentIndex');
    var p = Entities.find().count();
    var prevIndex;
    if(currentIndex == 0){
      prevIndex = p-1;
    }else{
        prevIndex = currentIndex-1;
    }

    Session.set('currentIndex', prevIndex);
  },
  'click #suggested-btn'(event,instance){
    Session.set('currentIndex', Session.get('suggestedIndex'));
  },
  'click .grid-item':function(e){
      var id = e.target.id;
      var clickedDiv = document.getElementById(id);
      var value = clickedDiv.getAttribute('value');
      value = parseInt(value);
      Session.set('currentIndex', value);
      //setLocation();
      document.getElementById('close-menu-btn').click();
  },
  'click #departures':function(){
    Session.set('type', 1);
    Session.set('type-name', "Departures");
    var header = document.getElementsByClassName("time-header")[0].innerHTML;
    Session.set('time-header-text', header);
  },
  'click #arrivals':function(){
    Session.set('type', 2);
    Session.set('type-name', "Arrivals");
    var header = document.getElementsByClassName("time-header")[0].innerHTML;
    Session.set('time-header-text', header);
  }
});
