const Browser = require('zombie');

// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3100);

describe('create new blog page', function() {

  const browser = new Browser();

  describe('show blank blog page', function() {

    before(function(done) {
      browser.visit('/blog/new', done);
    });

    it('should see welcome page', function() {
      browser.assert.text('title', 'Blogsite- blog create');
    });

    it('should see post button', function() {
      browser.assert.element('#btn-post');
    });    

  });

  describe('submits form', function() {

    var d = new Date();
    var title='title on '+d.toLocaleString();
    var content='content on '+d.toLocaleString();

    before(function(done) {
      browser.visit('/blog/new', done);
    });

    before(function(done) {
      browser
        .fill('userEmail',    'alan4@sina.com')
        .fill('userName', 'alan4')
        .fill('title', title)
        .fill('content',content)
        .check('Travel')
        .check('Film')        
        .pressButton('Post!', done);
    });

    it('should be successful', function() {
      browser.assert.success();
    });

    it('should see welcome page', function() {
      browser.assert.text('title', 'Blogsite- blog Detail');
    });

    it('should see the new blog', function(){
      browser.assert.text('p.lead',content);
    })
  });

  after(function() {
    browser.destroy();
  });
});