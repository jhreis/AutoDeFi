import React, { ReactElement } from "react"

function Generator(props) {
  if (!props) {
    return "test"
  }
  const { drizzle, drizzleState, facadeAddress } = props

  let generateBtn: (prop: any) => ReactElement = (prop) => {
    return (
      <div>
        <div className="segment">
          <h2>Create Account</h2>
          <p className="skinny">
            Please choose which Dapp you would like your account to interact
            with.
          </p>
          <button
            className="unit"
            type="button"
            onClick={prop.handleSubmit}
          ></button>
          <button
            className="unit"
            type="button"
            onClick={prop.handleSubmit}
          ></button>
          <button
            className="unit"
            type="button"
            onClick={prop.handleSubmit}
          ></button>
        </div>
      </div>
    )
  }

  let noFacade = (
    <div>
      <ContractForm
        drizzle={drizzle}
        contract="Generator"
        method="generateNewFacade"
        render={generateBtn}
      />
    </div>
  )

  let hasFacade = (
    <div>
      {noFacade}
      {facadeAddress}
    </div>
  )

  return facadeAddress ? hasFacade : noFacade
}
