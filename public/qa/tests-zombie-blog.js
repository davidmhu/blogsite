const Browser = require('zombie');

// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3100);

describe('create new blog page', function() {

  const browser = new Browser();

  describe('submits form', function() {

    before(function(done) {
      browser.visit('/blog/new', done);
    });

    it('should see welcome page', function() {
      browser.assert.text('title', 'Blogsite- blog edit');
    });

    before(function(done) {
      browser
        .fill('userEmail',    'david@underworld.dead')
        .fill('userName', 'david')
        .fill('title', 'from zombie title')
        .fill('content','from zombie content')
        .check('Tech')
        .check('Film')        
        .pressButton('Post!', done);

    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see welcome page', function() {
      browser.assert.text('title', 'Blogsite- blog Detail');
    });
  });
});