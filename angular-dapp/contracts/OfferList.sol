pragma solidity 0.6.6;

contract OfferList {
  address[] offerList;

  constructor() public {}

  function getOffers() public view returns (address[] memory)
  {
    return offerList;
  }

  function addOffer(address _offer) public {
    offerList.push(_offer);
  }
}
