const debug = require('debug')(`delivery:BrokerClient`);
const { MqttClient, Component } = require('live-srt-lib')

class BrokerClient extends Component {

  static states = {
    CONNECTING: 'connecting',
    READY: 'ready',
    ERROR: 'error',
  };

  _state = null;

  constructor(app) {
    super(app);
    const { CONNECTING, READY, ERROR } = this.constructor.states;
    this.id = this.constructor.name;
    this.state = CONNECTING;


    // Combined pub and subs
    this.deliveryPub = 'delivery';
    this.deliverySubTemplates = [
      transcriberId => `transcriber/out/${transcriberId}/partial`,
      transcriberId => `transcriber/out/${transcriberId}/final`
    ];
    this.sessionPub = `session/out`;
    this.sessionSubs = [`session/in/+/#`];


    // Initialize delivery client
    this.deliveryClient = new MqttClient({ pub: this.deliveryPub, retain: false, uniqueId: 'delivery' });
    this.deliveryClient.on("ready", () => {
      this.state = READY;
    });
    this.deliveryClient.on("error", (err) => {
      this.state = ERROR;
    });

    // Initialize session client
    this.sessionClient = new MqttClient({ pub: this.sessionPub, subs: this.sessionSubs, retain: false, uniqueId: 'session-api' });
    this.sessionClient.on("ready", () => {
      this.state = READY;
      this.sessionClient.publishStatus();
    });
    this.sessionClient.on("error", (err) => {
      this.state = ERROR;
    });
    this.init(); // binds controllers, those will handle messages

  }

  subscribe(transcriberId) {
    debug(`Subscribe to transcriber ${transcriberId}`)
    for (const sub_template of this.sub_templates) {
      this.deliveryClient.subscribe(sub_template(transcriberId))
    }
  }

  unsubscribe(transcriberId) {
    debug(`Unsubscribe from transcriber ${transcriberId}`)
    for (const sub_template of this.sub_templates) {
      this.deliveryClient.unsubscribe(sub_template(transcriberId))
    }
  }
}

module.exports = app => new BrokerClient(app);
