import React, { useEffect } from "react"

interface Props {
  userAddress: string
  drizzle: any
  drizzleState: any
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

function Buttons({ drizzle, drizzleState }: ButtonProps) {
  // Should be using on-callbacks

  useEffect(() => {
    async function setupOwner() {
      let ownerFunc = drizzle.contracts.Generator.methods.availableProtocols(0)
      console.log("USE EFFECTS 2", await ownerFunc.call())

      const dataKey = drizzle.contracts.SimpleStorage.methods.storedData.cacheCall()

      // Use the dataKey to display data from the store.
      console.log(
        "YOOO",
        drizzleState.contracts.SimpleStorage.storedData[dataKey].value
      )

      let generateNew = drizzle.contracts.Generator.methods.generateNewFacade(
        0,
        0
      )
      console.log("Generate", await generateNew.call())

      // let idk = drizzleState.cont

      // See owner
      // let ownerFunc = drizzle.contracts.Generator.methods.owner.call()
      // console.log("USE EFFECTS 2", await ownerFunc.call())

      // let gooo = drizzleState.contracts.Generator.owner[storageKey2]
      // console.log("print", gooo)
    }

    setupOwner()
  }, [drizzleState.contracts.Generator.storedData])

  const handleCompoundClick = async () => {
    console.log("hit!")

    // await drizzle.contracts.SimpleStorage.methods.set(1).send()

    // generateNewFacade

    return
    let idk = await drizzle.contracts.Generator.methods
      .generateNewFacade(0, 0)
      .send()
    console.log("this is idk", idk)
    // TODO: Alert the transaction?
  }

  const handleNotReady = () => {
    alert("Not deployed yet.")
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
