module.exports = function (RED) {
  function PressureToWaterColumn(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", function (msg, send, done) {
      msg.payload = msg.payload.toLowerCase();
      send = send || function() { node.send.apply(node,arguments) };
      send(msg);

      if (done)
        done();
    });
  }
  RED.nodes.registerType("pressure-to-water-column", PressureToWaterColumn);
};
