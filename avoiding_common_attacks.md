# Avoiding Common Attacks

When building this app, I knew I wanted to leverage the strength of blockchain security and utilize the underlying protocols as much as possible. DeFi applications like Compound and Curve have shown their security strengths.

`AutoDeFi` is able to avoid many security pitfalls by minimizing the amount of logical control over funds. For example, there is no need for `AutoDeFi` to perform many math operations, since the underlying protocols calculate the wallet's token values. However, there were some intentional decisions made to avoid pitfalls described in chapter 9.3:

## Re-entry Attacks

> also applies to "Denial of Service with Failed Call"

Each facade instance is independent of each other. This prevents a wallet or contract from re-entering and securing funds that it did not already have access to. If a re-entry is performed, it would be of no gain, as the withdrawal funds are already available to the facade's deployer, voiding this as an attack surface.

## Force Sending Ether

Although `AutoDeFi` never utilizes Ether, each facade instance sweeps any remaining Ether upon destruction. When an owner closes out their facade instance, any Ether in their contract will be sent to their wallet.
