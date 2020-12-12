# AutoDeFi

### Overview

`AutoDeFi` is a project designed to provide a simple, single, custodial, interface to a variety of DeFi protocols. Currently, only Compound is supported, but `AutoDeFi` a completely upgradable protocol that allows almost any protocol to be added with ease, along with any ERC20 asset pairing.

The first step of using `AutoDeFi` is creating an onchain account / wallet. By selecting the desired protocol (Compound is currently the only supported one), an account will be generated with a specific asset pair (`USDC`:`cUSDC` is the only currently deployed asset pair, so this is selected automatically).

After the account creation transaction completes, a new UI with the token balance will be presented. One of the key purposes of `AutoDeFi` is the custodial aspect. Once assets are deposited into an account, any wallet can execute a `deposit` transaction, moving the wallet funds into the underlying protocol (e.g. Compound). This allows the account owner to avoid needing Ether in their account. A user can deposit their own funds by pressing "Deposit early", and sign their own transaction. Even here, the Ether will come out of their signing address, not the `AutoDeFi` wallet.

### But why?

This primarily was an experiment in on-chain custodial accounts. Using inspiration from instadapp.io, `AutoDeFi` uses smart contract wallet, while also providing an additional layer of functionality; anyone can deposit account funds.

At this time, there is no real incentive for a third party to deposit funds for another, unless they were an entity providing a special use-case. For example, a centralized exchange could leverage this by automatically transfer user funds into this special account and depositing their funds into a DeFi protocol automatically, without any need for user interaction. This automatically moves their centralized funds to fully decentralized protocols, removing the exchanges control from assets. This specialized facade-account provides secure protection, since the funds can only transfer back to the wallet owner (the creator). This allows custodial deposits, while still keeping user funds completely protected.

Additionally, new incentives could be added, like paying the custodial depositor a fee for depositing user funds. Fees would be paid out in the underlying token (e.g. `USDC`), allowing the `AutoDeFi` wallet to never need Ether.

### How to use?

`AutoDeFi` is deployed to `Rinkeby`, and also works locally, with a few limitations.

> Limitations: Due to the dependence on underlying protocols, `AutoDeFi` is currently unable to handle deposits and withdrawals locally, since this requires a fully Compound integration. When deploying locally, local ERC20 tokens are deployed, which allows for account creation and seeing any deposited balances in the underlying token (`fUSDC`: "Fake USDC" and `fcUSDC`: "Fake cUSDC").

#### To deploy:

1. Make sure to have a blockchain (e.g. Ganache) running on `localhost:8545`
1. Execute: `truffle migrate --network develop`
1. Start the website: `(cd app && yarn dev)`

> To deploying to Rinkeby, the `rinkeby` `network` flag should be used. (`truffle migrate --network rinkeby`). This assumes that Rinkeby is running locally, also on `localhost:8545`.

#### To test on Rinkeby:

1. Visit [AutoDeFi](https:www.google.com)
1. Connect MetaMask
1. Account creation is easy, just press the Compound button (far left)
1. In order to actually perform deposits / withdrawals though, `USDC` will be required:

#### Getting USDC on Rinkeby

1. Visit compound.finance
1. Switch the network to Rinkeby in MetaMask
1. Connect Metamask
1. Deposit Ether into Compound
1. Turn on Ether collateral
1. Borrow USDC
1. This USDC can then be deposited into your `AutoDeFi` protocol via doing a standard "send" in MetaMask.

> Why require a "send" instead of using the `approve` permissions on ERC20 and withdraw the funds automatically? This was done largely for the automation benefits. `AutoDeFi` does not care where the assets come from. Maybe the user wants to move funds from a centralized exchange, or use a variety of wallets (potentially even different people). Instead of requiring every wallet to execute an `approve` transaction, the user can simply send the assets into their own wallet. This also avoids any security concerns regarding unlimited asset approvals, and puts far more control into the user's hands.

#### Automated Tests

Tests are written in JavaScript and fully automated. From the project root directory simply run `truffle test`. This will deploy the contracts, including the local ERC20 asset pairs, to increase testing coverage.
