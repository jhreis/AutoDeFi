import React from "react"
import logo from '../assets/logoBW2.png'

const Strings = {
  title: "AutoDeFi",
  subtitle: "Set. Forget. Earn.",
}

interface Props {
  userAddress: string

  drizzle: any
  drizzleState: any
}

export default function BasicInfo({ userAddress }: Props) {
  return (
    <section className="center">
      <img className="main_logo" src={logo} alt="autodefi-logo" />
      <h1>{Strings.title}</h1>
      <h3 className="darkish">{Strings.subtitle}</h3>

      <h2>Your wallet</h2>
      <code>{userAddress}</code>
    </section>
  )
}
