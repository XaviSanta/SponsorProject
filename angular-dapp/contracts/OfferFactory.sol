pragma solidity 0.6.6;

import "./TikTokOffer.sol";

contract OfferFactory {
    address[] offerList;

    constructor() public {}

    function createOffer(
        string memory _songUrl,
        uint256  _songId,
        uint256 _limitDays,
        uint256 _minLikes
    ) public payable {
        TikTokOffer newOffer = (new TikTokOffer){value:msg.value}(_songUrl,_songId,_limitDays,_minLikes);
        offerList.push(address(newOffer));
    }

    function getOffers() public view returns (address[] memory) {
        return offerList;
    }
}