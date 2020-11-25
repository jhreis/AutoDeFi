import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import logo from "./assets/logoBW2.png";
import logo_compound from "./assets/logo_compound.png";
import logo_curve from "./assets/logo_curve.png";
import logo_cream from "./assets/logo_cream.png";
import Web3 from "web3";

import CompoundFacade from "./contracts/CompoundFacade.json";

const { AccountData, ContractData, ContractForm } = newContextComponents;

const STATE = {
  noob: 1,
  collectInfo: 2,
  full: 3
}
const enableCollectInfo = true

export default ({ drizzle, drizzleState }) => {
  // destructure drizzle and drizzleState from props
  return (
    <div className="App">
      <div class="center">
      {/* <button class="unit" type="button" onClick={prop.handleSubmit}> */}
        {/* <button class="unit2" type=""> */}
              {/* <img src={logo_compound} height="24px" width="24px" /> */}
          <img class="main_logo" src={logo} alt="autodefi-logo" />
        {/* </button> */}
        <h1>AutoDeFi</h1>
        <h3 class="darkish">Set. Forget. Earn.</h3>
        {/* <div className="section"> */}
        {/* <h2>A few simple steps to setup automatic DeFi deposits!</h2> */}
        {/* <ol>
          <li>Create a DeFi Smart Account</li>
          <li>Provide API credentials and set recurring schedule</li>
          <li>Earn 🚀🌖</li>
        </ol> */}
        {/* </div> */}
      </div>
        
        {/* <h1>Automatic DeFi Deposits!</h1> */}

      {/* 
      A few simple steps to setup automatic DeFi deposits!

      1. Create a DeFi Smart Account
      2. Provide API credentials and set recurring schedule
      3. Earn 🚀🌖
      */}

{/* <form>
  
  <div class="segment">
    <h1>Sign up</h1>
  </div>
  
  <label>
    <input type="text" placeholder="Email Address"/>
  </label>
  <label>
    <input type="password" placeholder="Password"/>
  </label>
  <button class="red" type="button"><i class="icon ion-md-lock"></i> Log in</button>
  
  <div class="segment">
    <button class="unit" type="button"><i class="icon ion-md-arrow-back"></i></button>
    <button class="unit" type="button"><i class="icon ion-md-bookmark"></i></button>
    <button class="unit" type="button"><i class="icon ion-md-settings"></i></button>
  </div>
  
  <div class="input-group">
    <label>
      <input type="text" placeholder="Email Address"/>
    </label>
    <button class="unit" type="button"><i class="icon ion-md-search"></i></button>
  </div>
  
</form> */}

      <form>
        {/* <div class="segment"> */}
          <MainInput 
            drizzle={drizzle}
            drizzleState={drizzleState}
          />

        {/* </div> */}
      </form>
    </div>
  );
};

