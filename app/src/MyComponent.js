import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import logo from "./assets/logo.png";
import Web3 from "web3";

import CompoundFacade from "./contracts/CompoundFacade.json";

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props
  return (
    <div className="App">
      <div class="center">
        <img src={logo} alt="drizzle-logo" />
        <h1>Automatic DeFi Deposits!</h1>
        <h2>Set. Forget. Earn.</h2>
        <div className="section">
        <h2>A few simple steps to setup automatic DeFi deposits!</h2>
        <p>
          <ol>
            <li>Create a DeFi Smart Account</li>
            <li>Provide API credentials and set recurring schedule</li>
            <li>Earn 🚀🌖</li>
          </ol>
        </p>
        </div>
      </div>
        
        {/* <h1>Automatic DeFi Deposits!</h1> */}
        
        <div class="shade2"></div>

      {/* 
      A few simple steps to setup automatic DeFi deposits!

      1. Create a DeFi Smart Account
      2. Provide API credentials and set recurring schedule
      3. Earn 🚀🌖
      */}
      <div className="section" class="shade2">
        <div class="blackboard">
          <div class="form">
            <label>adsf</label>
            <Test 
              drizzle={drizzle}
              drizzleState={drizzleState}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

class Test extends React.Component {
  constructor(props, context) {
    super(props)

    console.log(props.drizzle.contracts)
    // this.contracts = context.drizzle.contracts

    this.state = {
      facadeAddress: null
    }
  }

  is0Address(address) {
    // TODO: Future improvement
    // web3.toBigNumber(address).isZero()
    return address == '0x0000000000000000000000000000000000000000'
  }

  async facadeAddress(props) {
    const facadeAddress = props.drizzleState.accounts[0]
    let address = await props.drizzle.contracts.Generator.methods.facadeInstances(facadeAddress).call()
    if (this.is0Address(address)) { return null }
    return address
  }

  // Will not fix legacy component
  // eslint-disable-next-line react/no-deprecated
  async componentWillReceiveProps(nextProps) {

    

    const newFacade = await this.facadeAddress(nextProps)


    if (this.state.facadeAddress != newFacade) {
      console.log("Updating state to", newFacade, "from", this.state.facadeAddress)

      // Adding new contract!
      if (newFacade != null) {
        console.log("Generating new facade", newFacade)
        let web3 = new Web3()
        let web3Contract = new web3.eth.Contract(CompoundFacade.abi, newFacade, { from: nextProps.drizzleState.accounts[0] })
        console.log("asdfasdf", nextProps.drizzle.web3.currentProvider)
        web3Contract.setProvider(nextProps.drizzle.web3.currentProvider);
        const contractConfig = { web3Contract, contractName: newFacade }

        let events = ["Deposit", "Withdraw"]
        nextProps.drizzle.addContract(contractConfig, events)
        console.log("Added new contract", newFacade, "added?", web3Contract)
      } else {
        console.log("New facade is null, skipping")
      }
      
      /**
       * 
        * options - Object (optional): The options of the contract. Some are used as fallbacks for calls and transactions:
          from - String: The address transactions should be made from.
          gasPrice - String: The gas price in wei to use for transactions.
          gas - Number: The maximum gas provided for a transaction (gas limit).
          data - String: The byte code of the contract. Used when the contract gets deployed.
       * 
       */

      // Important to update state before removing old facade to prevent state being misaligned
      const oldFacade = this.state.facadeAddress
      this.setState({
        facadeAddress: newFacade
      })
      
      // Attempt to remove old one
      if (oldFacade) {
        nextProps.drizzle.deleteContract(oldFacade)
        console.log("Removed old contract", oldFacade)
      } else {
        console.log("No old facade, skipping deletion")
      }
    }
  }

  render() {
    const { drizzle, drizzleState } = this.props
    const userWallet = drizzleState.accounts[0]

    // var displayData = this.props.contracts["Generator"]["facadeInstances"][this.state.dataKey].value;
    // drizzle.contracts["Generator"].methods["facadeInstances"].cacheCall(...[facadeAddress])

    let facadeComponent = null

    console.log("yoyoyo", this.state.facadeAddress)
    if (this.state.facadeAddress) {
      facadeComponent = <FacadeComponent 
                          drizzle={drizzle}
                          drizzleState={drizzleState}
                          contractName={this.state.facadeAddress}
                        />
    }

    return (
    <div>
      <GeneratorComponent
        drizzle={drizzle}
        drizzleState={drizzleState}
        facadeAddress={this.state.facadeAddress}
      />

      {facadeComponent}
    </div>
    )
  }
}

class GeneratorComponent extends React.Component {
  render() {
    const { drizzle, drizzleState, facadeAddress } = this.props

    let generateBtn = (prop) => {
      return (
      <button
        key="submit"
        className="pure-button"
        type="button"
        onClick={prop.handleSubmit}
      >
        Make
      </button>)
    }

    let noFacade = (
      <div>
        <label>Generate:</label>
        <ContractForm
          drizzle={drizzle}
          contract="Generator"
          method="generateNewFacade"
          render={generateBtn}
        />
      </div>
    )

    let hasFacade = (
      <div>
        {/* TODO: Remove at some point */}
        {noFacade}

        {facadeAddress}
        
        {/* Not actually needed: */}
        {/* <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="Generator"
          method="facadeInstances"
          methodArgs={[drizzleState.accounts[0]]}
        /> */}
      </div>
    )

    return facadeAddress ? hasFacade : noFacade
  }
}

class FacadeComponent extends React.Component {
  render() {
    const { drizzle, drizzleState, contractName } = this.props
      /*
      - Have just generated the new contract interface
      - Need to render child tremplate
      - Add contract to Drizzle, pass data to child, and render contents dyncamilly
      */

    // Deposit
    // USDC Balance
    // Withdraw
    // cUSDC Balance
    return (
      <div>
        <strong>Deposit:</strong>

        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={contractName}
          method="underlyingAssetSymbol"
        />

        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={contractName}
          method="underlyingBalance"
        />

        <ContractForm
          drizzle={drizzle}
          contract={contractName}
          method="deposit"
        />

        <strong>Withdraw All Funds:</strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={contractName}
          method="mintedAssetSymbol"
        />

        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract={contractName}
          method="mintedBalance"
        />

        <ContractForm
          drizzle={drizzle}
          contract={contractName}
          method="withdraw"
        />

        <strong>Destroy facade, poof!:</strong>
          <ContractForm
            drizzle={drizzle}
            contract="Generator"
            method="destroyFacade"
        />
      </div>
    )



  }
}