import React, { useEffect, useState, ChangeEvent } from "react"
import Facade from "./Facade"
import { newContextComponents } from "@drizzle/react-components"
const { AccountData, ContractData, ContractForm } = newContextComponents

interface Props {
  drizzle: any
  drizzleState: any
}

export default function AllFacadeList({ drizzle, drizzleState }: Props) {
  const [facadeInstances, setFacadeInstances] = useState<string[] | undefined>(
    undefined
  )
  const [selectedFacade, setSelectedFacade] = useState<string | undefined>(
    undefined
  )

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

      allValidFacadeAddress.push(facade)
    }

    console.log("Updated all owner addresses!", allValidFacadeAddress.length)
    setFacadeInstances(allValidFacadeAddress)
  }, [drizzleState.contracts.Generator.facadeOwners])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacade(event.target.value)
  }

  const Options = () => {
    const facadesWithBlank: string[] = ["Select facade address..."].concat(
      facadeInstances || []
    )
    return facadesWithBlank?.map((f) => (
      <option key={f} value={f}>
        {f}
      </option>
    ))
  }

  return (
    <section>
      <h1>Depositing for Other Accounts</h1>
      {/* <ContractData
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract={"Generator"}
        method="numberOfOwners"
      /> */}
      {facadeInstances && `Number of Facades: ${facadeInstances.length}`}

      <select value={selectedFacade} onChange={handleChange}>
        {Options()}
      </select>
    </section>
  )
}
