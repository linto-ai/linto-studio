const debug = require('debug')('delivery:IoHandler:mqtt-events');

module.exports = function () {
  this.app.components['BrokerClient'].deliveryClient.on('error', () => {
    this.app.components['IoHandler'].brokerKo()
  });

  this.app.components['BrokerClient'].deliveryClient.on('offline', () => {
    setTimeout(() => {
      this.app.components['IoHandler'].brokerKo()
    }, 300) // We wait IoHandler component to be loaded
  });

  this.app.components['BrokerClient'].deliveryClient.on('ready', () => {
    setTimeout(() => {
      this.app.components['IoHandler'].brokerOk()
    }, 300); // We wait IoHandler component to be loaded
  });
}