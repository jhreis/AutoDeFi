var Migrations = artifacts.require("Migrations")
var SimpleStorage = artifacts.require("SimpleStorage")

module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(SimpleStorage)
}
