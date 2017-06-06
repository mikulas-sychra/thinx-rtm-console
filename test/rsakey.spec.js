// spec.js
var env = require('./environment.js');
// var newRsakey = null;
var rsakeyAlias = "test-rsakey-alias";
var rsakeyValue = "test-rsakey-value-1234567890";

// var newRsakeyFingerprint = null;

describe('basic ui tests', function() {
  it('should navigate to rsakeys and open new rsakey modal', function() {

    // open page
	browser.waitForAngularEnabled(false);
    browser.get(env.baseUrl + '/app/');
    browser.waitForAngularEnabled(true);

    browser.driver.manage().window().maximize();

    // navigate to apikey view
    element(by.css('[ui-sref="rsakey"]')).click();

    // open modal
    element(by.css('[ng-click="resetModal()"]')).click();

    browser.sleep(2000);
    browser.waitForAngular();
  });

  it('fill new rsakey alias, submit (may also check modal close event on success)', function() {
    // fill input
    element(by.css('[name="rsakeyAlias"]')).sendKeys(rsakeyAlias);
    element(by.css('[name="rsakeyValue"]')).sendKeys(rsakeyValue);

    // create api key
    element(by.buttonText("Submit")).click();
    browser.waitForAngular();

    // check new key and close dialog
    // newApiKey = element(by.css('[name="newApikey"]')).getAttribute('value');

    // TODO: expect(newApiKey).not.toBe(null);
    // element(by.buttonText("Close")).click();

    // wait for modal close
    browser.sleep(2000);
    browser.waitForAngular();
  });

  it('should find new rsakey on page', function() {
    var apikeys = element.all(by.css('tbody tr td div:first-child')).map(function (elm) {
        return elm.getText();
    });

    apikeys.then(function (result) {        
        expect(result).toContain(rsakeyAlias);
    });
  });

  it('should select new rsakey row, then click on delete icon', function() {
    // find apikey
    var apikeys = element.all(by.css('tbody tr td div:first-child')).map(function (elm) {
        return elm.getText();
    });

    apikeys.then(function (result) {        
        console.log("result: ", result;
    });
  });

});