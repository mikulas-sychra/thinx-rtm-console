// spec.js
var env = require('./environment.js');

describe('pages with login', function() {
  it('should log in with a non-Angular page', function() {


	

	browser.waitForAngularEnabled(false);

    browser.get(env.baseUrl + '/');

    var angularElement = element(by.css('.page-title'));
    expect(angularElement.getText()).toEqual('Dashboard');

    // Make sure the cookie is still set.
    //browser.manage().getCookie('testcookie').then(function(cookie) {
//      expect(cookie.value).toEqual('Jane-1234');
    //});

    //browser.waitForAngularEnabled(true);
	//browser.get('/page-containing-angular.html');

  });
});