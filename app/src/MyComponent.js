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
      <div>
        <img src={logo} alt="drizzle-logo" />
        <h1>Drizzle Examples</h1>
        <p>
          Examples of how to get started with Drizzle in various situations.
        </p>
      </div>

      <div className="section">
        <h2>Active Account</h2>
        <AccountData
          drizzle={drizzle}
          drizzleState={drizzleState}
          accountIndex={0}
          units="ether"
          precision={3}
        />
      </div>

      <div className="section">
        <h2>SimpleStorage</h2>
        <p>
          This shows a simple ContractData component with no arguments, along
          with a form to set its value.
        </p>
        <p>
          <strong>Stored Value: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="SimpleStorage"
            method="storedData"
          />
        </p>
        <ContractForm drizzle={drizzle} contract="SimpleStorage" method="set" />
      </div>

      <div className="section">
        <h2>Generate Your Personal Compound Contract</h2>
        <p>
          Here we have a form with custom, friendly labels. Also note the token
          symbol will not display a loading indicator. We've suppressed it with
          the <code>hideIndicator</code> prop because we know this variable is
          constant.
        </p>

        <Test 
          drizzle={drizzle}
          drizzleState={drizzleState}
        />
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
      let web3 = new Web3()
      let web3Contract = new web3.eth.Contract(CompoundFacade.abi, newFacade, { from: nextProps.drizzleState.accounts[0] })
      console.log("asdfasdf", nextProps.drizzle.web3.currentProvider)
      web3Contract.setProvider(nextProps.drizzle.web3.currentProvider);
      const contractConfig = { web3Contract, contractName: newFacade }
      
      // let r = await web3Contract

      let events = ["Deposit", "Withdraw"]
      nextProps.drizzle.addContract(contractConfig, events)
      console.log("Added new contract", newFacade, "added?", web3Contract)
      
      /**
       * 
        * options - Object (optional): The options of the contract. Some are used as fallbacks for calls and transactions:
          from - String: The address transactions should be made from.
          gasPrice - String: The gas price in wei to use for transactions.
          gas - Number: The maximum gas provided for a transaction (gas limit).
          data - String: The byte code of the contract. Used when the contract gets deployed.
       * 
       */
      
      // Attempt to remove old one
      const oldFacade = this.state.facadeAddress
      if (oldFacade) {
        nextProps.drizzle.deleteContract(oldFacade)
        console.log("Removed old contract", oldFacade)
      }

      // Update the state
      this.setState({
        facadeAddress: newFacade
      })
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

    let noFacade = (
      <div>
        <strong>Generate: </strong>
        <ContractForm
          drizzle={drizzle}
          contract="Generator"
          method="generateNewFacade"
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

    return (
      <div>
        <strong>Deposit: </strong>
        <ContractForm
          drizzle={drizzle}
          contract={contractName}
          method="deposit"
        />

        <ContractForm
          drizzle={drizzle}
          contract={contractName}
          method="withdraw"
        />
      </div>
    )



  }
}