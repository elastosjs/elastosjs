const RelayHub = artifacts.require("RelayHub");

module.exports = function(deployer) {
  deployer.deploy(RelayHub);
};
