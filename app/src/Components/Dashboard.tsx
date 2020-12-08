import React, { useEffect, useState } from "react"
import { newContextComponents } from "@drizzle/react-components"
const { AccountData, ContractData, ContractForm } = newContextComponents

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require("web3")

import MainInput from "./MainInput"
import BasicInfo from "./BasicInfo"
import Header from "./Header"
import AccountSummary from "./AccountSummary"
import CreateFacade from "./CreateFacade"
import AllFacadeList from "./AllFacadeList"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Facade: any = require("../contracts/Facade.json")

// const Generator = require("../contracts/Generator.json")
// const SimpleStorage = require("../contracts/SimpleStorage.json")
// import SimpleStorage from "../contracts/SimpleStorage.json"

// import Web3 from "web3"

// import CompoundFacade from "./contracts/CompoundFacade.json"

const enableCollectInfo = true

interface Props {
  drizzle: any
  drizzleState: any
}

function is0Address(address: string): boolean {
  // TODO: Future improvement
  return address == "0x0000000000000000000000000000000000000000"
}

export default function Dashboard({ drizzle, drizzleState }: Props) {
  const [storage, setStorage] = useState(0)
  const [facade, setFacade] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // TODO: update this so that it is actually undefined
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
  }, [drizzleState.accounts[0]])

  useEffect(() => {
    async function run() {
      setIsLoading(true)

      const displayData = drizzle.contracts.Generator.methods.facades(wallet)
      let newFacade: string | undefined = await displayData.call()

      // The first part of this conditional is only required due to typescript narrowing
      if (!newFacade || is0Address(newFacade)) {
        newFacade = undefined
      }

      if (facade == newFacade) {
        console.log("No facade updates", facade)
        setIsLoading(false)
        return
      }

      // Add new facade
      if (newFacade) {
        console.log("Attempting to attach new facade", newFacade, facade)
        const web3 = new Web3()
        const web3Contract = new web3.eth.Contract(Facade.abi, newFacade, {
          from: drizzleState.accounts[0],
        })
        web3Contract.setProvider(drizzle.web3.currentProvider)
        const contractConfig = { web3Contract, contractName: newFacade }

        // TODO: Update these log messages with the correct ones
        const events = ["Deposit", "Withdraw"]
        drizzle.addContract(contractConfig, events)
        console.log("Added new contract", newFacade, "added?", web3Contract)
      } else {
        console.log(
          `Address ${newFacade}, was invalid, so not attaching observers`
        )
      }

      setFacade(newFacade)
      console.log(`Updated facade from wallet change`, {
        wallet,
        newFacade,
        facade,
      })

      // Remove and add new drizzle contract
      if (facade /* if old facade exists, remove it */) {
        drizzle.deleteContract(facade)
        console.log("Removed old contract", facade)
      } else {
        console.log("No old facade, skipping deletion")
      }

      setIsLoading(false)
    }
    run()
  }, [wallet, drizzleState.contracts.Generator])
  // ^ These observers capture two types of changes, 1. Wallet change 2. If the user creates or destroys a facade

  // Call a contract!
  // drizzle.contracts.SimpleStorage.methods.set(storage + 1).send()

  // This is re-rendering far too often
  // console.log("Render", wallet)

  const childComponent = () => {
    console.log("Attempting child", facade)

    if (isLoading) {
      return <span>LOADING??</span>
    }

    if (facade) {
      return (
        <>
          <AccountSummary
            facadeAddress={facade}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />

          <AllFacadeList drizzle={drizzle} drizzleState={drizzleState} />
        </>
      )
    }

    return (
      <CreateFacade
        userAddress={wallet}
        drizzle={drizzle}
        drizzleState={drizzleState}
      />
    )
  }

  return (
    <div className="App">
      <Header
        drizzle={drizzle}
        drizzleState={drizzleState}
        userAddress={wallet}
      />
      Test {facade}
      {/* <BasicInfo userAddress={wallet} /> */}
      {childComponent()}
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
