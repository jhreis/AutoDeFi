import React from "react"
import FacadeBalance from "./FacadeBalance"

interface Props {
  facadeAddress: string
  drizzle: any
  drizzleState: any
}

export default function Facade({
  facadeAddress,
  drizzle,
  drizzleState,
}: Props) {
  return (
    <div className="segment">
      <h2>Your Account Balances</h2>

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
            buttonTitle: "Early Deposit",
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
            buttonTitle: "Withdraw All",
          }}
        />
      </div>
    </div>
  )
}
