const Generator = artifacts.require("Generator")
const CompoundFacade = artifacts.require("CompoundFacade")
const Integration = artifacts.require("Integration")
const CompoundIntegration = artifacts.require("CompoundIntegration")

contract("Integration", (accounts) => {
  it("Should be able to add a new pair.", async () => {})
  it("Deployer should be the owner.", async () => {})

  /// Make a sub test group
  it("Compound should have a ERC20 pair deployed.", async () => {
    // console.log("ASDIFJASDIFJADSIF")
    const compIntegration = await CompoundIntegration.deployed()
    const pair = await compIntegration.availablePairs(0)

    assert.isNotNull(
      pair.underlyingAsset,
      "Underlying asset was incorrectly null"
    )
    assert.isNotNull(pair.mintingAsset, "Minting asset was incorrectly null")
    assert.equal(
      await compIntegration.owner(),
      accounts[0],
      "The owner was not correct."
    )
  })

  it("Compound Integration should deploy a Compound Facade.", async () => {
    // console.log("ASDIFJASDIFJADSIF")
    const compIntegration = await CompoundIntegration.deployed()
    // const pair = await compIntegration.availablePairs(0)
    // console.log("WHAT", pair.underlyingAsset, pair.mintingAsset)

    // assert.isNotNull(pair.underlyingAsset, "Underlying asset was incorrectly null")
    // assert.isNotNull(pair.mintingAsset, "Minting asset was incorrectly null")
    // expect(pair.underlyingAsset).to.be.
    // console.log("test000000")
    // let facade = await compIntegration.deployUserInstance(accounts[0], 0)
    // console.log("test11111")
    // console.log("YOOOO", {facade})

    // assert.equal(await facade.owner(), accounts[0], "The owner was not correct.")
  })

  it("There should be a valid Compound Integration already deployed.", async () => {
    const compIntegration = await CompoundIntegration.deployed()
    const firstIntegrationName = await compIntegration.description()
    assert.equal(
      firstIntegrationName,
      "Compound Protocol",
      "The deployed Integration is not a Compound one."
    )
  })

  it("Should have a valid pair deployed.", async () => {})
  it("Should have a valid description.", async () => {})
})
