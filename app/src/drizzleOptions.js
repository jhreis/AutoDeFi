import Web3 from "web3";
import SimpleStorage from "./contracts/SimpleStorage.json";
import Generator from "./contracts/Generator.json";


const options = {
  web3: {
    block: false,
    // customProvider: new Web3("ws://localhost:8545"),
  },
  contracts: [SimpleStorage, Generator],
  events: {
    SimpleStorage: ["StorageSet"],
    Generator: ["FacadeCreated"]
  },
};

export default options;
