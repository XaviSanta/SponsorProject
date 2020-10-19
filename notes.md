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
  * Get some Link Test Tokens https://kovan.chain.link/
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

# Oracle - Execute Code offChain
### [Delphi](https://delphi.systems/)
### [Oraclize](https://docs.provable.xyz/#background)
### **[ChainLink](https://docs.chain.link/)** - *I will use this one*

# Adapters - Chainlink
* [Core Adapters](https://docs.chain.link/docs/adapters)
Already installed in chainlink software, http get, copy, json parse, etc
* External Adapters (EA): build own external functionality, can run off-chain. (Opensource packages for chainlink nodes.)
  * [Template](https://github.com/thodges-gh/CL-EA-NodeJS-Template)
  * [Examples](https://github.com/smartcontractkit/external-adapters-js)
  * Call the Likes API 
  * HOST external adapter on node that can put the data into the smart contract

If we want to use our EA in any smart contract. We have 2 options:
1. Ask a node operator to host it. (Go to Discord platform)
2. **Run a node yourself** - *I will go with that one to learn more about the project and have more control on what I do so then I don't need to depend from another person to debug my transaction.*
   
# Run a node ✅
https://docs.chain.link/docs/running-a-chainlink-node#config

https://www.youtube.com/watch?v=t9Uknfw27IU
## GCP ✅
1. Go to [ComputeEngine](https://console.cloud.google.com/compute/)
2. Create VM instance
   1. Machine type: 2 cores, 8 GB memory
   2. Ubuntu 18, SSD persistent disk
   3. Allow HTTP and HTTPS
3. Go to [Api & Services > Library](https://console.cloud.google.com/apis/library)
   1. Enable [Service Networking API](https://console.cloud.google.com/apis/library/servicenetworking.googleapis.com?q=service%20networking%20api&id=3be53c3f-b334-40eb-94f0-66b55195ed50)
4. Setup Databases
   1. Go to [SQL](https://console.cloud.google.com/sql/)
   2. Create instance
   3. Choose PostgreSQL
   4. Instance Id `chainlink-instance`
   5. Configuration options
      1. Connectivity: Check Private API
      2. Backups, recovery, and high availability: Set to High availability 
   6. Hit Create
   7. On production (Do a couple of permissions, who connect to the DB..)
   8. Go to Users
      1. Add User Account
      2. User `chainlink-db-user`
      3. Add
   9. Go to Databases
      1.  Create DB
      2.  Name: `chainlink-kovan-db`
5.  Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstart). To SSH tunnel into our google cloud VM and view the GUI.
6.  Open CMD on C:\Users\xavis\AppData\Local\Google\Cloud SDK     
```bash
  > gcloud config set project sponsorproject

  > gcloud compute --project "sponsorproject" ssh --zone "us-central1-a" "chainlink-kovan" -- -L 6688:localhost:6688
```
7. PuTTy is opened
8. Follow [Chainlink docu](https://docs.chain.link/docs/running-a-chainlink-node)
9. Set Ethereum Client with external provider
   1.  Login in [Infura](https://infura.io/)
   2.  Create a [Project](https://infura.io/dashboard/ethereum)
   3.  Copy wss endpoint for the websocket
```
echo "ETH_URL=wss://kovan.infura.io/ws/v3/2d964324c5e64933b885b9c03abdd6bc" >> ~/.chainlink-kovan/.env
```

10. Set remote DB config. (The one made in GCP)
```
echo "DATABASE_URL=postgresql://chainlink-db-user:password@10.96.16.3:5432/chainlink-kovan-db" >> ~/.chainlink-kovan/.env
```
11. Start the chainlink node
```
cd ~/.chainlink-kovan && docker run -p 6688:6688 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
12. Open [localhost:6688](http://localhost:6688/)

# Create an External Adapter ✅
## [GCP](http://cloud.google.com/) ✅
1. Set up billing account
1. Create Function
2. Configuration: TriggerType: `HTTP`, `Allow unauthenticated invocations`
3. [Code](https://github.com/XaviSanta/ExternalAdatper-TikTok): Call Scrapper TikTok and return num likes
4. Test -> POST: 
   1. https://europe-west3-sponsorproject.cloudfunctions.net/external-adapter-tiktok1
   2. Body:
   `{id: 0, data: {videoUrl: 'https://www.tiktok.com/@tiktok/video/6800111723257941253'}}`

## AWS 
* Aws was giving me problems maybe ill try it again


# Add the External Adapter to your node  ✅
Follow instructions to fulfill the requests from contracts:
https://docs.chain.link/docs/fulfilling-requests#config
* Deploy `Oracle.sol`. 
```js
pragma solidity 0.4.24;

import "https://github.com/smartcontractkit/chainlink/evm-contracts/src/v0.4/Oracle.sol";
```
With `0xa36085F69e2889c224210F603D836748e7dC0088` for Kovan.

This contract will receive the payments from the jobs done. The LINKs token can be withdrawn only by us.
* And Set fullfillment permission to your Node. The address of your node is in `Configuration > ACCOUNT_ADDRESS`

Now our Node can handle jobs.
My oracle contract addr: `0xfa42eB0C75B4593b4377D19b6f0edB4Abc705D54`
## Job Example
```
{
  "initiators": [
    {
      "type": "runlog",
      "params": {
        "address": "YOUR_ORACLE_CONTRACT_ADDRESS"
      }
    }
  ],
  "tasks": [
    {
      "type": "tiktok"
    },
    {
      "type": "copy"
    },
    {
      "type": "ethuint256"
    },
    {
      "type": "ethtx"
    }
  ]
}
```

# TikTok API
* [Repo](https://github.com/drawrowfly/tiktok-scraper)
* `npm i tiktok-scraper`
* Deploy API in a server
  * AWS lambda
    * Error 500: "Internal Server Error"
    * TODO: Fix it
  * GCP
    * It works: 
    * POST: 
       1. https://europe-west3-sponsorproject.cloudfunctions.net/external-adapter-tiktok
       2. Body:
       `{id: 0, data: {videoUrl: 'https://www.tiktok.com/@tiktok/video/6800111723257941253'}}`
  * Heroku
  * others