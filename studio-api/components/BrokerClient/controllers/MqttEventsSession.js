const debug = require('debug')('session-api:BrokerClient:mqtt-events-session');

//Deals with MQTT messages
//here, "this" is bound to the BrokerClient component
module.exports = function () {
  this.sessionClient.on("message", (topic, message) => {
    const [type, ...parts] = topic.split('/');
    switch (type) {
      case 'session':
        const [direction, sessionId, action] = parts;
        if (direction === 'in') {
          // those events are consumed inside Webserver waitAckSessionCreation method
          switch (action) {
            case 'ack_creation':
              // Session successfully created
              // session is the session object in model that was updated by the scheduler (transcribers, channels, delivery infos, etc.)
              this.app.components['WebServer'].emit("session_ack_creation", sessionId);
              break;
            case 'reject_creation':
              this.app.components['WebServer'].emit("session_reject_creation", JSON.parse(message.toString()));
          }
        }
        break;
      default:
        debug(`Received message for unknown type ${type}`);
    }
  });
}