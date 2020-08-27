var helper = require("node-red-node-test-helper");
var lowerNode = require("../pressure-to-water-column.js");
 
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
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'pressure-to-water-column');
      done();
    });
  });
 
  it('should make payload lower case', function (done) {
    var flow = [
      { id: "n1", type: "pressure-to-water-column", name: "pressure-to-water-column",wires:[["n2"]] },
      { id: "n2", type: "helper" }
    ];
    helper.load(lowerNode, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        msg.should.have.property('payload', 'uppercase');
        done();
      });
      n1.receive({ payload: "UpperCase" });
    });
  });
});