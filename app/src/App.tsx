import React, { useCallback, useEffect } from "react"
import { DrizzleContext } from "@drizzle/react-plugin"
import { Drizzle } from "@drizzle/store"
import drizzleOptions from "./drizzleOptions"
import Dashboard from "./Components/Dashboard"

const drizzle = new Drizzle(drizzleOptions)
// console.log({ drizzle })

export default function App() {
  console.log("Parent is rendering")

  // const { drizzle, drizzleState, initialized } = useCallback(
  //   () => drizzleContext,
  //   [drizzleContext]
  // )

  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext: any) => {
          // This is re-rendering constnatly, drizzleContext must be bad?
          // console.log("Child is re-rendering.")

          const { drizzle, drizzleState, initialized } = drizzleContext

          if (!initialized) {
            return <h1>"Loading...PLEASE ATTACH WALLET"</h1>
          }

          return <Dashboard drizzle={drizzle} drizzleState={drizzleState} />
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  )
}
