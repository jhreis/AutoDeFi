import React from "react"

interface Props {
  userAddress: string
}

const Strings = {
  title: "Create Account",
  description:
    "Please choose which Dapp you would like your account to interact with.",
  Images: {
    compound: "./src/assets/logo_compound.png",
    curve: "./src/assets/logo_curve.png",
    cream: "./src/assets/logo_cream.png",
  },
}

export default function BasicInfo({ userAddress }: Props) {
  return (
    <section className="segment">
      <h2>{Strings.title}</h2>
      <p className="skinny">{Strings.description}</p>
      {generateBtns()}
    </section>
  )
}

function generateBtns() {
  return (
    <div>
      <button className="unit" type="button">
        <img src={Strings.Images.compound} height="24px" width="24px" />
      </button>
      <button className="unit" type="button">
        <img src={Strings.Images.curve} height="24px" width="24px" />
      </button>
      <button className="unit" type="button">
        <img src={Strings.Images.cream} height="24px" width="24px" />
      </button>
    </div>
  )
}
