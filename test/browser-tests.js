var path = require('path');
var fs = require('fs');
var sauceConnectLauncher = require('sauce-connect-launcher');
var StaticServer = require('static-server');
var request = require('request');
var config = path.join(__dirname, './config.json');

if (!fs.existsSync(config) && !process.env.SAUCE_LABS_ACCESS_KEY) {
  console.error("Please define SAUCE_LABS_USERNAME and SAUCE_LABS_ACCESS_KEY in `test/config.js`.");
  console.error("See https://github.com/cfpb/cfpb-chart-builder#testing");
  process.exit(1);
}

if (process.env.SAUCE_LABS_USERNAME && process.env.SAUCE_LABS_ACCESS_KEY) {
  // Travis has Sauce Labs creds in an environment variable
  config = {
     SAUCE_LABS_USERNAME: process.env.SAUCE_LABS_USERNAME,
     SAUCE_LABS_ACCESS_KEY: process.env.SAUCE_LABS_ACCESS_KEY
  }
} else {
  // Read creds from config file
  config = require(config);
}

var SAUCE_LABS_USERNAME = config.SAUCE_LABS_USERNAME,
    SAUCE_LABS_ACCESS_KEY = config.SAUCE_LABS_ACCESS_KEY,
    CI_ENVIRONMENT = process.env.CI_ENVIRONMENT || '',
    STATIC_SERVER_PORT = 8089;

var server = new StaticServer({
  rootPath: path.join( __dirname, '../'),
  port: STATIC_SERVER_PORT
});

var sauceTests = [];

sauceConnectLauncher({
  username: SAUCE_LABS_USERNAME,
  accessKey: SAUCE_LABS_ACCESS_KEY
}, startServer);

function startServer() {
  server.start(startSauce);
}

function startSauce(err, process) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Local server listening to', STATIC_SERVER_PORT);
  console.log("Sauce Connect ready.");
  var opts = {
    url: `https://${SAUCE_LABS_USERNAME}:${SAUCE_LABS_ACCESS_KEY}@saucelabs.com/rest/v1/cct-sauce/js-tests`,
    method: "POST",
    json: {
        "platforms": [
            ["Windows 7", "internet explorer", "9"],
            ["Windows 7", "internet explorer", "10"],
            ["Windows 7", "firefox", "27"],
            ["Windows 7", "chrome", ""]
        ],
        "url": "http://localhost:" + STATIC_SERVER_PORT + "/test/?ci_environment=" + CI_ENVIRONMENT,
        "framework": "custom"
    }
  };
  request.post(opts, function(err, httpResponse, body) {
    if ( err || body.message === 'Not authorized' ) {
      return console.error( 'Error starting Sauce Labs tests.' );
      process.exit(1);
    }
    console.log("Tests started.");
    sauceTests = body['js tests'];
    checkSauce();
  });
}

function checkSauce() {
  var opts = {
    url: `https://${SAUCE_LABS_USERNAME}:${SAUCE_LABS_ACCESS_KEY}@saucelabs.com/rest/v1/cct-sauce/js-tests/status`,
    method: "POST",
    json: {
        "js tests": sauceTests
    }
  };
  setTimeout(function() {
    request.post(opts, function(err, httpResponse, body) {
      var failures = 0;
      if (body.completed) {
        console.log("Tests done.");
        body["js tests"].forEach((test) => {
          var errors;
          if (test.result.failed > 0) {
            errors = test.result.tests.map((result) => {
              return result.message;
            });
            failures++;
            return console.log(test.platform.join(" ") + " failed: " + errors.join(" "));
          }
          console.log(test.platform.join(" ") + " passed.");
        });
        if (failures > 0) {
          process.exit(1);
        }
        process.exit(0);
      } else {
        console.log("Tests still running... See status at https://saucelabs.com/u/" + SAUCE_LABS_USERNAME);
        checkSauce();
      }
    });
  }, 5000);
}
