const System = artifacts.require("System");

module.exports = (deployer, network, accounts) => {
    deployer.deploy(System);
}