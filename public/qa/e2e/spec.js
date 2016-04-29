describe('Protractor Test', function() {
  var password = 'eat-the-living';
  var pinyinDict = require('../hanziDict');
  var uploadedName, randomInt, username = '',
    useremail = '',
    d = new Date(),
    password = 'eat-the-living';
  for (var i = 0; i < 3; i++) {
    randomInt = Math.floor(Math.random() * pinyinDict.hanzi.length);
    username += pinyinDict.hanzi[randomInt];
    useremail += pinyinDict.pinyin[randomInt];
  }
  useremail += d.toLocaleString().substr(2, 19).replace(/ |:/g, '') + '@blogsite.com';
  console.log(useremail);

  describe('Register Test', function() {
    var register = element(by.id('registerlink'));
    var password1 = element(by.id('password1'));
    var password2 = element(by.id('password2'));
    var emailInput = element(by.model('vm.user.email'));
    var nameInput = element(by.model('vm.user.name'));
    var genderradio = element(by.id('gender1'));
    var registerbtn = element(by.id('registerbtn'));

    browser.get('http://localhost:3100/');

    it('should see register link', function() {
      expect(register.isPresent()).toBe(true);
    });

    it('should see register page', function() {
      register.click();
      nameInput.sendKeys(username);
      emailInput.sendKeys(useremail);
      password1.sendKeys(password);
      password2.sendKeys(password);
      genderradio.click();
      expect(nameInput.evaluate("vm.user.name")).toEqual(username);
      expect(emailInput.evaluate("vm.user.email")).toEqual(useremail);
      expect(element(by.id('gender1')).evaluate("vm.user.gender")).toEqual('1');
      expect(registerbtn.isPresent()).toBe(true);
    });

    it('should see register page', function() {
      registerbtn.click();
      expect(element(by.css('.gendername')).isPresent()).toBe(true);
    });

    it('logout', function() {      
      expect(element(by.id('logout')).isPresent()).toBe(true);
      expect(element(by.binding('navvm.currentUser.name')).isPresent()).toBe(true);
      element(by.binding('navvm.currentUser.name')).click();
      element(by.id('logout')).click();
    });

    it('should have a email input and password input', function() {
		var emailInput = element(by.model('vm.credentials.email'));
    	browser.get('http://localhost:3100/');
    	expect(emailInput.isPresent()).toBe(true);
    });

  });

  xdescribe('Login Test', function() {
    var emailInput = element(by.model('vm.credentials.email'));
    var passwordInput = element(by.id('password'));
    var submitBtn = element(by.id('submitbtn'));
    //var useremail='admin@blogsite.com';

    browser.get('http://localhost:3100/');

    it('should have a email input and password input', function() {
      
      emailInput.sendKeys(useremail);
      passwordInput.sendKeys(password);

      expect(emailInput.evaluate('vm.credentials.email')).toEqual(useremail);
      expect(passwordInput.evaluate('vm.credentials.password')).toEqual(password);
    });

    it('should have a submit button', function() {
      expect(submitBtn.isPresent()).toBe(true);
    });

    it('should show user info page', function() {
      submitBtn.click();
      expect(browser.getCurrentUrl()).toBe('http://localhost:3100/');
      expect(element(by.css('.gendername')).isPresent()).toBe(true);
    });
  });

});