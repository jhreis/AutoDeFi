import React, { useEffect, useState } from "react"
import { newContextComponents } from "@drizzle/react-components"

import MainInput from "./MainInput"
import BasicInfo from "./BasicInfo"
import Header from "./Header"
import CreateFacade from "./CreateFacade"

// const Generator = require("../contracts/Generator.json")
// const SimpleStorage = require("../contracts/SimpleStorage.json")
import SimpleStorage from "../contracts/SimpleStorage.json"

// import Web3 from "web3"

// import CompoundFacade from "./contracts/CompoundFacade.json"

const { AccountData, ContractData, ContractForm } = newContextComponents

const enableCollectInfo = true

interface Props {
  drizzle: any
  drizzleState: any
}

export default function Dashboard({ drizzle, drizzleState }: Props) {
  const [storage, setStorage] = useState(0)

  useEffect(() => {
    async function setupStorage() {
      const storageKey = await drizzle.contracts.SimpleStorage.methods[
        "storedData"
      ].cacheCall() // This is weird

      const displayData =
        drizzleState.contracts.SimpleStorage.storedData[storageKey]

      console.log("What??", displayData)

      if (displayData) {
        setStorage(parseInt(displayData.value))
      }
    }

    setupStorage()
  }, [drizzleState.contracts.SimpleStorage.storedData])
  // ^ re-process if the underly store is modified

  const userWallet = drizzleState.accounts[0]

  // Call a contract!
  // drizzle.contracts.SimpleStorage.methods.set(storage + 1).send()

  // This is re-rendering far too often
  console.log("Render", storage)
  return (
    <div className="App">
      <Header />
      {storage}
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
