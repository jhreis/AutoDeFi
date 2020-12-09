import React from "react"
import Facade from "./Facade"

interface Props {
  facadeAddress: string
  drizzle: any
  drizzleState: any
}

export default function AccountSummary({
  facadeAddress,
  drizzle,
  drizzleState,
}: Props) {
  return (
    <section className="center">
      <div className="segment">
        <h2>Your account</h2>
        <code>{facadeAddress}</code>
      </div>
      <Facade
        drizzle={drizzle}
        drizzleState={drizzleState}
        facadeAddress={facadeAddress}
      />
    </section>
  )
}
