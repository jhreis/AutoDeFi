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
  return (
    <div>
      <div className="segment">
        <h2>Your Account</h2>
        <p className="skinny truncate">{facadeAddress}</p>
      </div>

      <div className="segment">
        <h2>Balances</h2>

        <div className="input-group center">
          <FacadeBalance
            facadeAddress={facadeAddress}
            drizzle={drizzle}
            drizzleState={drizzleState}
            decimals={6}
            methods={{
              balance: "underlyingBalance",
              symbol: "underlyingAssetSymbol",
              buttonAction: "depositToUnderlying",
              buttonTitle: "Withdraw All",
            }}
          />

          <FacadeBalance
            facadeAddress={facadeAddress}
            drizzle={drizzle}
            drizzleState={drizzleState}
            decimals={8}
            methods={{
              balance: "mintedBalance",
              symbol: "mintedAssetSymbol",
              buttonAction: "withdraw",
              buttonTitle: "Early Deposit",
            }}
          />
        </div>
      </div>
    </div>
  )
}

interface FacadeBalanceProps {
  facadeAddress: string
  drizzle: any
  drizzleState: any
  decimals: number
  methods: {
    balance: string
    symbol: string
    buttonAction: string
    buttonTitle: string
  }
}

function FacadeBalance({
  facadeAddress,
  drizzle,
  drizzleState,
  decimals,
  methods: { balance, symbol, buttonAction, buttonTitle },
}: FacadeBalanceProps) {
  // TODO: Dynamically update these with contract decimal data

  const balanceRenderer = (displayData: string) => {
    let displayNum = 0
    const parseAttempt = parseInt(displayData)
    if (parseAttempt > 0) {
      displayNum = parseAttempt / Math.pow(10, decimals)
    }
    return <span>{displayNum}</span>
  }

  const balanceUI = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={facadeAddress}
      method={balance}
      hideIndicator={true}
      render={balanceRenderer}
    />
  )
  const assetSymbolUI = (
    <ContractData
      drizzle={drizzle}
      drizzleState={drizzleState}
      contract={facadeAddress}
      method={symbol}
    />
  )

  const withdrawRender: (prop: any) => ReactElement = (prop) => {
    return (
      <button
        key="submit"
        className="pure-button"
        type="button"
        onClick={prop.handleSubmit}
      >
        {buttonTitle}
      </button>
    )
  }

  const action = (
    <ContractForm
      drizzle={drizzle}
      contract={facadeAddress}
      method={buttonAction}
      render={withdrawRender}
    />
  )

  return (
    <label>
      <div className="bottom-buffer">
        {balanceUI} {assetSymbolUI}
      </div>
      <div className="bottom-buffer">{action}</div>
    </label>
  )
}
