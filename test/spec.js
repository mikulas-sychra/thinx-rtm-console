// spec.js
var env = require('./environment.js');

describe('pages with login', function() {
  it('should log in with a non-Angular page', function() {

	  browser.waitForAngularEnabled(false);
    browser.get(env.baseUrl + '/app/');
    browser.waitForAngularEnabled(true);

    expect(element(by.css('div.page-footer-inner')).getText()).toEqual('2017 © THiNX');
  });
});