var Browser = require('zombie');

// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3100);

describe('User create and detail page', function() {

  var browser = new Browser();
  var d=new Date();
  var username='zombieTest'+d.toLocaleString().substr(0,19).replace(/ |:/g,'-');
  var useremail=username+'@underworld.dead';
  console.log('the new account is ' + useremail);

  describe('submits form', function() {

    before(function(done) {
      browser.visit('/register', done);
    });

    before(function(done) {
      browser
        .fill('email',    useremail)
        .fill('name', username)
        .fill('password', 'eat-the-living')
        .fill('gender','0')
        .fill('birthday',new Date('2011-2-3'))        
        .pressButton('Register!', done);

    });

    it('register a new user successfully', function() {
      browser.assert.success();
    });

  });

  describe('should see the new user detail page ',function(){
    before(function(done) {
      browser.visit('/user/show/'+useremail, done);
    });

    it('should see new useremail in user detail page', function() {
      browser.assert.text('td.useremail', useremail);
    });

  });

  after(function() {
    browser.destroy();
  });
});