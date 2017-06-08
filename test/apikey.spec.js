// spec.js
var env = require('./environment.js');
var newApikey = null;
var newApiAlias = "test-key-alias";
var newApikeyFingerprint = null;

describe('basic ui tests', function() {
  it('should navigate to apikeys and open new apikey modal', function() {

    // open page
	browser.waitForAngularEnabled(false);
    browser.get(env.baseUrl + '/app/');
    browser.waitForAngularEnabled(true);

    browser.driver.manage().window().maximize();

    // navigate to apikey view
    element(by.css('[ui-sref="apikey"]')).click();

    // open modal
    element(by.css('[ng-click="resetModal()"]')).click();

    browser.sleep(2000);
    browser.waitForAngular();
  });

  it('fill new apikey alias, submit, wait for confirmation and close modal', function() {
    // fill input
    element(by.css('[name="newApikayAlias"]')).sendKeys(newApiAlias);

    // create api key
    element(by.buttonText("Create")).click();
    browser.waitForAngular();

    // check new key and close dialog
    newApikey = element(by.css('[name="newApikey"]')).getAttribute('value');
    expect(newApikey).not.toBe(null);
    element(by.buttonText("Close")).click();

    // wait for modal close
    browser.sleep(2000);
    browser.waitForAngular();
  });

  it('should find new apikey on page', function() {
    // find apikey
    var apikeys = element.all(by.css('tbody tr td div:first-child')).map(function (elm) {
        return elm.getText();
    });

    apikeys.then(function (result) {        
        expect(result).toContain(newApiAlias);
    });
  });

  it('should remove new apikey', function() {
    console.log("TODO: Remove test key..");
    // remove new apikey

    var els = element.all(by.css('tbody tr td a[ng-click*=newApikeyFingerprint]'));
    els.filter(function(elem) {
      return elem.getText().then(function(text) {
        console.log(text);
        return text === 'should click';
      });
    }).click(); 

    element.all(by.css("tbody tr in names")).each(function (elm) {
    var link = elm.element(by.css("a[ng-click*=editName]"));
    link.click();

    // assertions/expectations
    });


  });

  

});