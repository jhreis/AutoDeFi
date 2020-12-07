import React from "react"
import Facade from "./Facade"

interface Props {
  facadeAddress: string
  drizzle: any
  drizzleState: any
}

const Strings = {
  title: "Balances",
  Buttons: {
    deposit: "Early Deposit",
    withdraw: "Withdraw All",
  },
}

export default function AccountSummary({
  facadeAddress,
  drizzle,
  drizzleState,
}: Props) {
  return (
    <section>
      {/* TODO: This contract name should be on the actual contract yo */}
      <Facade
        drizzle={drizzle}
        drizzleState={drizzleState}
        facadeAddress={facadeAddress}
      />
      {/* {Strings.title} */}
      {/* {facadeAddress} */}
    </section>
  )
}
