var chai = require('chai');
var expect = chai.expect;
var request = require('request');
var port = process.env.PORT || 3100;
require('dotenv').load();
var pinyinDict = require('../hanziDict');


describe('Testing user api:', function() {
    console.log(pinyinDict.hanzi[3]);
    var token, uploadedName,randomInt;
    for (var i = 0; i < 25; i++) {
        randomInt = Math.floor(Math.random() * pinyinDict.hanzi.length);
        console.log(i + ':' + randomInt);
        testHanzi += pinyinDict.hanzi[randomInt];
        testPinyin += pinyinDict.pinyin[randomInt];
    }
    var d = new Date(),
        nameArr = ['李明哲', '范文暄', '陈立得', '伍三湘', '顾江汉', '马芳', '欧阳明惠', '周秋云'],
        emailArr = ['liMingzhe', 'fanWenxuan', 'chenLide', 'wuSanxiang', 'guJianghan', 'maFang', 'ouyangMinghui', 'zhouQiuyu'],
        randomInt = Math.floor(Math.random() * nameArr.length),
        username = nameArr[randomInt],
        useremail = emailArr[randomInt] + d.toLocaleString().substr(2, 19).replace(/ |:/g, '') + '@blogsite.com',
        password = 'eat-the-living'; //'88888888'

    var existedEmail = useremail; //'davidhu@163.com'; used for test without register

    console.log('the new account is ' + useremail + ' and name is ' + username);

    describe('Testing user register', function() {
        var postdata = {
            email: useremail,
            name: username,
            password: password,
            gender: 1
        };
        var info, code;
        before(function(done) {
            request.post('http://localhost:' + port + '/api/register/', {
                    json: postdata
                },
                function(error, response, body) {
                    console.log(response.statusCode);
                    code = response.statusCode;
                    if (!error && response.statusCode == 200) {
                        token = body.token;
                        info = body.userInfo;
                    } else {
                        console.log(error);
                    }
                    done();
                });

        });

        it('should register successfully', function() {
            expect(info.email).to.equal(useremail);
        });

    });

    describe('Testing email check', function() {
        var result;
        before(function(done) {
            request('http://localhost:' + port + '/api/user/emailcheck/' + existedEmail,
                function(error, response, body) {
                    console.log(response.statusCode);
                    if (!error && response.statusCode == 200) {
                        result = JSON.parse(body);
                        console.log(body);
                    }
                    done();
                });
        });
        it('email check should return existed email', function() {
            expect(result.email).to.equal(existedEmail);
        });

    });

    describe('Testing user login 1', function() {

        var postdata = {
            email: useremail,
            password: 'eatee-the-living'
        };
        var result, code;

        before(function(done) {
            request.post('http://localhost:' + port + '/api/login/', {
                    json: postdata
                },
                function(error, response, body) {
                    console.log(response.statusCode);
                    code = response.statusCode;
                    if (!error && response.statusCode == 200) {
                        result = body;
                    }
                    done();
                });
        });
        it('should login unsuccessfully', function() {
            //console.log(code);
            expect(code).to.equal(401);
        });


    });

    describe('Testing user login 2', function() {

        var postdata = {
            email: existedEmail,
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
            //console.log(result.token);
            expect(result).to.have.property('token');
        });


    });


    describe('Testing get user info 1', function() {
        var result, info, code;
        before(function(done) {
            request('http://localhost:' + port + '/api/user/' + existedEmail, {
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

        });

        it('should get user email successfully', function() {
            expect(result.email).to.equal(existedEmail);
        });

    });

    describe('Testing edit user info', function() {
        var result, code;
        var postdata = {
            email: existedEmail,
            gender: '0',
            name: username + 'Modi'
        };

        before(function(done) {
            request.put('http://localhost:' + port + '/api/user/' + existedEmail, {
                    json: postdata,
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                },
                function(error, response, body) {
                    code = response.statusCode; //console.log(response.statusCode);console.log(token);
                    if (!error && response.statusCode == 200) {
                        result = body; //console.log(result);

                    } else {
                        console.log(error);
                    }
                    done();
                });
        });

        before(function(done) {
            request('http://localhost:' + port + '/api/user/' + existedEmail, {
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

        });

        it('should get user modified gendor successfully', function() {
            expect(result).to.have.property('gender').and.to.equal(0);
        });
        it('should get user modified name successfully', function() {
            expect(result).to.have.property('name').and.to.equal(username + 'Modi');
        });

    });

    describe('Testing upload and change user portrait', function() {
        var result, code, mfile, filepath = __dirname + '/test.jpg';
        var fs = require('fs');
        if (!fs.existsSync(filepath)) {
            console.log('file not exist');
            it('file should exists', function() {
                expect(false).to.equal(true);
            });
            return;
        }

        try {
            mfile = fs.createReadStream(filepath);
        } catch (e) {
            //console.log(e);
            it('cannot read file', function() {
                expect(false).to.equal(true);
            });
            return;
        }

        var formdata = {
            file: mfile
        };

        before(function(done) {
            request.post({
                    url: 'http://localhost:' + port + '/api/user/uploads',
                    formData: formdata
                },
                function(error, response, body) {
                    code = response.statusCode;
                    if (!error && response.statusCode == 200) {
                        result = JSON.parse(body);
                        uploadedName = result.path;
                        //the uploadedName value cannot be passed to next test 
                        fs.renameSync(process.env.UPLOAD_DIR + '/' + uploadedName,
                            process.env.UPLOAD_DIR + '/testabc.jpg');
                    } else {
                        console.log(error);
                    }
                    done();
                });
        });

        it('should get upload filepath successfully', function() {

            expect(result).to.have.property('path');
        });


    });


    describe('Testing change user portrait with uploaded file', function() {
        var result;
        //the uploadedName value cannot be passed to this function!

        var postdata = {
            filename: 'testabc.jpg'
        };
        before(function(done) {

            request.post('http://localhost:' + port + '/api/user/portrait/' + existedEmail, {
                json: postdata,
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }, function(error, response, body) {
                code = response.statusCode;
                if (!error && response.statusCode == 200) {
                    result = body; //JSON.parse(body);
                    //console.log(result);
                } else {
                    console.log('error');
                }
                done();
            });
        });


        it('should change user portrait successfully', function() {
            expect(result).to.have.property('portrait');
        });

    });

    describe('Testing change user password to 88888888', function() {
        var result, code;
        //the uploadedName value cannot be passed to this function!

        var postdata = {
            newpassword: '88888888',
            oldpassword: 'eat-the-living'
        };
        before(function(done) {

            request.post('http://localhost:' + port + '/api/user/changepwd/' + existedEmail, {
                json: postdata,
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }, function(error, response, body) {
                code = response.statusCode;
                if (!error && response.statusCode == 200) {
                    result = body; //JSON.parse(body);
                    token = result;
                } else {
                    console.log(error);
                }
                done();
            });
        });

        it('should change user password successfully', function() {
            expect(result).not.to.be.empty;
        });

    });

    describe('Testing change user password back to ' + password, function() {
        var result, code;
        //the uploadedName value cannot be passed to this function!

        var postdata = {
            oldpassword: '88888888',
            newpassword: password
        };
        before(function(done) {

            request.post('http://localhost:' + port + '/api/user/changepwd/' + existedEmail, {
                json: postdata,
                headers: {
                    Authorization: 'Bearer ' + token
                }
            }, function(error, response, body) {
                code = response.statusCode;
                if (!error && response.statusCode == 200) {
                    result = body; //JSON.parse(body);
                    token = result;
                } else {
                    console.log(error);
                }
                done();
            });
        });

        it('should change user password successfully', function() {
            expect(result).not.to.be.empty;
        });

    });

});

describe('Testing get user with surname 周 list by page', function() {
    var postdata = {
        page: 1,
        pagesize: 2,
        queryCond: {
            gender: 1,
            name: '周',
            fuzzyname: true
        },
        sortCond: {}
    };

    before(function(done) {
        request.post('http://localhost:' + port + '/api/user/list/', {
            json: postdata
        }, function(error, response, body) {
            //code = response.statusCode;
            if (!error && response.statusCode == 200) {
                result = body; //console.log(result);//JSON.parse(body);
            } else {
                console.log(error);
            }
            done();
        });
    });

    it('should get ' + postdata.pagesize + ' users\' list successfully', function() {
        expect(result.userlist.length).to.equal(2);
    });

    it('should get users\' list with conditions successfully', function() {
        expect(result.userlist[1].gender).to.equal(1);
    });

});