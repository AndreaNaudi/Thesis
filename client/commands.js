if (annyang) {
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    '(open) menu': function() {
      document.getElementById("menu-btn").click(); // Click on the checkbox
      // Session.set('abx', 'next was said');
      // alert(Session.get('abx'));
    },
    'close (menu)': function() {
      document.getElementById("close-btn").click();
    },
    'next (parking)': function() {
      document.getElementById("next-btn").click();
    },
    'previous (parking)': function() {
      document.getElementById("previous-btn").click();
    },
    '(get) (give me) directions': function() {
      document.getElementById("directions-btn").click();
    },
    'car park one': function(){
      document.getElementsByName('Car Park 1')[0].click();
    },
    'car park six': function(){
      document.getElementsByName('Car Park 6')[0].click();
    }
  };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}
