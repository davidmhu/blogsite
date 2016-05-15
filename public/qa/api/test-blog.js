var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var port = process.env.PORT || 3100;
require('dotenv').load();
var pinyinDict = require('../hanziDict');
var password = 'eat-the-living';

describe('Testing blog api:', function() {

    //var useremailArr=['yuaizhang16-05-03153040@blogsite.com','laidinggan16-05-04113444@blogsite.com',
    //    'yuzhaochang16-05-03111715@blogsite.com','jiaojianfu16-05-04105439@blogsite.com','yunweimao16-05-03114127@blogsite.com']//,'davidhu@163.com'];
    var useremailArr = ['shujieshu16-05-03215510@blogsite.com', 'ekongmei16-05-09185553@blogsite.com',
        'fanWenxuan@blogsite.com', 'jianyingshan16-05-09205518@blogsite.com', 'davidhu@163.com'
    ];
    //var usernameArr=['毓哀漳','濑玎甘','于找鲳','娇箭腹','郓威昴']//,'david'];
    var usernameArr = ['树桔菽', '厄箜每', '范文暄', '锏颖鳝', 'david'];
    var token, randomInt = Math.floor(Math.random() * useremailArr.length),
        useremail = useremailArr[randomInt],
        username = usernameArr[randomInt],
        title = '',
        content = '',
        blogid;
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

        var titlelen = Math.floor(Math.random() * 27 + 3);
        var contentlen = Math.floor(Math.random() * 440 + 10);
        title = '';
        content = '';
        for (var i = 0; i < titlelen; i++) {
            randomInt = Math.floor(Math.random() * pinyinDict.hanzi.length);
            title += pinyinDict.hanzi[randomInt];
        }
        for (i = 0; i < contentlen; i++) {
            randomInt = Math.floor(Math.random() * pinyinDict.hanzi.length);
            content += pinyinDict.hanzi[randomInt];
        }

        var cateArr = ['Tech', 'Travel', 'Book', 'Movie', 'Auto', 'Politics', 'Female'];
        var category = cateArr[Math.floor(Math.random() * cateArr.length)] + '|' + cateArr[Math.floor(Math.random() * cateArr.length)];
        var result, code;
        console.log(category);
        var postdata = {
            userEmail: useremail,
            title: title,
            content: content,
            userName: username,
            category: category
        };

        before(function(done) {
            request.post('http://localhost:' + port + '/api/blog/', {
                    json: postdata,
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                },
                function(error, response, body) {
                    code = response.statusCode; //console.log(response.statusCode);console.log(token);
                    if (!error && response.statusCode == 201) {
                        result = body;
                        blogid = result._id;
                    } else {
                        console.log(error);
                    }
                    done();
                });
        });

        it('should get code 201', function() {
            expect(code).to.equal(201);
        });

    });

    describe('query new blog ', function() {
        var queryCond;
        console.log('userEmail=' + useremail + '&title=' + title);
        before(function(done) {
            request('http://localhost:' + port + '/api/blog/' + blogid, {},
                function(error, response, body) {
                    code = response.statusCode;
                    if (!error && response.statusCode == 200) {
                        result = JSON.parse(body);
                        console.log(result.title);

                    } else {
                        console.log(error);
                    }
                    done();
                });
        });

        it('should get code 200', function() {
            expect(code).to.equal(200);
        });
    });




});