class MainInput extends React.Component {
  constructor(props, context) {
    super(props)

    console.log(props.drizzle.contracts)
    // this.contracts = context.drizzle.contracts

    this.state = {
      facadeAddress: null,
      state: STATE.noob
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
      const fallbackState = enableCollectInfo ? STATE.collectInfo : STATE.full
      this.setState({
        facadeAddress: newFacade,
        state: newFacade == null ? STATE.noob : fallbackState
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

    if (this.state.state == STATE.collectInfo) {
      const collectInfoClickHandler = () => {
        this.setState({
          state: STATE.full
        })
      }
      return <CollectInfoComponent clickHandler={collectInfoClickHandler} />
    }

    console.log("yoyoyo", this.state.facadeAddress)

    if (this.state.state == STATE.noob) {
      return (
        <GeneratorComponent
          drizzle={drizzle}
          drizzleState={drizzleState}
          facadeAddress={this.state.facadeAddress}
        />
      )
    }

    // if (this.state.facadeAddress) {
    if (this.state.state == STATE.full) {
      return <FacadeComponent 
                drizzle={drizzle}
                drizzleState={drizzleState}
                contractName={this.state.facadeAddress}
              />
    }
  }
}

class GeneratorComponent extends React.Component {
  render() {
    const { drizzle, drizzleState, facadeAddress } = this.props

    let generateBtn = (prop) => {
      return (
        <div>
          <div class="segment">
            <h2>Create Account</h2>
            <p class="skinny">
              Please choose which Dapp you would like your account to interact with.
            </p>
          {/* </div> */}
          {/* <div class="segment"> */}
            <button class="unit" type="button" onClick={prop.handleSubmit}>
              <img src={logo_compound} height="24px" width="24px" />
            </button>
            <button class="unit" type="button" onClick={prop.handleSubmit}>
              <img src={logo_curve} height="24px" width="24px" />
            </button>
            <button class="unit" type="button" onClick={prop.handleSubmit}>
              <img src={logo_cream} height="24px" width="24px" />
            </button>
          </div>
        {/* <a 
          href="#" 
          onClick={prop.handleSubmit} 
          class="myButton">Create new DeFi account:</a> */}

        </div>
      )

      // return (
      // <button
      //   key="submit"
      //   className="pure-button"
      //   type="button"
      //   onClick={prop.handleSubmit}
      // >
      //   Make
      // </button>)
    }

    let noFacade = (
      <div>
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
        {noFacade}
        {facadeAddress}
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

    const underlyingBalance = <ContractData drizzle={drizzle} drizzleState={drizzleState} contract={contractName} method="underlyingBalance" />
    const underlyingAssetSymbol = <ContractData drizzle={drizzle} drizzleState={drizzleState} contract={contractName} method="underlyingAssetSymbol" />

    const mintedBalance = <ContractData drizzle={drizzle} drizzleState={drizzleState} contract={contractName} method="mintedBalance" />
    const mintedAssetSymbol = <ContractData drizzle={drizzle} drizzleState={drizzleState} contract={contractName} method="mintedAssetSymbol" />


    const depositRender = (prop) => { return <button key="submit" className="pure-button" type="button" onClick={prop.handleSubmit}>Early Deposit</button> }
    const withdrawRender = (prop) => { return <button key="submit" className="pure-button" type="button" onClick={prop.handleSubmit}>Withdraw All</button> }
    const deposit = <ContractForm drizzle={drizzle} contract={contractName} method="deposit" render={depositRender} />
    const withdraw = <ContractForm drizzle={drizzle} contract={contractName} method="withdraw" render={withdrawRender} />

    // Deposit
    // USDC Balance
    // Withdraw
    // cUSDC Balance
    return (
      <div>
        <div class="segment">
          <h2>Your Account</h2>
          <p class="skinny truncate">
            {contractName}
            {/* Please choose which Dapp you would like your account to interact with. */}
          </p>
          {/* <h1>Your Account</h1> */}
          
          {/* <h3>Deposit:</h3> */}
        </div>

        <div class="segment">
          <h2>Balances</h2>

          <p>
        {/* <div class="non-segment"> */}
          <div class="input-group center">
            <label>
              {/* <input type="text" placeholder="Email Address"/> */}
              <div class="bottom-buffer">{underlyingBalance} {underlyingAssetSymbol}</div>
              {/* <br/> */}
              <div class="bottom-buffer">{deposit}</div>
            </label>
            <label>
              {/* <input type="text" placeholder="Email Address"/> */}
              {/* Balance: {underlyingBalance} {underlyingAssetSymbol} */}
              <div class="bottom-buffer">{mintedBalance} {mintedAssetSymbol}</div>
              {/* <br/> */}
              <div class="bottom-buffer">{withdraw}</div>
            </label>
            {/* <button class="unit" type="button"><i class="icon ion-md-search"></i></button> */}
          </div>
          </p>
        </div>
        {/* </div> */}
        {/* <strong>Danger!</strong>
          <ContractForm
            drizzle={drizzle}
            contract="Generator"
            method="destroyFacade"
        /> */}
      </div>
    )
    
  }
}

class CollectInfoComponent extends React.Component {
  render() {
    return (
      <div class="segment">
        <h3>Coinbase API Information</h3>
        <label>
          <input type="password" placeholder="Passphrase"/>
        </label>
        <label>
          <input type="password" placeholder="Secret"/>
        </label>
        <label>
          <input type="password" placeholder="Key"/>
        </label>

        <h3>Recurring Schedule</h3>
        <label>
          <input type="number" placeholder="Amount in Dollars"/>
        </label>
        <label>
          <input type="number" placeholder="Frequency in Days"/>
        </label>
        <button class="green" type="button" onClick={this.props.clickHandler}><i class="icon ion-md-lock"></i>Submit</button>
      </div>
    )
  }
}