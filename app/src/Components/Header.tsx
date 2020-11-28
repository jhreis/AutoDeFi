import React from "react"

const Strings = {
  title: "AutoDeFi",
  subtitle: "Set. Forget. Earn.",
  logo: "./src/assets/logoBW2.png",
}

// const URLs = {
//   logo: new URL("../logo"),
// }

export default function BasicInfo() {
  return (
    <section className="center">
      <img className="main_logo" src={Strings.logo} alt="autodefi-logo" />
      <h1>{Strings.title}</h1>
      <h3 className="darkish">{Strings.subtitle}</h3>
    </section>
  )
}
