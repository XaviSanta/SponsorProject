pragma solidity ^0.6.0;

// import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol"; // Remix dev
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol"; //Local Dev (npm)

contract SponsorOffer_Divide is ChainlinkClient {
    uint256 constant private ORACLE_PAYMENT = 1 * LINK; // Price per job
    address constant private ORACLE_ADDRESS = 0xfa42eB0C75B4593b4377D19b6f0edB4Abc705D54;
    string constant private JOB_ID = "98e390a5427946cfa113a14dbe839b21"; // Likes < uint256
    address owner;
    uint256 song;
    uint256 limitDays;
    uint256 minLikes;
    
    // for testing:
    uint256 likesCount;
    address payable applier;
    
    mapping(address => VideoApplications[]) appliers;
    
    struct VideoApplications {
        string videoURL;
        uint numLikes;
    }
    
    event RequestLikesFulfilled(
        bytes32 indexed requestId,
        uint256 indexed likes
    );
    
    constructor (
        uint256  _song,
        uint256 _limitDays,
        uint256 _minLikes
        ) public payable  {
        setPublicChainlinkToken();
        owner = msg.sender;
        song = _song;
        limitDays = _limitDays;
        minLikes = _minLikes;
    }
    
    function getBalance() public view returns (uint){
        return address(this).balance;
    }
    function getMusicId() public view returns (uint256){
        return song;
    }
    
    /**
     * Allows users to introduce their VideoUrl and be able to participate 
     */
    function applyToOffer(string memory _videoUrl) public {
        applier = msg.sender;
        checkMusicUsed(ORACLE_ADDRESS, JOB_ID, _videoUrl);
                // ALternative: Add all the videos to the list and check them all on the limit day with the minlikes and return a bytes32 with the info needed
    }
    
    function checkMusicUsed(address _oracle, string memory _jobId, string memory _videoUrl) public  {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillMusicId.selector);
        req.add("videoUrl", _videoUrl);
        req.add("copyPath", "result.musicMeta.musicId");
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }
    
    function fulfillMusicId(bytes32 _requestId, uint256 _musicId) public recordChainlinkFulfillment(_requestId) {
        require(song == _musicId, "Music Id doesn't match");
        // TODO: Add video to the list?
        transferFunds();
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
    function requestLikes(address _oracle, string memory _jobId, string memory _videoUrl) public  {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillLikesCount.selector);
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
    
    function withdrawLink() public  {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
    
    function withdrawEth() public  {
        msg.sender.transfer(getBalance());
    }
    
    function getLikesCount() public view returns(uint256){
        return likesCount;
    }
}