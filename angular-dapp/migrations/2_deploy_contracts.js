var OfferFactory = artifacts.require("./OfferFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(OfferFactory);
};
