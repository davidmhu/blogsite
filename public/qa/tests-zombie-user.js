const Browser = require('zombie');

// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3100);

describe('User visits signup page', function() {

  const browser = new Browser();

  before(function(done) {
    browser.visit('/register', done);
  });

  describe('submits form', function() {

    before(function(done) {
      browser
        .fill('email',    'zombie456@underworld.dead')
        .fill('name', 'zombie456')
        .fill('password', 'eat-the-living')
        .fill('gender','0')
        .fill('birthday',new Date('2011-2-3'))        
        .pressButton('Register!', done);

    });

    it('should be successful', function() {
      browser.assert.success();
    });

    /*it('should see welcome page', function() {
      browser.assert.text('title', 'Blogsite- register');
    });*/
  });
});