import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Entities } from '/imports/api/collections.js';

import './main.html';
//MONGO_URL=mongodb://anau0005:Juventus1998@ds125273.mlab.com:25273/fyp2019 meteor
function getTimeDecimal(){
  var currentTime = clock.get();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes()/60;

  return (hours+minutes).toFixed(2);
}
function getTime(){
  var currentTime = clock.get();
  return currentTime;
}
function between(x, min, max) {
  return x >= min && x <= max;
}
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {

  alert("Latitude: " + position.coords.latitude +
  "\nLongitude: " + position.coords.longitude)
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
Template.new.onCreated(function helloOnCreated() {
  Session.set('currentIndex',0);
  Meteor.setInterval(function() {
    clock.set(new Date());
  }, 1000);
});

var clock = new ReactiveVar(new Date());

Template.new.helpers({
  getName: function(){
    var currentIndex = Session.get('currentIndex');
    var p = Entities.findOne({'index':currentIndex});
    return p.name;
  },
  getInitial: function() {
      var currentIndex = Session.get('currentIndex');
      var p = Entities.findOne({'index':currentIndex});
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

  },
  timeDecimal: function() {
    return getTimeDecimal();
  }
});

Template.new.events({
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
    //var audio = new Audio('link to mp3');
    //audio.play();



    var msg = new SpeechSynthesisUtterance('One slot available');
    //var voices = window.speechSynthesis.getVoices()
    msg.rate = 1.5;
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
});
