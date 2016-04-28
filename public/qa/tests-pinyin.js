var pinyin = require('./pinyin.js');
var expect = require('chai').expect;
var pinyinDict = require('./hanziDict');
// We're going to make requests to http://localhost/register
// Which will be routed to our test server localhost:3000


describe('中文转拼音的测试', function() {
    console.log(pinyinDict.hanzi.length);
    var randomInt, testHanzi='', testPinyin='';

    
        for (var i = 0; i < 25; i++) {
            randomInt = Math.floor(Math.random() * pinyinDict.hanzi.length);
            console.log(i+':'+randomInt);
            testHanzi += pinyinDict.hanzi[randomInt];
            testPinyin += pinyinDict.pinyin[randomInt];
        }
        

    it(testHanzi + ' 拼音应该等于 ' + testPinyin, function() {
        //console.log(pinyin);
        expect(pinyin.getFullChars(testHanzi).toLowerCase()).to.be.equal(testPinyin);
        //expect(pinyin.add('1222')).to.be.equal('123');
    });
});