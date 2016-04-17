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

    describe('Register a new user :', function() {

        before(function(done) {
            browser.visit('/#/register', done);
        });

        before(function(done) {
            browser
                .fill('email', useremail)
                .fill('name', username)
                .fill('password1', password)
                .fill('password2',password)
                .choose('Male')
                .fill('birthday', new Date('2011-2-3'))
                .pressButton('Register!', done);
        });

        it(username +' is registered successfully', function() {
            browser.assert.success();
        });
        /*it('the token cookie is not null', function() {
            assert.isNotNull(browser.getCookie({
                name: 'token'
            }, 'no token cookie'));
        });*/

    });

   describe('visit the new user detail page ', function() {
        before(function(done) {
            browser.visit('/#/user/show/' + useremail, done);
        });

        it('should see new useremail in user detail page', function() {
            browser.assert.text('td#useremail', useremail);

        });

    });

   //  describe('User\'s login:', function() {
   //      before(function(done) {
   //          browser.visit('/login', done);
   //      });
   //      before(function(done) {
   //          browser
   //              .fill('email', useremail)
   //              .fill('password', password)
   //              .pressButton('Sign in!', done);

   //      });
   //      it('login a user successfully', function() {
   //          browser.assert.success();
   //      });
   //      /*it(' token cookie is correctly parsed', function() {
   //          var token = browser.getCookie({
   //              name: 'token'
   //          });
   //          var strPayload = new Buffer((token.split('.')[1]), 'base64').toString('utf8');
   //          var payload = JSON.parse(strPayload);
   //          console.log(payload.email + ' ' + payload.name);
   //          //console.log(token);
   //          assert.equal(payload.email, useremail);
   //      });*/
   //  });

   //  describe('Edit a user: ',function(){ 
   //    before(function(done) {
   //      browser.visit('/user/'+useremail, done);
   //    });

   //    it('visit user edit page, see the username input', function() {
   //      browser.assert.input('#name', username);
   //    });

   //    describe('to save the modified user:',function() {
   //      before(function(done) {
   //        var token = browser.getCookie({
   //              name: 'token'
   //          });
   //        //browser.headers={
   //          //Authorization: 'Bearer '+ token 
   //        //};
   //        browser
   //          .fill('name', username+'modified')
   //          .choose('Female')
   //          .fill('birthday',new Date('2001-2-3'))        
   //          .pressButton('Post!', done);

   //      });
   //      it('edit a user successfully', function() {
   //        browser.assert.success();
   //      });
   //      it(' see modified user info in user detail page', function() {
   //        browser.assert.text('td.username', username+'modified');
   //        browser.assert.text('td.gendername', 'Female');
   //      });
   //    });

   //  });

   //  describe('Logout user', function() {
   //      before(function(done) {
   //          browser.visit('/logout', done);
   //      });

   //      it('should see no token cookie', function() {
   //          assert.isNull(browser.getCookie({
   //              name: 'token'
   //          }, 'no token cookie'));
   //      });
   //  });

    after(function() {
        browser.destroy();
    });
});