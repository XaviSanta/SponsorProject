pragma solidity 0.6.6;

// import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol"; // Remix dev
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol"; //Local Dev (npm)
import "./OfferList.sol";

contract Offer is ChainlinkClient {
    uint256 constant private ORACLE_PAYMENT = 1 * LINK; // Price per job
    address constant private ORACLE_ADDRESS = 0xfa42eB0C75B4593b4377D19b6f0edB4Abc705D54;
    string constant private JOB_ID = "98e390a5427946cfa113a14dbe839b21"; // Likes < uint256
    address offerListAddr = 0x0b179553E46531397A4092501033dC8883B2235c;
    address payable owner;
    address payable applier;

    bool public applied = false;
    uint256 public song;
    string public songUrl;
    uint256 public limitDays;
    uint256 public finishTime;
    uint256 public minLikes;

    string videoUrl;

    event ApplicationFulfilled(
        bytes32 indexed requestId,
        string indexed videoUrl
    );

    event RequestLikesFulfilled(
        bytes32 indexed requestId,
        uint256 indexed likes
    );

    constructor (
        string memory _songUrl,
        uint256 _songId,
        uint256 _limitDays,
        uint256 _minLikes
        ) public payable  {
        setPublicChainlinkToken();
        owner = msg.sender;
        songUrl = _songUrl;
        song = _songId;
        limitDays = _limitDays;
        minLikes = _minLikes;

        OfferList offerList = OfferList(offerListAddr);
        offerList.addOffer(address(this));

        finishTime = now + _limitDays * 1 minutes; // Set minutes instead of days in testing
    }


    function getBalance() public view returns (uint){
        return address(this).balance;
    }

    /**
     * Allows users to introduce their VideoUrl and be able to participate
     */
    function applyToOffer(string memory _videoUrl) public {
        require(!applied, 'Someone already applied');
        applied = true;
        applier = msg.sender;
        videoUrl = _videoUrl;
        checkMusicId(ORACLE_ADDRESS, JOB_ID, _videoUrl);
    }

    function checkMusicId(address _oracle, string memory _jobId, string memory _videoUrl) private  {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillMusicId.selector);
        req.add("videoUrl", _videoUrl);
        req.add("copyPath", "result.musicId");
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillMusicId(bytes32 _requestId, uint256 _musicId) public recordChainlinkFulfillment(_requestId) {
        if (song != _musicId) {
            applied = false;
        } else {
            emit ApplicationFulfilled(_requestId, videoUrl);
            startSleep();
        }
    }

    function startSleep() private {
        address sleepOracle = 0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e; // Kovan oracle with sleep
        string memory sleepJobId = "a7ab70d561d34eb49e9b1612fd2e044b";
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(sleepJobId), address(this), this.sleepCallback.selector);
        req.addUint("until", finishTime);
        sendChainlinkRequestTo(sleepOracle, req, ORACLE_PAYMENT);
    }

    function sleepCallback(bytes32 _requestId) public recordChainlinkFulfillment(_requestId)
    {
        requestLikes(ORACLE_ADDRESS, JOB_ID, videoUrl);
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
    function requestLikes(address _oracle, string memory _jobId, string memory _videoUrl) private {
        Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), address(this), this.fulfillLikesCount.selector);
        req.add("videoUrl", _videoUrl);
        req.add("copyPath", "result.likes");
        sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    /**
     * Callback function
     */
    function fulfillLikesCount(bytes32 _requestId, uint256 _likes) public recordChainlinkFulfillment(_requestId) {
        emit RequestLikesFulfilled(_requestId, _likes);
        transferFunds(_likes);
    }

    function transferFunds(uint256 _likes) private {
        uint value = getBalance();
        require(value > 0, 'This contract has no balance');
        if (minLikes < _likes) {
            applier.transfer(value);
        } else {
            owner.transfer(value);
            // Also send the link tokens back if it had some left
            LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
            require(link.transfer(owner, link.balanceOf(address(this))), "Unable to transfer");
        }
    }

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
}
