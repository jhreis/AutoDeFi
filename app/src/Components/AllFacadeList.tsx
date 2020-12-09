import React, { useEffect, useState, ChangeEvent } from "react"
import FacadeComponent from "./Facade"
import FacadeBalance from "./FacadeBalance"
import { newContextComponents } from "@drizzle/react-components"
const { AccountData, ContractData, ContractForm } = newContextComponents

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Facade: any = require("../contracts/Facade.json")

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require("web3")

interface Props {
  drizzle: any
  drizzleState: any
}

export default function AllFacadeList({ drizzle, drizzleState }: Props) {
  const [facadeInstances, setFacadeInstances] = useState<string[]>([])
  const [selectedFacadeAddress, setSelectedFacadeAddress] = useState<
    string | undefined
  >(undefined)
  const [selectedFacade, setSelectedFacade] = useState<string | undefined>(
    undefined
  )

  function is0Address(address: string): boolean {
    // TODO: Future improvement
    return address == "0x0000000000000000000000000000000000000000"
  }

  useEffect(() => {
    const countKey = drizzle.contracts.Generator.methods.numberOfOwners.cacheCall()
    const count =
      drizzleState.contracts.Generator.numberOfOwners[countKey]?.value
    const allValidFacadeAddress = []

    for (let i = 0; i < count; i++) {
      const facadeOwnerKey = drizzle.contracts.Generator.methods.facadeOwners.cacheCall(
        i
      )
      const facadeOwner =
        drizzleState.contracts.Generator.facadeOwners[facadeOwnerKey]?.value
      if (!facadeOwner) return

      const facadeKey = drizzle.contracts.Generator.methods.facades.cacheCall(
        facadeOwner
      )
      const facade = drizzleState.contracts.Generator.facades[facadeKey]?.value
      if (!facade) return
      if (is0Address(facade)) return

      allValidFacadeAddress.push(facade)
    }

    console.log("Updated all owner addresses!", allValidFacadeAddress.length)
    setFacadeInstances(allValidFacadeAddress)
  }, [drizzleState.contracts.Generator.facadeOwners])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacadeAddress(undefined)

    const index = parseInt(event.target.value)

    // This stupid, but required.
    // For some reason Drizzle has an issue with swapping out the address
    //  dynamically, and requires a runloop flush after setting the address
    //  to undefined. Annoying, but nice work around.
    setTimeout(run, 1)
    function run() {
      let newSelectedFacadeAddress: string | undefined = undefined
      if (index > 0) {
        const desiredIndex = index - 1
        // setSelectedFacadeAddress(facadeInstances[desiredIndex])
        newSelectedFacadeAddress = facadeInstances[desiredIndex]
      } else {
        console.log("ERROR: Selected facade is undefined")
        setSelectedFacadeAddress(undefined)
        return
      }

      if (drizzle.contracts[newSelectedFacadeAddress]) {
        console.log("AllFacadeList: Contract already attached to drizzle")
        setSelectedFacadeAddress(newSelectedFacadeAddress)
        return
      }

      console.log(
        "AllFacadeList: Attempting to attach new facade",
        newSelectedFacadeAddress
      )
      const web3 = new Web3()
      const web3Contract = new web3.eth.Contract(
        Facade.abi,
        newSelectedFacadeAddress,
        {
          from: drizzleState.accounts[0],
        }
      )
      web3Contract.setProvider(drizzle.web3.currentProvider)
      const contractConfig = {
        web3Contract,
        contractName: newSelectedFacadeAddress,
      }

      // TODO: Update these log messages with the correct ones
      const events = ["Deposit", "Withdraw"]
      drizzle.addContract(contractConfig, events)
      console.log(
        "AllFacadeList: Added new contract",
        newSelectedFacadeAddress,
        "added?",
        web3Contract
      )

      setSelectedFacadeAddress(newSelectedFacadeAddress)
    }
  }

  const Options = () => {
    const facadesWithBlank: string[] = ["Select facade address..."].concat(
      facadeInstances || []
    )
    return facadesWithBlank?.map((facade, index) => (
      <option key={facade} value={index}>
        {facade}
      </option>
    ))
  }

  const accountTitle = "Viewing Compound account:"
  return (
    <section>
      <h1>Depositing for Other Accounts</h1>
      {facadeInstances && `Number of Facades: ${facadeInstances.length}`}
      <select onChange={handleChange}>{Options()}</select>
      {selectedFacadeAddress && (
        <>
          {accountTitle} {selectedFacadeAddress}
          <FacadeBalance
            facadeAddress={selectedFacadeAddress}
            drizzle={drizzle}
            drizzleState={drizzleState}
            decimals={6}
            methods={{
              balance: "underlyingBalance",
              symbol: "underlyingAssetSymbol",
              buttonAction: "depositToUnderlying",
              buttonTitle: "Perform Custodial Deposit!",
            }}
          />
        </>
      )}
    </section>
  )
}
