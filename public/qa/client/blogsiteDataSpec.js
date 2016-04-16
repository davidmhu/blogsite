

describe('Service: blogsiteData', function() {
    // Instantiate a new version of my module before each test 
    beforeEach(module('blogsiteApp'));
    beforeEach(module('authmock'));
    beforeEach(module('blogsiteData'));
    var dataSvc,mockBackend;
    // Before each unit test, instantiate a new instance // of the controller 
    beforeEach(inject(function($httpBackend) {
        mockBackend=$httpBackend;
        mockBackend.expectGET('/api/user/emailcheck/')
        	.respond(200,{});
        dataSvc=blogsiteData;
        
    }));

    it('should have blogsiteData service', function() {
        
        	expect(dataSvc).toBeTruethy();
        
    });
    it('should have items available on load', function() {
        
        expect(blogsiteData.checkEmail('dise@dso.com')).toBeTruethy();
    });
    
});