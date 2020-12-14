import React from "react"
import { newContextComponents } from "@drizzle/react-components"

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
  Images: {
    compound: "./src/assets/logo_compound.png",
    curve: "./src/assets/logo_curve.png",
    cream: "./src/assets/logo_cream.png",
  },
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
        <img src={Strings.Images.compound} height="24px" width="24px" />
      </button>
      <button className="unit" type="button" onClick={handleNotReady}>
        <img src={Strings.Images.curve} height="24px" width="24px" />
      </button>
      <button className="unit" type="button" onClick={handleNotReady}>
        <img src={Strings.Images.cream} height="24px" width="24px" />
      </button>
    </div>
  )
}
