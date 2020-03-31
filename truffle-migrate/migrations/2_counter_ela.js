const CounterELA = artifacts.require("CounterELA");

module.exports = function(deployer) {
  deployer.deploy(CounterELA);
};
