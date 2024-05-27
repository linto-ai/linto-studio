const debug = require('debug')('delivery:IoHandler:mqtt-events');

module.exports = function () {
  this.app.components['BrokerClient'].deliveryClient.on('error', () => {
    this.app.components['IoHandler'].brokerKo()
  });

  this.app.components['BrokerClient'].deliveryClient.on('offline', () => {
    this.app.components['IoHandler'].brokerKo()
  });

  this.app.components['BrokerClient'].deliveryClient.on('ready', () => {
    this.app.components['IoHandler'].brokerOk()
  });
}