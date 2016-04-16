describe('Service: blogsiteData', function() {
    // Instantiate a new version of my module before each test 
    beforeEach(module('blogsiteApp'));
    beforeEach(module('authmock'));
    var dataSvc, mockBackend;
    // Before each unit test, instantiate a new instance // of the controller 
    beforeEach(inject(function($httpBackend) {
        mockBackend = $httpBackend;
        mockBackend.when('GET','/api/user/emailcheck/dise@dso.com')
            .respond(200, {data:'ddd'});
        


    }));

    it('should have blogsiteData service', inject(function(blogsiteData) {
        expect(blogsiteData).toBeDefined();
        expect(blogsiteData.checkEmail).toBeDefined();
    }));

    it('should have blogsiteData.checkEmail',
        inject(['blogsiteData',
            function(blogdata) {
                //spyOn(blogdata,'checkEmail').andReturn('Bonjour');
                //mockBackend.flush();
                var kk = blogdata.checkEmail('dise@dso.com');
                //mockBackend.flush();
                expect(kk).toBeNull();
            }
        ]));
    //expect(dataSvc.checkEmail('dise@dso.com')).toBeTruethy();


});