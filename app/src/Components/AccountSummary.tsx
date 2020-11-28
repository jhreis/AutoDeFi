import React from "react"

interface Props {
  facadeAddress: string
}

const Strings = {
  title: "Balances",
  Buttons: {
    deposit: "Early Deposit",
    withdraw: "Withdraw All",
  },
}

export default function BasicInfo({ facadeAddress }: Props) {
  return (
    <section>
      {Strings.title}
      {Strings.description}
    </section>
  )
}
