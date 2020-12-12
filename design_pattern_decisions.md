# Design Pattern Decisions

There are quite a few design decisions taking place in `AutoDeFi`:

## Recursive Factory Pattern

At the simple core, `AutoDeFi` leans heavily on a generic generator, with logic being heavily abstracted. The Generator is simply a naive interface that is the go-to location for interacting with the hidden complexities of this protocol. The Generator itself simply knows how to access other factories (called `Integrations`).

Each Integration is coupled directly to a `Facade`, which it knows how to deploy:

> Generator -> multiple Integrations (with multiple asset pairs) -> 1:1 with a Facade

Though this heavily abstracted methodology, new integrations can easily be attached to the Generator, allowing wallets to create interfaces against many different DeFi protocols (currently only supports Compound).

## Dynamic and Upgradable Implementations

Since each integration is deployed independently, they can contain complex logic if required. They are then attached to the Generator, allowing wallets to deploy through a single interface (although they can call functions on the `Integrations` themselves).

In addition to generalized `Integrations`, there are generalized asset pairs (e.g. `USDC` and `cUSDC`). This allows a single facade implementation to re-use 100% of their logic while also utilizing different asset pairs in the underlying protocols.

> Example: Compound uses `c` assets (e.g `cUSDC`, `cDAI`) that are all directly associated with individual tokens (e.g. `USDC`, `DAI`). With these 1:1 pairings the `AutoDeFi` `CompoundIntegration` can have both of these pairs (`USDC`:`cUSDC` & `DAI`:`cDAI`) attached, without requiring any new `Integration` deployment. Each wallet currently must still deploy with a single, tightly-coupled, asset pair, but this can be improved upon in future iterations.

## Abstracted Models

Both the `Integrations` and asset pairs are abstracted from the logic of the facades. This generalized approach allows significant upgradeability, and will even allow disabling broken `Facades` while deploying new versions to keep pace with DeFi protocol advancements. For example, if Compound releases a v2 protocol, a new `CompoundIntegrationV2` instance would need to be deployed, asset pairs set, and a new `CompoundFacadeV2` written. No existing deployments would need to change, and users could upgrade whenever convenient.

Additionally due to the `assistant` methodology, some of this upgradeability could further be abstracted from users (e.g. allowing the assistant to perform secure upgrades for user)

## Granular Circuit Breaking

In order to deprecate `Integrations`, a granular circuit breaker was implemented on the `Generator`, which can pause specific protocols at-will. This allows the single interface to have greater protection for users, while having the flexibility to not entirely shutdown.

Additionally, since `Integrations` are independent from the single `Generator` interface, they can be manually deployed. This allows more thorough testing to be performed before they are attached to the single, generator interface, providing greater security for end-users.

## Public Deposits

Any wallet can deposits assets that are inside of any `Facade`. This is the custodial aspect, and prevents each `Facade` from needing Ether to move their assets around. However, funds are still secured, and are only withdrawable to the owner's wallet. The "why" of `AutoDeFi` is further explained in the `README.md`.

## Future Design Improvements

1. Allowing each wallet to create multiple Facades would be the easiest and first improvement. This would require modifying the `address -> Facade` mapping to be an array of `Facade[]`. This was done in testing, but due to time constraints, was removed.
1. Provide incentive for custodial depositors. Since depositing is a public action, the account paying the Ether to deposit the funds should be rewarded using the underlying token (e.g. if depositing a `USDC` asset, the fee would be paid out in `USDC`).
1. Build additional `Integrations`. It was difficult to identify other DeFi protocols that had fully functioning Rinkeby deployments. If building against the live-net, it would be much more trivial to add additional protocols and test them.
