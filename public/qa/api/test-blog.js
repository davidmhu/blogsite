var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var port = process.env.PORT || 3100;
require('dotenv').load();
var pinyinDict = require('../hanziDict');
var password = 'eat-the-living';

describe('Testing blog api:', function() {

  var token, uploadedName, randomInt, username = 'david',
    useremail = 'davidhu@163.com',title='',content='',
    d = new Date();
  var titlelen=Math.floor(Math.random() *47+3);
  var contentlen=Math.floor(Math.random() *240+10);
  for (var i = 0; i < titlelen; i++) {
    randomInt = Math.floor(Math.random() * pinyinDict.hanzi.length);
    title += pinyinDict.hanzi[randomInt];    
  }
  for ( i = 0; i < contentlen; i++) {
    randomInt = Math.floor(Math.random() * pinyinDict.hanzi.length);
    content += pinyinDict.hanzi[randomInt];    
  }

  console.log('the new account is ' + useremail + ' and name is ' + username);

  describe('User login ', function() {

    var postdata = {
      email: useremail,
      password: password
    };
    var result, code;

    before(function(done) {
      request.post('http://localhost:' + port + '/api/login/', {
          json: postdata
        },
        function(error, response, body) {
          code = response.statusCode; //console.log(response.statusCode);
          if (!error && response.statusCode == 200) {
            result = body;
            token = result.token;
          }
          done();
        });
    });
    it('should login successfully', function() {
      expect(result).to.have.property('token');
    });

  });


  describe('post a new blog', function() {
    
    var result, code;
    var postdata = {
      userEmail: useremail,
      title: title,
      content:content,
      userName: username,
      category: 'Tech|Movie'
    };

    before(function(done) {
      request.post('http://localhost:' + port + '/api/blog/' , {
          json: postdata,
          headers: {
            Authorization: 'Bearer ' + token
          }
        },
        function(error, response, body) {
          code = response.statusCode; //console.log(response.statusCode);console.log(token);
          if (!error && response.statusCode == 201) {
            result = body; //console.log(result);

          } else {
            console.log(error);
          }
          done();
        });
    });

    /*before(function(done) {
      request('http://localhost:' + port + '/api/blog/' + existedEmail, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        },
        function(error, response, body) {
          code = response.statusCode; //console.log(response.statusCode);
          if (!error && response.statusCode == 200) {
            result = JSON.parse(body); //console.log(result);

          } else {
            console.log(error);
          }
          done();
        });

    });*/

    it('should get code 200', function() {
      expect(code).to.equal(201);
    });

  });

 
});