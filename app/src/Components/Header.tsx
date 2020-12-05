import React from "react"
import { newContextComponents } from "@drizzle/react-components"
const { AccountData } = newContextComponents

const Strings = {
  title: "AutoDeFi",
  subtitle: "Set. Forget. Earn.",
  logo: "./src/assets/logoBW2.png",
}

interface Props {
  userAddress: string

  drizzle: any
  drizzleState: any
}

export default function BasicInfo({
  userAddress,
  drizzle,
  drizzleState,
}: Props) {
  return (
    <section className="center">
      <img className="main_logo" src={Strings.logo} alt="autodefi-logo" />
      <h1>{Strings.title}</h1>
      <h3 className="darkish">{Strings.subtitle}</h3>

      <p>
        Your wallet:
        <br />
        {userAddress}
      </p>
      {/* <AccountData
        accountIndex={0}
        drizzle={drizzle}
        drizzleState={drizzleState}
      /> */}
    </section>
  )
}
