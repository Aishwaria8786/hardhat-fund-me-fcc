//async function deployFunc(hre) {
//     console.log("Hi!")
// hre.getNamedAccounts,
// hre.deployments
// }
// module.exports.default = deployFunc
// module.exports = async (hre) => {
//     const { getNamedAccounts, deployments } = hre

const { network } = require("hardhat")
const { networkConfig, developmentChain } = require("../helper-hardhat-config")
const { verify } = require("../utilis/verify")
// }
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChain.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChain.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        //VERIFY
        await verify(fundMe.address, args)
    }
    log("-------------------------------")
}
module.exports.tags = ["all", "fundme"]
