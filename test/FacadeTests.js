const CompoundFacade = artifacts.require("CompoundFacade")
const StandardERC20 = artifacts.require("StandardERC20")

contract("CompoundFacade", (accounts) => {
  const creatorAddress = accounts[0]
  const firstOwnerAddress = accounts[1]
  const unprivilegedAddress = accounts[4]
  const max256 =
    "115792089237316195423570985008687907853269984665640564039457584007913129639935"

  /// All Context Setup
  let underlying, minting
  before(async () => {
    underlying = await StandardERC20.new(1000, "Fake USDC", 18, "fUSDC")
    minting = await StandardERC20.new(1000, "Fake cUSDC", 18, "fcUSDC")
  })

  let idealFacade // or hopefully ideal 😂
  // Re-deploy this facade for each test to make sure environment is clean
  beforeEach(async () => {
    idealFacade = await CompoundFacade.new(
      firstOwnerAddress,
      underlying.address,
      minting.address
    )
  })
  //////////////////

  /// Test facade deployments
  context("Deployments - Verifying deployments function correct.", () => {
    it("Should deploy and construct a valid Compound Facade", async () => {
      const facade = idealFacade
      assert.isNotNull(
        facade.address,
        "Deploy attempt resulted in null address :/"
      )
    })

    it("Underlying should have spend approval for minting.", async () => {
      const facade = idealFacade
      const spendAmount = await underlying.allowance(
        facade.address,
        minting.address
      )

      assert.equal(
        spendAmount.toString(10),
        max256,
        "Spent amount was incorrect."
      )
    })

    it("Facade owner should be different than deploying address", async () => {
      const facade = idealFacade
      assert.equal(
        await facade.owner(),
        firstOwnerAddress,
        "Facade owner is not the correct owner!"
      )
    })

    it("Facade assistant should be the deploying contract", async () => {
      const facade = idealFacade
      assert.equal(
        await facade.assistant(),
        creatorAddress,
        "Facade owner is not the correct owner!"
      )
    })

    it("Should throw error when not using valid minting.", async () => {
      try {
        const invalidERC20 = unprivilegedAddress
        const facade = await CompoundFacade.new(
          firstOwnerAddress,
          invalidERC20, // Should throw
          minting.address
        )
      } catch (error) {
        // It is good if we reach this, since invalid facade was used
        return
      }

      // Will only reach this if no error was thrown, which is bad in this case
      assert.fail("Facade deployment should have thrown error.")
    })

    it("Deploying new contract should trigger an event.", async () => {})
  })

  ////////////////////////////////////////////////
  ////// Future tests that could be written //////
  ////////////////////////////////////////////////

  context(
    "Editing Post Deployment - These are editing the contract post deployment.",
    () => {
      it("Should update the `assistant` address.", async () => {})
      it("Should reject `assistant` update if not the `owner`.", async () => {})
      it("Should update the minimum amount of assets required for a deposit action.", async () => {})
      it("Should reject the minimum amount of assets required for a deposit update.", async () => {})
    }
  )

  context(
    "Deployment Interactions - Interacting with a deployed contract, e.g. depositing and withdrawing.",
    () => {
      before(async () => {})
      beforeEach(async () => {})

      context(
        "Deposit Interactions - Attempting different deposit scenarios.",
        () => {
          it("Should perform a deposit from `owner`.", async () => {})
          it("Should perform a deposit from `assistant`.", async () => {})
          it("Should reject a deposit from unauthorized account.", async () => {})
          it("Should reject a deposit when not enough assets in account.", async () => {})
          it("Deposit should trigger an event.", async () => {})
        }
      )

      context(
        "Withdraw Interactions - Attempting different withdraw scenarios.",
        () => {
          it("Should perform a withdraw to `owner` wallet from `owner` caller", async () => {})
          it("Should perform a withdraw to `owner` wallet from `assistant` caller", async () => {})
          it("Should reject a withdraw from unauthorized account.", async () => {})
          it("Withdraw should trigger an event.", async () => {})
        }
      )

      context(
        "Destroy Interactions - Attempting to fully destroy the facade.",
        () => {
          it("Should destroy contract when called from `owner`", async () => {})
          it("Should destroy contract when called from `assistant`", async () => {})
          it("Should reject destroying from unauthorized account.", async () => {})
          it("Destroy should transfer all underlying tokens to `owner` wallet.", async () => {})
          it("Destroy should transfer all ETH to `owner` wallet.", async () => {})
          it("Destroy should trigger an event.", async () => {})
        }
      )
    }
  )
})
