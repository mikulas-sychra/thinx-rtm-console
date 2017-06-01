// spec.js
var env = require('./environment.js');

describe('basic ui tests', function() {
  it('should go to apikeys, create key, check its presence and remove it', function() {

    // open page
	browser.waitForAngularEnabled(false);
    browser.get(env.baseUrl + '/app');
    browser.waitForAngularEnabled(true);

    // open new apikey modal and fill input
    element(by.css('a[href*="#/apikey"]')).click();
    element(by.css('[ng-click="resetModal()"]')).click();
    var newApiAlias = "test-key-alias";
    element(by.css('[name="newApikayAlias"]')).sendKeys(newApiAlias);

    // create api key
    element(by.buttonText("Create")).click();
    browser.waitForAngular();

    // check new key and close dialog
    var newApiKey = element(by.css('[name="newApikey"]')).getAttribute('value');
    expect(newApiKey).not.toBe(null);
    element(by.buttonText("Close")).click();

    // wait for modal close
    browser.sleep(1000);
    browser.waitForAngular();

    // remove new apikey
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