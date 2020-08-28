var should = require("should");
var helper = require("node-red-node-test-helper");
var pressureToWc = require("../pressure-to-water-column.js");
 
helper.init(require.resolve('node-red'));
 
describe('pressure-to-water-column Node', function () {
 
  beforeEach(function (done) {
      helper.startServer(done);
  });
 
  afterEach(function (done) {
      helper.unload();
      helper.stopServer(done);
  });
 
  it('should be loaded', function (done) {
    var flow = [{ id: "n1", type: "pressure-to-water-column", name: "pressure-to-water-column" }];
    helper.load(pressureToWc, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'pressure-to-water-column');
      done();
    });
  });
 
  it('should calculate water column', function (done) {
    var flow = [
      { id: "n1",
        type: "pressure-to-water-column",
        name: "pressure-to-water-column",
        valueProperty: "payload.value",
        voltageProperty: "payload.voltage",
        wires:[["n2"]] 
      },
      { id: "n2", type: "helper" }
    ];
    helper.load(pressureToWc, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.should.have.property('payload', 61.180789232181084);
        done();
      });
      n1.receive({ payload: { value: 32767, voltage: 5.0 } });
    });
  });

  it('should calculate water column with only value supplied', function (done) {
    var flow = [
      { id: "n1",
        type: "pressure-to-water-column",
        name: "pressure-to-water-column",
        valueProperty: "payload.value",
        voltageProperty: "payload.voltage",
        wires:[["n2"]] 
      },
      { id: "n2", type: "helper" }
    ];
    helper.load(pressureToWc, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");

      
      n2.on("input", function (msg) {
        msg.should.have.property('payload', 50.11930253900274);
        done();
      });
      n1.receive({ payload: { value: 32767 } });
    });
  });

  it('should call done with error when no payload', function (done) {
    var flow = [
      { id: "n1",
        type: "pressure-to-water-column",
        name: "pressure-to-water-column",
        valueProperty: "payload.value",
        voltageProperty: "payload.voltage",
        wires:[["n2"]] 
      },
      { id: "n2", type: "helper" }
    ];
    helper.load(pressureToWc, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");

      
      n2.on("input", function (msg) {
        done(new Error("No message should have been sent"));
      });
      n1.error = function(message) {
        message.should.equal('Neither voltage or value is supplied');
        done();
      }
      n1.emit("input", { payload: { } });
      
    });
  });
});