# Contracts
## Why use smart contracts:
https://ethereum.org/en/developers/docs/dapps/
## Hold ether 
* Just create the contract with value and it will hold it
* Send Ether to the contract address
## Use Link
* Connect to `Kovan|Ropsten test Network` in remix
  * Change remix to `http://`
  * Set environment to `Injected Web3`
  * Get some ETH https://faucet.kovan.network/ , https://faucet.ropsten.be/, http://faucet.bitfwd.xyz/, https://faucet.kyber.network/
  * Get some Link Test Tokens https://ropsten.chain.link/
## Oracle - Call adapter
Ropsten is currently broken 15/10/20. I'm going to use Kovan.
1. Import the contracts needed to use ChainLink
```javascript
pragma solidity ^0.6.0;
```
2. Import the contracts needed to use ChainLink
```javascript
import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.6/ChainlinkClient.sol";
```
3. JobId and Oracle Address
```js
  function requestLikes(address _oracle, string _jobId)
    public
    onlyOwner
  {
    Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(_jobId), this, this.fulfillLikes.selector);
    req.add("videoUrl", "https://www.tiktok.com/@tiktok/video/6881450806688664838");
    req.add("copyPath", "result.likesCount");
    sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }
```
* `fullfillLikes` is the callback function
* `videoUrl`: is the parameter for the tiktok adapter. It returns a JSON object with information about the video requested.
* `copyPath`: is the parameter for the copy adapter. This adapter returns the value of the key requested. It is extracted from a JSON object. In this case the JSON is the result body data from the HttpPost is made in the tiktok EA. 
## Call after period of time
[Chainlink alarm clock](https://docs.chain.link/docs/chainlink-alarm-clock)