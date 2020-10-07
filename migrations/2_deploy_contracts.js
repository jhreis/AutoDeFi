const SimpleStorage = artifacts.require("SimpleStorage");
const Generator = artifacts.require("Generator");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Generator);
};
