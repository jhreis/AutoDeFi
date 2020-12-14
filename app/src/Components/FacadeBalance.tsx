import React, { ReactElement } from "react"
import { newContextComponents } from "@drizzle/react-components"
const { ContractData, ContractForm } = newContextComponents

interface Props {
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

export default function FacadeBalance({
  facadeAddress,
  drizzle,
  drizzleState,
  decimals,
  methods: { balance, symbol, buttonAction, buttonTitle },
}: Props) {
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
    <label className="side-padding">
      <div className="bottom-buffer">
        {balanceUI} {assetSymbolUI}
      </div>
      <div className="bottom-buffer">{action}</div>
    </label>
  )
}
