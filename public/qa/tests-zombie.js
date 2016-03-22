const Browser = require('zombie');

// We're going to make requests to http://example.com/signup
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
        .fill('userEmail',    'zombie@underworld.dead')
        .fill('userName', 'zombie')
        .fill('password', 'eat-the-living')
        .pressButton('Register!', done);

    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see welcome page', function() {
      browser.assert.text('title', 'Blogsite- register');
    });
  });
});