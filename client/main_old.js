import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Entities } from '/imports/api/collections.js';

import './main.html';

function getTimeDecimal(){
  var currentTime = clock.get();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes()/60;

  return (hours+minutes).toFixed(2);
}

Template.hello.onCreated(function helloOnCreated() {
  Session.set('currentIndex',0);
  Meteor.setInterval(function() {
    clock.set(new Date());
  }, 1000);
});

var clock = new ReactiveVar(new Date());

Template.hello.helpers({
  timeDecimal: function() {
    return getTimeDecimal();
  },
  test:function(){
    var arr = ['a','b','c','d'];
    var currentIndex = Session.get('currentIndex');
    //var p = Entities.findOne({'_id':'5bb9ee44e7179a6602f629d5'});
    //return p.totalSpaces;
    //return 10*getTimeDecimal();
    return arr[currentIndex];
  }
});

Template.hello.events({
  'click #directions-btn'(event, instance) {
    // increment the counter when button is clicked
    //instance.counter.set(instance.counter.get() + 1);
    // meteor add cordova:org.apache.cordova.inappbrowser@0.5.4
    window.open('https://goo.gl/maps/UqK9TgCfQ2G2', '_system');
  },
  'click #next-btn'(event,instance){
    var currentIndex = Session.get('currentIndex');
    var nextIndex = 0;
    if(currentIndex + 1 < 4){
      nextIndex = currentIndex+1;
    }

    Session.set('currentIndex', nextIndex);
  },
  'click #previous-btn'(event,instance){
    var currentIndex = Session.get('currentIndex');
    var prevIndex;
    if(currentIndex == 0){
      prevIndex = 3;
    }else{
        prevIndex = currentIndex-1;
    }

    Session.set('currentIndex', prevIndex);
  },
});
