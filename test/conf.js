// conf.js
var env = require('./environment.js');

// This is the configuration file showing how a suite of tests might
// handle log-in using the onPrepare field.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/',

  onPrepare: function() {
    browser.driver.get(env.baseUrl + '/');

    browser.driver.findElement(by.name('username')).sendKeys('test');
    browser.driver.findElement(by.name('password')).sendKeys('tset');
    browser.driver.findElement(by.css('.login-form button[type="submit"]')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return /app/.test(url);
      });
    }, 10000);
  }
};