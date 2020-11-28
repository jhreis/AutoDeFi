// import Web3 from "web3"
// import SimpleStorage from "./contracts/SimpleStorage.json"
// import Generator from "./contracts/Generator.json"

// contracts: [
//   truffleArtifact, // A regular Truffle contract artifact
//   {
//     contractName: 'RegisteredContract',
//     web3Contract: new web3.eth.Contract(abi, address, {data: 'deployedBytecode' }) // An instance of a Web3 contract
//   }
// ]

// const USDC = {
//   ''
// }

const options: any = {
  web3: {
    block: false,
    // customProvider: new Web3("ws://localhost:8545"),
  },
  // contracts: [SimpleStorage, Generator],
  // events: {
  //   SimpleStorage: ["StorageSet"],
  //   Generator: ["FacadeCreated"],
  // },
}

export default options
