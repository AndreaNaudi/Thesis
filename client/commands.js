if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    '(open) menu': function() {
      document.getElementById("menu-btn").click(); // Click on the checkbox
      // Session.set('abx', 'next was said');
      // alert(Session.get('abx'));
    },
    'close': function() {
      document.getElementById("close-menu-btn").click();
      document.getElementById("close-schedule-btn").click();
    },
    'next (parking)': function() {
      document.getElementById("next-btn").click();
    },
    'previous (parking)': function() {
      document.getElementById("previous-btn").click();
    },
    '(show) departures': function() {
      document.getElementById("departures").click();
    },
    '(show) arrivals': function() {
      document.getElementById("arrivals").click();
    },
    '(show) suggested': function() {
      document.getElementById("suggested-btn").click();
    },
    '(get) (give me) directions': function() {
      document.getElementById("directions-btn").click();
    },
    'car park one': function(){
      Session.set('currentIndex', 1);
      document.getElementsByName('Car Park 1')[0].click();
    },
    'car park six': function(){
      Session.set('currentIndex', 0);
      document.getElementsByName('Car Park 6')[0].click();
    },
    'car park eight': function(){
      Session.set('currentIndex', 0);
      document.getElementsByName('Car Park 8')[0].click();
    },
    'ring road': function(){
      Session.set('currentIndex', 0);
      document.getElementsByName('Ring Road')[0].click();
    }
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}
