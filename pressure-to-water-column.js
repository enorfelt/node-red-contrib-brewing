module.exports = function (RED) {

  const GRAVITY =  9.807;
  const VOLT = 4.096;

  function getDescendantProp(obj, desc) {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift()]));
    return obj;
  };

  function PressureToWaterColumn(config) {
    RED.nodes.createNode(this, config);
    
    this.valueProperty = config.valueProperty;
    this.voltageProperty = config.voltageProperty;
    this.pressureLow = config.pressureLow || 0.0;
    this.pressureHigh = config.pressureHigh || 6.0;
    this.voltLow = config.voltLow || 0.0;
    this.voltHigh = config.voltHigh || 5.0;
    this.sensorHight = config.sensorHight || 0;


    var node = this;
    var coefficientA = (node.pressureHigh - node.pressureLow) / (node.voltHigh - node.voltLow);
    var coefficientB = coefficientA * node.voltLow - node.pressureLow;

    node.on("input", function (msg, send, done) {
      var currentValue = getDescendantProp(msg, node.valueProperty);
      var currentVoltage = getDescendantProp(msg, node.voltageProperty);    
      
      
      if (!currentVoltage) {
        if (!currentValue) {
          if (done) {
            done("Neither voltage or value is supplied");
            return;
          }
        }

        currentVoltage = currentValue * VOLT / 32767;
      }

      var currentPressure = coefficientA * currentVoltage + coefficientB;
      var waterLevel = currentPressure / GRAVITY;
      waterLevel = waterLevel * 100 + node.sensorHight;

      msg.payload = waterLevel
      send = send || function() { node.send.apply(node, arguments) };
      send(msg);

      if (done)
        done();
    });
  };
  RED.nodes.registerType("pressure-to-water-column", PressureToWaterColumn);
};
