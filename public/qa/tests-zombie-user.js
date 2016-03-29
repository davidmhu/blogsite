var Browser = require('zombie');
var assert = require('chai').assert;

// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000
Browser.localhost('localhost', 3100);

describe('User create, login, edit, detail page', function() {
    var browser = new Browser(),
        d = new Date(),
        nameArr = ['李明哲', '范文暄', '陈立得', '伍三湘', '顾江汉', '马芳', '欧阳明惠', '周秋云'],
        emailArr = ['liMingzhe', 'fanWenxuan', 'chenLide', 'wuSanxiang', 'guJianghan', 'maFang', 'ouyangMinghui', 'zhouQiuyu'],
        randomInt = Math.floor(Math.random() * nameArr.length);
    var username = nameArr[randomInt] ,
        useremail = emailArr[randomInt] + d.toLocaleString().substr(2, 19).replace(/ |:/g, '') + '@blogsite.com',
        password = 'eat-the-living';
    console.log('the new account is ' + useremail + ' and name is '+username);

    describe('submits form', function() {

        before(function(done) {
            browser.visit('/register', done);
        });

        before(function(done) {
            browser
                .fill('email', useremail)
                .fill('name', username)
                .fill('password', password)
                .choose('Male')
                .fill('birthday', new Date('2011-2-3'))
                .pressButton('Register!', done);
        });

        it('register a new user successfully', function() {
            browser.assert.success();
        });
        it('should see  token cookie', function() {
            assert.isNotNull(browser.getCookie({
                name: 'token'
            }, 'no token cookie'));
        });

    });

    describe('should see the new user detail page ', function() {
        before(function(done) {
            browser.visit('/user/show/' + useremail, done);
        });

        it('should see new useremail in user detail page', function() {
            browser.assert.text('td.useremail', useremail);

        });

    });

    describe('should see user login', function() {
        before(function(done) {
            browser.visit('/login', done);
        });
        before(function(done) {
            browser
                .fill('email', useremail)
                .fill('password', password)
                .pressButton('Sign in!', done);

        });
        it('login a user successfully', function() {
            browser.assert.success();
        });
        it('should see  token cookie', function() {
            var token = browser.getCookie({
                name: 'token'
            });
            var strPayload = new Buffer((token.split('.')[1]), 'base64').toString('utf8');
            var payload = JSON.parse(strPayload);
            console.log(payload.email + ' ' + payload.name);
            console.log(token);
            assert.equal(payload.email, useremail);
        });
    });

    describe('should see the user edit page ',function(){ //need to add payload auth
      before(function(done) {
        browser.visit('/user/'+useremail, done);
      });

      it('should see new username in user edit page', function() {
        browser.assert.input('#name', username);
      });

      describe('edit form submits',function() {
        before(function(done) {
          var token = browser.getCookie({
                name: 'token'
            });
          browser.headers={
            Authorization: 'Bearer '+ token 
          };
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

    describe('should see user logout', function() {
        before(function(done) {
            browser.visit('/logout', done);
        });

        it('should see no token cookie', function() {
            assert.isNull(browser.getCookie({
                name: 'token'
            }, 'no token cookie'));
        });
    });

    after(function() {
        browser.destroy();
    });
});