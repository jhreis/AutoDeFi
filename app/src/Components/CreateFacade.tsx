import React from "react"
import { newContextComponents } from "@drizzle/react-components"
import logo_compound from '../assets/logo_compound.png'
import logo_curve from '../assets/logo_curve.png'
import logo_cream from '../assets/logo_cream.png'

const { ContractData } = newContextComponents

interface Props {
  userAddress: string
  drizzle: any
  drizzleState: any
}

const Strings = {
  title: "Create new account",
  description:
    "Please choose which Dapp you would like your account to interact with.",
}

export default function CreateFacade({
  userAddress,
  drizzle,
  drizzleState,
}: Props) {
  return (
    <section className="segment">
      <h2>{Strings.title}</h2>
      <p className="skinny">{Strings.description}</p>
      <Buttons drizzle={drizzle} drizzleState={drizzleState} />
    </section>
  )
}

interface ButtonProps {
  drizzle: any
  drizzleState: any
}

function Buttons({ drizzle }: ButtonProps) {
  const handleCompoundClick = (event: any) => {
    event.preventDefault()
    drizzle.contracts.Generator.methods.generateNewFacade.cacheSend(0, 0)
  }

  const handleNotReady = () => {
    alert(
      "Not available on test or local blockchains. Just here for demonstration purposes. Only Compound (far left) is deployed for testing."
    )
  }

  return (
    <div>
      <button className="unit" type="button" onClick={handleCompoundClick}>
        <img src={logo_compound} height="24px" width="24px" />
      </button>
      <button className="unit" type="button" onClick={handleNotReady}>
        <img src={logo_curve} height="24px" width="24px" />
      </button>
      <button className="unit" type="button" onClick={handleNotReady}>
        <img src={logo_cream} height="24px" width="24px" />
      </button>
    </div>
  )
}
