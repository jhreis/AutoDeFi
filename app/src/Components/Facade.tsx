import React, { ReactElement } from "react"
import { newContextComponents } from "@drizzle/react-components"
const { AccountData, ContractData, ContractForm } = newContextComponents

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require("web3")

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
  // TODO: Dynamically update these with contract decimal data
  const underlyingRenderer = (displayData: string) =>
    balanceRenderer(displayData, 6)
  const mintingRenderer = (displayData: string) =>
    balanceRenderer(displayData, 8)

  const balanceRenderer = (displayData: string, decimals: number) => {
    let displayNum = 0
    const parseAttempt = parseInt(displayData)
    if (parseAttempt > 0) {
      displayNum = parseAttempt / Math.pow(10, decimals)
    }
    return <span>{displayNum}</span>
  }

  const underlyingBalance = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={facadeAddress}
      method="underlyingBalance"
      hideIndicator={true}
      render={underlyingRenderer}
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
      hideIndicator={true}
      render={mintingRenderer}
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
      method="depositToUnderlying"
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
