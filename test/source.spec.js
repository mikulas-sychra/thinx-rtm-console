// spec.js
var env = require('./environment.js');

var newSourceUrl = "git@github.com:suculent/thinx-firmware-esp8266.git";
var newSourceAlias = "test-source-alias";

describe('basic ui tests', function() {
  it('should navigate to sources and open new source modal', function() {

    // open page
	browser.waitForAngularEnabled(false);
    browser.get(env.baseUrl + '/app/');
    browser.waitForAngularEnabled(true);

    browser.driver.manage().window().maximize();

    // navigate to apikey view
    element(by.css('[ui-sref="sources"]')).click();

    // open modal
    element(by.css('[ng-click="resetModal()"]')).click();

    browser.sleep(2000);
    browser.waitForAngular();
  });

  it('fill new source values, wait for confirmation and close modal', function() {
    // fill input
    element(by.css('[name="newSourceUrl"]')).sendKeys(newSourceUrl);
    element(by.css('[name="newSourceAlias"]')).sendKeys(newSourceAlias);

    // create api key
    element(by.buttonText("Submit")).click();

    // wait for modal close
    browser.sleep(2000);
    browser.waitForAngular();
  });

  it('should find new source on page', function() {
    // find apikey
    var sources = element.all(by.css('tbody tr td div:first-child')).map(function (elm) {
        return elm.getText();
    });

    apikeys.then(function (result) {
        expect(result).toContain(newSourceAlias);
    });
  });

  it('should remove new source', function() {

    var checkitems = element.all(by.css('[ng-click*=checkItem]'));

    checkitems.then(function (results) {
        console.log("rows found: ", results.length);
        for (var i in results) {
          var resultAlias = results[i].element(by.css('div:first-child'));
          resultAlias.getText().then(function (text) {
              if (text == newSourceAlias) {
                  console.log("selecting element for removal: ", text);
                  results[i].click();
                  browser.sleep(1000);
                  element(by.css('[ng-click*=revokeSources]')).click();
              }
          });
        }
    });

  });
});
