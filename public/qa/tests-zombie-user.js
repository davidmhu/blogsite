var Browser = require('zombie');

// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3100);

describe('User create, edit, detail page', function() {

  var browser = new Browser();
  var d=new Date();
  var username= 'zombieTest'+d.toLocaleString().substr(0,19).replace(/ |:/g,'-');
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
        .choose('Male')
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

  describe('should see the user edit page ',function(){
    before(function(done) {
      browser.visit('/user/'+useremail, done);
    });

    it('should see new username in user edit page', function() {
      browser.assert.input('#name', username);
    });

    describe('edit form submits',function() {
      before(function(done) {
        browser
          .fill('name', username+'modified')
          .choose('Female')
          .fill('birthday',new Date('2001-2-3'))        
          .pressButton('Post!', done);

      });
      it('edit a user successfully', function() {
        browser.assert.success();
      });
      it('should see modified user info in user detail page', function() {
        browser.assert.text('td.username', username+'modified');
        browser.assert.text('td.gendername', 'Female');
      });
    });

  });
  
  after(function() {
    browser.destroy();
  });
});