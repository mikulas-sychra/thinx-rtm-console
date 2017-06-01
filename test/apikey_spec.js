// spec.js
var env = require('./environment.js');

describe('pages with login', function() {
  it('should log in and go to apikeys', function() {

	browser.waitForAngularEnabled(false);
    browser.get(env.baseUrl + '/app');
    browser.waitForAngularEnabled(true);

    element(by.css('a[href*="#/apikey"]')).click();
    element(by.css('[ng-click="resetModal()"]')).click();

    var newApiAlias = "test-key-alias";
    element(by.css('[name="newApikayAlias"]')).sendKeys(newApiAlias);
    element(by.buttonText("Create")).click();

    browser.waitForAngular();

    var newApiKey = element(by.css('[name="newApikey"]')).getAttribute('value');
    expect(newApiKey).not.toBe(null);

    element(by.buttonText("Close")).click();

    browser.sleep(1000);
    browser.waitForAngular();

    var apikeys = element.all(by.css('.portlet-body tr td div:first-of-type')).map(function (elm) {
        return elm.getText();
    });
    apikeys.then(function (result) {
        console.log(result);
        expect(result).toContain(newApiAlias);

        console.log("TODO: Remove test key..");
    });

  });
});