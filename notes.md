# Contracts
## Why use smart contracts:
https://ethereum.org/en/developers/docs/dapps/
## Hold ether 
Just create the contract with value and it will hold it
## Use Link
* Connect to `Kovan|Ropsten test Network` in remix
  * Change remix to `http://`
  * Set environment to `Injected Web3`
  * Get some ETH https://faucet.kovan.network/ , https://faucet.ropsten.be/, http://faucet.bitfwd.xyz/, https://faucet.kyber.network/
  * Get some Link Test Tokens https://ropsten.chain.link/
## Oracle - Call adapter

## Call after period of time
[Chainlink alarm clock](https://docs.chain.link/docs/chainlink-alarm-clock)
# Oracle - Execute Code offChain
### [Delphi](https://delphi.systems/)
### [Oraclize](https://docs.provable.xyz/#background)
### [ChainLink](https://docs.chain.link/)
* [Core Adapters](https://www.youtube.com/watch?v=AtHp7me2Yks)
Already installed in chainlink software, http get, copy, json parse, etc
* External Adapters: build own external functinoality, can run off-chain. (Opensource packages for chainlink nodes.)
  * [Template](https://github.com/thodges-gh/CL-EA-NodeJS-Template)
  * [Examples](https://github.com/smartcontractkit/external-adapters-js)
  * Call the Likes API 
  * HOST external adapter on node that can put the data into the smart contract
1. Add it to a node/adapter listing service
   1. market.link
   2. 
2. Ask a node operator to host it. (Go to Discord platform)
3. Run a node yourself
   1. [AWS, Docker](https://medium.com/@linkblog/set-up-a-chainlink-test-node-with-aws-ec2-fiews-and-docker-84334cbaf507)
   2. [GCP](https://www.youtube.com/watch?v=t9Uknfw27IU)
## Serverless architecture (external adapter)
It starts a server when the url is called and turned off once finished the request
https://www.youtube.com/watch?v=GIu67qMAp7M
https://www.programmersought.com/article/38194416078/
### [GCP](http://cloud.google.com/)
1. Create Function
2. Configuration: TriggerType: HTTP, Allow unauthenticated invocations
3. Code: 
4. Test: 
   1. [Trigger](https://europe-west1-sponsorproject.cloudfunctions.net/function-1)
   2. Body:
   `{id: 0, data: {videoUrl: 'https://www.tiktok.com/@tiktok/video/6800111723257941253'}}`
### AWS 


* 
# TikTok API
* [Repo](https://github.com/drawrowfly/tiktok-scraper)
* `npm i tiktok-scraper`
* Deploy API in a server
  * AWS lambda
    * Error 500: "Internal Server Error"
    * TODO: Fix it
  * Heroku
  * others