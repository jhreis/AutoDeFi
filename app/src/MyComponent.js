import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import logo from "./logo.png";
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
          foo="test?"
        />

        {/* <p>
          <strong>Generate: </strong>
          <ContractForm
            drizzle={drizzle}
            contract="Generator"
            method="generateNewFacade"
          />

          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="Generator"
            method="facadeInstances"
            methodArgs={[drizzleState.accounts[0]]}
          />


        </p> */}
      </div>

      {/* <div className="section">
        <h2>ComplexStorage</h2>
        <p>
          Finally this contract shows data types with additional considerations.
          Note in the code the strings below are converted from bytes to UTF-8
          strings and the device data struct is iterated as a list.
        </p>
        <p>
          <strong>String 1: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ComplexStorage"
            method="string1"
            toUtf8
          />
        </p>
        <p>
          <strong>String 2: </strong>
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="ComplexStorage"
            method="string2"
            toUtf8
          />
        </p>
        <strong>Single Device Data: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="ComplexStorage"
          method="singleDD"
        />
      </div> */}
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
      let web3Contract = new web3.eth.Contract(CompoundFacade.abi, newFacade)
      const contractConfig = { web3Contract, contractName: newFacade }
      
      // let r = await web3Contract

      let events = ["Deposit", "Withdraw"]
      nextProps.drizzle.addContract(contractConfig, events)
      console.log("Added new contract", newFacade, "added?", web3Contract)
      
      
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
    const { foo, drizzle, drizzleState } = this.props
    const userWallet = drizzleState.accounts[0]

    // const state = drizzle.store.getState()

    let facadeAddress = null
    if (facadeAddress) {
      console.log("test", facadeAddress)
    }

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
      <strong>Generate: {foo}</strong>
      <ContractForm
        drizzle={drizzle}
        contract="Generator"
        method="generateNewFacade"
      />

      <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="Generator"
        method="facadeInstances"
        methodArgs={[userWallet]}
      />

      {facadeComponent}
    </div>
    )
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
      </div>
    )



  }
}