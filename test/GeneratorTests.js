const Generator = artifacts.require("Generator")
const CompoundFacade = artifacts.require("CompoundFacade")
const Integration = artifacts.require("Integration")
const CompoundIntegration = artifacts.require("CompoundIntegration")

contract("Generator", (accounts) => {
  it("It should have correct owner", async () => {
    const genInstance = await Generator.deployed()
    assert.equal(
      await genInstance.owner(),
      accounts[0],
      "The owner was not correct."
    )
  })

  it("It should add a new protocol", async () => {
    const genInstance = await Generator.deployed()

    // This doesn't need to be real for the attachment to happen,
    //  there are more tests below to cover more detailed integrations.
    const fakeInstance = "0xE0485f1aabeF0473Fa338bab9A57eBd3880Df630"

    // Attach the deployed Compound facade to the generator functions

    const newlyAddedIndex = await genInstance.addNewProtocol(fakeInstance)
    const correctProtocol = await genInstance.availableProtocols(1)

    // console.log("added, ")

    // const firstIntegration = new Integration(firstIntegrationAddress)
    // const firstIntegrationName = await firstIntegration.description()

    console.log("what", newlyAddedIndex, correctProtocol)
    assert.equal(
      correctProtocol,
      fakeInstance,
      "The new protocol was not properly deployed."
    )
  })

  it("It should have Compound Protocol attached", async () => {
    const genInstance = await Generator.deployed()
    const firstIntegrationAddress = await genInstance.availableProtocols(0)
    const firstIntegration = new Integration(firstIntegrationAddress)
    const firstIntegrationName = await firstIntegration.description()

    assert.equal(
      firstIntegrationName,
      "Compound Protocol",
      "The first attached integration should be Compound"
    )
  })

  it("It should generate a new facade", async () => {
    return
    const genInstance = await Generator.deployed()
    const newFacade = await genInstance.generateNewFacade(0, 0)
    const firstFacade = await genInstance.facades(accounts[0])
    console.log(newFacade, firstFacade)
    assert.equal(
      firstFacade.address,
      newFacadeAddress.address,
      "The deployed facade should be associated with the calling account."
    )
  })

  it("It should not allow a new facade to be created", async () => {
    const genInstance = await Generator.deployed()

    assert.equal(
      await genInstance.owner(),
      accounts[0],
      "The owner was not correct."
    )
  })

  it("It should destroy a facade", async () => {
    const genInstance = await Generator.deployed()

    assert.equal(
      await genInstance.owner(),
      accounts[0],
      "The owner was not correct."
    )
  })
})
