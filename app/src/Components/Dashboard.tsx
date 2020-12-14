import React, { useEffect, useState } from "react"

import Header from "./Header"
import AccountSummary from "./AccountSummary"
import CreateFacade from "./CreateFacade"
import AllFacadeList from "./AllFacadeList"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require("web3")

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Facade: any = require("../contracts/Facade.json")

interface Props {
  drizzle: any
  drizzleState: any
}

function is0Address(address: string): boolean {
  // TODO: Future improvement
  return address == "0x0000000000000000000000000000000000000000"
}

export default function Dashboard({ drizzle, drizzleState }: Props) {
  const [facade, setFacade] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [wallet, setWallet] = useState<string | undefined>(undefined)

  useEffect(() => {
    const wallet = drizzleState.accounts[0]

    // Validate wallet is real address
    if (typeof wallet !== "string" || !wallet.startsWith("0x")) {
      setWallet(undefined)
      return
    }

    setWallet(wallet)
  }, [drizzleState.accounts[0]])

  useEffect(() => {
    async function run() {
      const displayData = drizzle.contracts.Generator.methods.facades(wallet)
      let newFacade: string | undefined = await displayData.call()

      // The first part of this conditional is only required due to typescript narrowing
      if (!newFacade || is0Address(newFacade)) {
        newFacade = undefined
      }

      if (facade == newFacade) {
        console.log("No facade updates", facade)
        return
      }

      setIsLoading(true)

      // Add new facade
      if (newFacade && !drizzle.contracts[newFacade]) {
        console.log("Attempting to attach new facade", newFacade, facade)
        const web3 = new Web3()
        const web3Contract = new web3.eth.Contract(Facade.abi, newFacade, {
          from: drizzleState.accounts[0],
        })
        web3Contract.setProvider(drizzle.web3.currentProvider)
        const contractConfig = { web3Contract, contractName: newFacade }

        // TODO: Update these log messages with the correct ones
        const events = ["LogDeposit", "LogWithdraw"]
        drizzle.addContract(contractConfig, events)
        console.log("Added new contract", newFacade, "added?", web3Contract)
      } else {
        console.log(
          `Address ${newFacade}, was invalid or already exists, so not attaching observers`
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

    // Run async function
    run()
  }, [wallet, drizzleState.contracts.Generator])
  // ^ These observers capture two types of changes, 1. Wallet change 2. If the user creates or destroys a facade

  const childComponent = () => {
    if (isLoading) {
      return <span>LOADING...</span>
    }

    if (!wallet) {
      return <span>Please attach a wallet</span>
    }

    if (facade) {
      return (
        <>
          <AccountSummary
            facadeAddress={facade}
            drizzle={drizzle}
            drizzleState={drizzleState}
          />
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
      {wallet ? (
        <>
          <Header
            drizzle={drizzle}
            drizzleState={drizzleState}
            userAddress={wallet}
          />
          {childComponent()}
        </>
      ) : (
        "Please connect wallet..."
      )}
      <AllFacadeList drizzle={drizzle} drizzleState={drizzleState} />
    </div>
  )
}
