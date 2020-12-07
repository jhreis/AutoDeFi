import React, { ReactElement } from "react"
import { newContextComponents } from "@drizzle/react-components"
const { AccountData, ContractData, ContractForm } = newContextComponents

interface Props {
  facadeAddress: string
  drizzle: any
  drizzleState: any
}

export default function Facade({
  drizzle,
  drizzleState,
  facadeAddress,
}: Props) {
  const underlyingBalance = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={facadeAddress}
      method="underlyingBalance"
    />
  )
  const underlyingAssetSymbol = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={facadeAddress}
      method="underlyingAssetSymbol"
    />
  )

  const mintedBalance = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={facadeAddress}
      method="mintedBalance"
    />
  )
  const mintedAssetSymbol = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={facadeAddress}
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
      contract={facadeAddress}
      method="deposit"
      render={depositRender}
    />
  )
  const withdraw = (
    <ContractForm
      drizzle={drizzle}
      contract={facadeAddress}
      method="withdraw"
      render={withdrawRender}
    />
  )

  return (
    <div>
      <div className="segment">
        <h2>Your Account</h2>
        <p className="skinny truncate">{facadeAddress}</p>
      </div>

      <div className="segment">
        <h2>Balances</h2>

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
      </div>
    </div>
  )
}
