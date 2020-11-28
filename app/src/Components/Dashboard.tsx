import React from "react"
import { newContextComponents } from "@drizzle/react-components"

import MainInput from "./MainInput"

// import logo from "./assets/logoBW2.png"
// import logo_compound from "./assets/logo_compound.png"
// import logo_curve from "./assets/logo_curve.png"
// import logo_cream from "./assets/logo_cream.png"
// import Web3 from "web3"

// import CompoundFacade from "./contracts/CompoundFacade.json"

const { AccountData, ContractData, ContractForm } = newContextComponents

const enableCollectInfo = true

interface Props {
  drizzle: any
  drizzleState: any
}

export default function Dashboard({ drizzle, drizzleState }: Props) {
  console.log("test", drizzleState.accounts)

  return (
    <div className="App">
      <div className="center">
        {/* <img className="main_logo" src={logo} alt="autodefi-logo" /> */}
        <h1>AutoDeFi</h1>
        <h3 className="darkish">Set. Forget. Earn.</h3>
      </div>

      <form>
        <MainInput
          drizzle={drizzle}
          drizzleState={drizzleState}
          facadeAddress={"test"}
        />
      </form>
    </div>
  )
}
