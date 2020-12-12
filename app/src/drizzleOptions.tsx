// eslint-disable-next-line @typescript-eslint/no-var-requires
const Generator = require("./contracts/Generator.json")

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SimpleStorage = require("./contracts/SimpleStorage.json")

// contracts: [
//   truffleArtifact, // A regular Truffle contract artifact
//   {
//     contractName: 'RegisteredContract',
//     web3Contract: new web3.eth.Contract(abi, address, {data: 'deployedBytecode' }) // An instance of a Web3 contract
//   }
// ]

const options: any = {
  polls: {
    accounts: 2000,
  },
  web3: {
    block: false,
    // customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [Generator, SimpleStorage],
  // events: {
  //   Generator: ["FacadeCreated"],
  // },
}

export default options
