import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Web3 from 'web3';
// import Web3Connect from 'web3connect';
// import WalletConnectProvider from '@walletconnect/web3-provider';
declare let require: any;
const contract = require('@truffle/contract');

declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;

  public accountsObservable = new Subject<string[]>();

  constructor() {
    // window.addEventListener('load', (event) => {
    //   this.bootstrapWeb3();
    // });
  }

  public async bootstrapWeb3() {
    // const web3Connect = new Web3Connect.Core({
    //   providerOptions: {
    //     walletconnect: {
    //       package: WalletConnectProvider, // required
    //       options: {
    //         infuraId: '2d964324c5e64933b885b9c03abdd6bb' // required
    //       }
    //     },
    //   }
    // });

    // // subscribe to connect
    // web3Connect.on("connect", (provider: any) => {
    //   this.web3 = new Web3(provider); // add provider to web3
    // });

    // // subscribe to close
    // web3Connect.on("close", () => {
    //   console.log("Web3Connect Modal Closed"); // modal has closed
    // });

    // web3Connect.toggleModal(); // open modal on button click
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.ethereum !== 'undefined') {
      // Use Mist/MetaMask's provider
      await window.ethereum.enable();
      this.web3 = new Web3(window.ethereum);
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }

    setInterval(() => this.refreshAccounts(), 1000);
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  private async refreshAccounts() {
    const accs = await this.getAccounts();

    if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
      console.log('Observed new accounts', accs);

      this.accountsObservable.next(accs);
      this.accounts = accs;
    }

    this.ready = true;
  }

  public async getBalance(address: string) {
    return await this.web3.eth.getBalance(address)
  }

  public async getAccounts() {
    const accs = await this.web3.eth.getAccounts();
    console.log('Refreshing accounts');

    // Get the initial account balance so it can be displayed.
    if (accs.length === 0) {
      console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
      return;
    }

    return accs;
  }

  public async getNetworkName(): Promise<string> {
    return this.web3.eth.net.getNetworkType()
  }
}
