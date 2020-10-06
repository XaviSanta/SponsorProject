pragma solidity 0.6.8;
// SPDX-License-Identifier: MIT

contract SponsorOffer_Divide {
    address owner;
    string song;
    uint limitDays;
    uint minLikes;
    
    mapping(address => Applier) appliers;
    
    struct Applier {
        string videoURL;
        uint numLikes;
    }
    
    constructor (
        string memory _song,
        uint _limitDays,
        uint _minLikes
        ) public payable {
        owner = msg.sender;
        song = _song;
        limitDays = _limitDays;
        minLikes = _minLikes;
    }
    
    function getBalance() public view returns (uint){
        return address(this).balance;
    }
    
    // TODO: Extend Rewards
    
    // TODO: Apply to offer
    function applyToOffer(string memory _videoURL) public {
        // TODO: Check videoURL doesnt exist
        appliers[msg.sender] = Applier(_videoURL, 0);
    }
    
    // TODO: Extend day limit
    
    // TODO: Pay amount
    function transferFunds() public { 
        // TODO: When daylimit reaches
        // TODO: Calculate amount to pay to everybody
        // TODO: transfer rewards to each one that has more than min likes
        uint value = getBalance();
        require(value > 0, 'This contract has no balance');
        msg.sender.transfer(getBalance());  
    }
    
}