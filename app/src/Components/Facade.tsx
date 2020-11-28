import React, { ReactElement } from "react"

export default function Facade() {
  const { drizzle, drizzleState, contractName } = this.props
  const underlyingBalance = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={contractName}
      method="underlyingBalance"
    />
  )
  const underlyingAssetSymbol = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={contractName}
      method="underlyingAssetSymbol"
    />
  )

  const mintedBalance = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={contractName}
      method="mintedBalance"
    />
  )
  const mintedAssetSymbol = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={contractName}
      method="mintedAssetSymbol"
    />
  )

  const depositRender: (prop: any) => ReactElement = (prop) => {
    return (
      <button
        key="submit"
        className="pure-button"
        type="button"
        onClick={prop.handleSubmit}
      >
        Early Deposit
      </button>
    )
  }
  const withdrawRender: (prop: any) => ReactElement = (prop) => {
    return (
      <button
        key="submit"
        className="pure-button"
        type="button"
        onClick={prop.handleSubmit}
      >
        Withdraw All
      </button>
    )
  }
  const deposit = (
    <ContractForm
      drizzle={drizzle}
      contract={contractName}
      method="deposit"
      render={depositRender}
    />
  )
  const withdraw = (
    <ContractForm
      drizzle={drizzle}
      contract={contractName}
      method="withdraw"
      render={withdrawRender}
    />
  )

  return (
    <div>
      <div className="segment">
        <h2>Your Account</h2>
        <p className="skinny truncate">{contractName}</p>
      </div>

      <div className="segment">
        <h2>Balances</h2>

        <p>
          <div className="input-group center">
            <label>
              <div className="bottom-buffer">
                {underlyingBalance} {underlyingAssetSymbol}
              </div>
              <div className="bottom-buffer">{deposit}</div>
            </label>
            <label>
              <div className="bottom-buffer">
                {mintedBalance} {mintedAssetSymbol}
              </div>
              <div className="bottom-buffer">{withdraw}</div>
            </label>
          </div>
        </p>
      </div>
    </div>
  )
}
