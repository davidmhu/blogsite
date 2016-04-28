describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get('/');

    expect(browser.getTitle()).toContain('Blogsite');
  });

  it('should have a title', function() {
    browser.get('/user/list');

    expect(browser.getTitle()).toContain('Blogsite:user\'s administration');
  });
});