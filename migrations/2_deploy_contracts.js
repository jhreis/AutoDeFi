const Generator = artifacts.require("Generator")
// const CompoundFacade = artifacts.require("CompoundFacade")
const CompoundIntegration = artifacts.require("CompoundIntegration")
const Integration = artifacts.require("Integration")
const StandardERC20 = artifacts.require("StandardERC20")

// Storing instances of these deployed contracts
let generator, compoundIntegration

module.exports = async function (deployer, network, accounts) {
  const rest = async () => {
    console.log({ network })

    // getERC20s

    // deployer.deploy(CompoundFacade, accounts[0], USDC, cUSDC)
  }

  // First execution, retrieving deployed contracts
  console.log("Deploying Generator")
  deployer
    .deploy(Generator)
    .then((generatorInstance) => {
      generator = generatorInstance
      console.log("Deploying Compound Integration")
      return deployer.deploy(CompoundIntegration)
    })
    .then((compound) => {
      compoundIntegration = compound
      console.log("Connecting Compound")
      return generator.addNewProtocol(compoundIntegration.address)
    })
    .then(() => getERC20s(deployer, network))
    .then((addresses) => {
      const [underlying, minting] = addresses
      console.log({ underlying, minting })
      console.log("Connecting asset pair into Compound")
      return compoundIntegration.addAvailablePair(underlying, minting)
    })
  // .then((pairIndex) => {
  //   console.log("Deployed pair with index", pairIndex)
  // })
}

///
function localNetworkDeployments(deployer) {
  // Deployed addresses to return
  let addresses = []
  return deployer
    .deploy(StandardERC20, 1000, "Fake USDC", 18, "fUSDC")
    .then((deployOne) => {
      addresses.push(deployOne.address)
      return deployer.deploy(StandardERC20, 1000, "Fake cUSDC", 18, "fcUSDC")
    })
    .then((deployTwo) => {
      addresses.push(deployTwo.address)
      return addresses
    })
}

/// Returns a promise that includes two addresses
/// Underlying token + minting asset
async function getERC20s(deployer, network) {
  console.log("Detecting Network")

  const localNetworks = ["develop", "test2"]
  if (localNetworks.includes(network)) {
    console.log(
      `Local build from network: ${network}, deploying fake ERC20 tokens!`
    )
    return localNetworkDeployments(deployer).then((addresses) => {
      const [fUSDC, fcUSDC] = addresses
      console.log("Deployed fake ERC20s:", { fUSDC, fcUSDC })

      return addresses
    })
    return
  } else {
    console.log(
      `Real network detected: ${network}, using real ERC20 addresses!`
    )
    const USDC = "0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b"
    const cUSDC = "0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1"
    // If running a prod build we want to use real addresses!
    return [USDC, cUSDC]
  }
}
