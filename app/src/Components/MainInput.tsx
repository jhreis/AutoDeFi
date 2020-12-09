import { DrizzleContext } from "@drizzle/store"
import React, { ReactElement } from "react"

interface Props {
  drizzle: any // DrizzleContext
  drizzleState: any
  facadeAddress: string
}

export default function MainInput({ drizzle, facadeAddress }: Props) {
  function is0Address(address: string) {
    return address == "0x0000000000000000000000000000000000000000"
  }

  return <div>This is just a test</div>
}
