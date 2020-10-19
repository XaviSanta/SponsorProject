pragma solidity 0.4.24;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/ChainlinkClient.sol";
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/vendor/Ownable.sol";

contract SponsorOffer_Divide is ChainlinkClient, Ownable {
    uint256 constant private ORACLE_PAYMENT = 1 * LINK; // Price per job
    address constant private ORACLE_ADDRESS = 0xfa42eB0C75B4593b4377D19b6f0edB4Abc705D54;
    string constant private JOB_ID = "98e390a5427946cfa113a14dbe839b21"; // Likes < uint256
    address owner;
    string song;
    uint256 limitDays;
    uint256 minLikes;
    
    // for testing:
    uint256 likesCount;
    address applier;
    
    mapping(address => VideoApplications[]) appliers;
    
    struct VideoApplications {
        string videoURL;
        uint numLikes;
    }
    
    event RequestLikesFulfilled(
        bytes32 indexed requestId,
        uint256 indexed likes
    );
    
    constructor (string memory _song, uint _limitDays, uint _minLikes)
    public payable Ownable() 
    {
        setPublicChainlinkToken();
        owner = msg.sender;
        song = _song;
        limitDays = _limitDays;
        minLikes = _minLikes;
    }
    
    function getBalance() public view returns (uint){
        return address(this).balance;
    }
    
    /**
     * Allows users to introduce their VideoUrl and be able to participate 
     */
    function applyToOffer(string memory _videoUrl) public {
        // TODO: Check videoURL isnt already listed
        // TODO: Check musicId
        // TODO: Add video to the list
        // appliers[msg.sender] = VideoApplications(_videoURL, 0);
        
        applier = msg.sender;
        requestLikes(ORACLE_ADDRESS, JOB_ID, _videoUrl); // RODO: Change with 'check music id'
    }
    
    /**
     * Asks for the number of likes and calls the callback function once finished with the result
     * 
     * Params:
     * 
     *      Oracle: Address of the Orcale contract that the node is listed - 0xfa42eB0C75B4593b4377D19b6f0edB4Abc705D54
     *      JobId: Id of the Job we are willing to return - 98e390a5427946cfa113a14dbe839b21
     *      VideoUrl: Link of the tiktok video we want to extract info from
     */ 
    function requestLikes(address _oracle, string _jobId, string _videoUrl) public onlyOwner {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillLikesCount.selector);
        req.add("videoUrl", _videoUrl);
        req.add("copyPath", "result.likesCount");
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }
    
    /**
     * Callback function
     */ 
    function fulfillLikesCount(bytes32 _requestId, uint256 _likes) public recordChainlinkFulfillment(_requestId) {
        emit RequestLikesFulfilled(_requestId, _likes);
        likesCount = _likes;
        transferFunds();
    }

    // TODO: Pay amount
    function transferFunds() private { 
        // TODO: When daylimit reaches
        // TODO: Calculate amount to pay to everybody
        // TODO: transfer rewards to each one that has more than min likes
        uint value = getBalance();
        require(value > 0, 'This contract has no balance');
        applier.transfer(value);  
    }
    
    // TODO: Extend day limit 
    // TODO: Extend Rewards
    
    
    // ----------------------
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
          return 0x0;
        }
        
        assembly { // solhint-disable-line no-inline-assembly
          result := mload(add(source, 32))
        }
    }
    
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
    
    function withdrawEth() public onlyOwner {
        msg.sender.transfer(getBalance());
    }
    
    function getLikesCount() public view returns(uint256){
        return likesCount;
    }
}