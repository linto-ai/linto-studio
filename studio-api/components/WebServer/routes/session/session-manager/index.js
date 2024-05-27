const debug = require('debug')('session-api:router:api-docs');

module.exports = (webserver) => {
    return [
        ...require('./transcriber_profiles.js')(webserver),
        ...require('./healthcheck.js')(webserver),
        ...require('./sessions.js')(webserver),
    ];
}