import React from "react"
import { newContextComponents } from "@drizzle/react-components"

import MainInput from "./MainInput"
import BasicInfo from "./BasicInfo"
import Header from "./Header"
import CreateFacade from "./CreateFacade"

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

  const userWallet = drizzleState.accounts[0]
  const facadeAddress = "Test"
  return (
    <div className="App">
      <Header />
      <BasicInfo userAddress={userWallet} />

      <CreateFacade userAddress={userWallet} />

      {/* <form>
        <MainInput
          drizzle={drizzle}
          drizzleState={drizzleState}
          facadeAddress={"test"}
        />
      </form> */}
    </div>
  )
}
