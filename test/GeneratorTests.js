const Generator = artifacts.require("Generator")
const CompoundFacade = artifacts.require("CompoundFacade")
const Integration = artifacts.require("Integration")
const CompoundIntegration = artifacts.require("CompoundIntegration")

contract("Generator", accounts => {
  it("It should have correct owner", async () => {
    const genInstance = await Generator.deployed();
    assert.equal(await genInstance.owner(), accounts[0], "The owner was not correct.")
  })

  it("It should add a new protocol", async () => {
    const genInstance = await Generator.deployed()
    const fakeInstance = "0xf25186B5081Ff5cE73482AD761DB0eB0d25abfBF"

    // Attach the deployed Compound facade to the generator functions
    await genInstance.addNewProtocol(fakeInstance)

    const firstProtocol = await genInstance.availableProtocols(0)
    assert.equal(firstProtocol, fakeInstance, "The new protocol was not properly deployed.")
  })

  it("It should have Compound Protocol attached", async () => {
    const genInstance = await Generator.deployed();
    const firstIntegrationAddress = await genInstance.availableProtocols(0)
    const firstIntegration = new Integration(firstIntegrationAddress)
    const firstIntegrationName = await firstIntegration.description()
    assert.equal(firstIntegrationName, "Compound Protocol", "The first attached integration should be Compound")
  })

  it("It should generate a new facade", async () => {
    const genInstance = await Generator.deployed()
    const newFacade = await genInstance.generateNewFacade(0, 0)
    const firstFacade = await genInstance.facades(accounts[0])
    console.log(newFacade, firstFacade)
    assert.equal(firstFacade.address, newFacadeAddress.address, "The deployed facade should be associated with the calling account.")
  })

  it("It should not allow a new facade to be created", async () => {
    const genInstance = await Generator.deployed();

    assert.equal(await genInstance.owner(), accounts[0], "The owner was not correct.")
  })

  it("It should destroy a facade", async () => {
    const genInstance = await Generator.deployed();

    assert.equal(await genInstance.owner(), accounts[0], "The owner was not correct.")
  })

  // Technically on the facade tests!
  it("It should have a ERC20 pair deployed", async () => {
    const compIntegration = await CompoundIntegration.deployed();
    console.log("WHAT", await compIntegration.availablePairs(0))

    let facade = await compIntegration.deployUserInstance(accounts[0], 0)
    console.log("YOOOO", {facade})

    assert.equal(await compIntegration.owner(), accounts[0], "The owner was not correct.")
  })
})
