const path = require("path")

module.exports = {
  compilers: {
    solc: {
      version: "^0.7.0",
    },
  },

  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    develop: {
      // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    // Since I deploy rinkeby from local blockchain instance, this is setup the same as develop, but requires a unique name for identifying trading pairs
    rinkeby: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
  },
}
