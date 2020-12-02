import React, { useEffect } from "react"
import { DrizzleContext } from "@drizzle/react-plugin"
import { Drizzle } from "@drizzle/store"
import drizzleOptions from "./drizzleOptions"
import Dashboard from "./Components/Dashboard"

const drizzle = new Drizzle(drizzleOptions)
// console.log({ drizzle })

export default function App() {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext: any) => {
          const { drizzle, drizzleState, initialized } = drizzleContext

          if (!initialized) {
            return "Loading..."
          }

          return <Dashboard drizzle={drizzle} drizzleState={drizzleState} />
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  )
}
