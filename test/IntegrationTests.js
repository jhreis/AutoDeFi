const Generator = artifacts.require("Generator")
const CompoundFacade = artifacts.require("CompoundFacade")
const Integration = artifacts.require("Integration")
const CompoundIntegration = artifacts.require("CompoundIntegration")

contract("Integration", (accounts) => {
  it("Should be able to add a new pair.", async () => {
    const firstFake = "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b"
    const secondFake = "0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1"
    const compIntegration = await CompoundIntegration.deployed()

    await compIntegration.addAvailablePair(firstFake, secondFake)

    const newlyAdded = await compIntegration.availablePairs(1)

    assert.equal(
      newlyAdded.underlyingAsset,
      firstFake,
      "Underlying asset for new pair was incorrect."
    )

    assert.equal(
      newlyAdded.mintingAsset,
      secondFake,
      "Minting asset for new pair was incorrect."
    )
  })

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

  it("Should have a valid pair deployed.", async () => {
    const compIntegration = await CompoundIntegration.deployed()
    const firstPair = await compIntegration.availablePairs(0)

    assert.isNotNull(firstPair)
    assert.isNotNull(
      firstPair.underlyingAsset,
      "Underlying asset was incorrectly null"
    )
    assert.isNotNull(
      firstPair.mintingAsset,
      "Minting asset was incorrectly null"
    )
  })

  it("Should have a valid description.", async () => {
    const compIntegration = await CompoundIntegration.deployed()
    const firstIntegrationName = await compIntegration.description()
    assert.isNotNull(firstIntegrationName)
  })

  ////////////////////////////////////////////////
  ////// Future tests that could be written //////
  ////////////////////////////////////////////////

  it("Deployer should be the owner.", async () => {})
  it("Compound Integration should deploy a Compound Facade.", async () => {})
})
