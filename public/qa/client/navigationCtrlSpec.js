

describe('Controll: navigation', function() {
    // Instantiate a new version of my module before each test 
    beforeEach(module('blogsiteApp'));
    var ctrl,mocksuth;
    // Before each unit test, instantiate a new instance // of the controller 
    beforeEach(module('authmock'));

    beforeEach(inject(function($controller) {
        
        ctrl=$controller('navigationCtrl');
        
    }));

    it('should have test variable', function() {
        	expect(ctrl.test).toEqual('123');
        
    });
    it('should have logout function', function() {
        
        	expect(ctrl.logout).toBeDefined();
        
    });
    /*it('should have items available on load', function() {
        
        expect(ctrl.checkEmail('dise@dso.com')).toBeTruethy();
    });*/
    
});