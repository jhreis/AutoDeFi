import React, { useEffect, useState } from "react"
import { newContextComponents } from "@drizzle/react-components"

import MainInput from "./MainInput"
import BasicInfo from "./BasicInfo"
import Header from "./Header"
import CreateFacade from "./CreateFacade"

// const Generator = require("../contracts/Generator.json")
// const SimpleStorage = require("../contracts/SimpleStorage.json")
// import SimpleStorage from "../contracts/SimpleStorage.json"

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
  const [facade, setFacade] = useState<undefined | any>(undefined)
  const [wallet, setWallet] = useState<string>("bad address")

  useEffect(() => {
    async function setupStorage() {
      const storageKey = drizzle.contracts.SimpleStorage.methods.storedData.cacheCall() // This is weird

      const displayData =
        drizzleState.contracts.SimpleStorage.storedData[storageKey]

      // console.log("Simple", displayData.value)

      if (displayData) {
        setStorage(parseInt(displayData.value))
      }
    }

    setupStorage()
  }, [drizzleState.contracts.SimpleStorage.storedData])
  // ^ re-process if the underlying store is modified

  useEffect(() => {
    const wallet = drizzleState.accounts[0]

    // Validate wallet is real address
    if (typeof wallet !== "string" || !wallet.startsWith("0x")) {
      setWallet("bad address")
      return
    }

    setWallet(wallet)

    // With wallet, identify account
    const _facade = drizzleState.contracts.Generator.facades[wallet]
    console.log("facade?", _facade)

    setFacade(_facade)
  }, [
    drizzleState.accounts[0],
    drizzleState.contracts.Generator.facades[wallet],
  ])

  // Call a contract!
  // drizzle.contracts.SimpleStorage.methods.set(storage + 1).send()

  // This is re-rendering far too often
  // console.log("Render", wallet)

  return (
    <div className="App">
      <Header
        drizzle={drizzle}
        drizzleState={drizzleState}
        userAddress={wallet}
      />
      {facade}
      {/* <BasicInfo userAddress={wallet} /> */}

      <CreateFacade
        userAddress={wallet}
        drizzle={drizzle}
        drizzleState={drizzleState}
      />
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
