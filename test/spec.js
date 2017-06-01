// spec.js
var env = require('./environment.js');

describe('pages with login', function() {
  it('should log in with a non-Angular page', function() {

	  browser.waitForAngularEnabled(false);

    browser.get(env.baseUrl + '/app/');

    browser.waitForAngularEnabled(true);

    expect(element(by.css('div.page-footer-inner')).getText()).toEqual('2017 © THiNX');

    //expect(rootScope.profile.owner.toBe('eaabae0d5165c5db4c46c3cb6f062938802f58d9b88a1b46ed69421809f0bf7f'));

    // Make sure the cookie is still set.
    //browser.manage().getCookie('testcookie').then(function(cookie) {
//      expect(cookie.value).toEqual('Jane-1234');
    //});

    //browser.waitForAngularEnabled(true);
	//browser.get('/page-containing-angular.html');

  });
});