var Browser = require('zombie');
var assert = require('chai').assert;

// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3100);

describe('User create, login, edit, detail page', function() {

  var browser = new Browser();
  var d=new Date();
  var username= 'zombieTest'+d.toLocaleString().substr(0,19).replace(/ |:/g,'-');
  var useremail=username+'@underworld.dead';//zombieTest2016-03-28-16-13-36@underworld.dead
  var password='eat-the-living';
  console.log('the new account is ' + useremail);

  describe('submits form', function() {

    before(function(done) {
      browser.visit('/register', done);
    });

    before(function(done) {
      browser
        .fill('email',    useremail)
        .fill('name', username)
        .fill('password', password)
        .choose('Male')
        .fill('birthday',new Date('2011-2-3'))        
        .pressButton('Register!', done);

    });

    it('register a new user successfully', function() {
      browser.assert.success();
    });
    it('should see  token cookie',function(){
      assert.isNotNull(browser.getCookie({ name: 'token' },'no token cookie'));
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
  
  describe('should see user login',function(){
    before(function(done) {
      browser.visit('/login',done);
    });
    before(function(done) {
        browser
          .fill('email', useremail) 
          .fill('password',password)        
          .pressButton('Sign in!', done);

      });
      it('login a user successfully', function() {
        browser.assert.success();
      });
    it('should see  token cookie',function(){
      var token=browser.getCookie({ name: 'token' });
      var strPayload = new Buffer((token.split('.')[1]),'base64').toString('utf8');
      var payload = JSON.parse(strPayload);
      console.log(payload.email+' '+payload.name);
      assert.equal(payload.email,useremail);
    });
  });

/*describe('should see the user edit page ',function(){ //need to add payload auth
    before(function(done) {
      browser.visit('/user/'+'zombieTest2016-03-28-16-13-36@underworld.dead', done);
    });

    it('should see new username in user edit page', function() {
      browser.assert.input('#name', 'zombieTest2016-03-28-16-13-36');
    });

    describe('edit form submits',function() {
      before(function(done) {
        browser
          .fill('name', 'zombieTest2016-03-28-16-13-36@underworld.dead'+'modified')
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

  });*/

  describe('should see user logout',function(){
    before(function(done) {
      browser.visit('/logout',done);
      browser.setCookie({ name: 'foo', value: 'bar' });
    });

    it('should see no token cookie',function(){
      assert.isNull(browser.getCookie({ name: 'token' },'no token cookie'));
    });
    it('should see foo cookie',function(){
      assert.equal(browser.getCookie({ name: 'foo' }), 'bar');
    });
  });

  after(function() {
    browser.destroy();
  });
});