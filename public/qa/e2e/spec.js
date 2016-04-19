describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('http://localhost:3100/');

    expect(browser.getTitle()).toEqual('Blogsite:user\'s administation');
  });
});