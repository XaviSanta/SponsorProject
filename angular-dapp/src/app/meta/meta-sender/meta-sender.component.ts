import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

// declare let require: any;
// const simpleStorage_artifacts = require('../../../../build/contracts/SimpleStorage.json');
import simpleStorage_artifacts from '../../../../build/contracts/SimpleStorage.json';

@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {
  accounts: string[];
  MetaCoin: any;

  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: ''
  };

  status = '';

  constructor(
    private web3Service: Web3Service,
    private matSnackBar: MatSnackBar,
  ) {
    console.log('Constructor: ', web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ', this.web3Service);
    console.log(this);
    this.watchAccount();
  }

  async set() {
    try {
      const simpleStorageAbstraction = await this.web3Service.artifactsToContract(simpleStorage_artifacts);
      console.log('simpleStorage:', simpleStorageAbstraction);
      const simpleStorageInstance = await simpleStorageAbstraction.deployed();
      console.log('simpleStorageInstance:', simpleStorageInstance);
      await simpleStorageInstance.set(89, { from: this.accounts[0] });
      const storedData = await simpleStorageInstance.get.call();
      console.log('storedData:', storedData);
      this.model.balance = storedData.words[0];
      this.refreshBalance();
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  connectWallet(): void {
    this.web3Service.bootstrapWeb3();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.refreshBalance();
    });
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

  async sendCoin() {
    if (!this.MetaCoin) {
      this.setStatus('Metacoin is not loaded, unable to send transaction');
      return;
    }

    const amount = this.model.amount;
    const receiver = this.model.receiver;

    console.log('Sending coins' + amount + ' to ' + receiver);

    this.setStatus('Initiating transaction... (please wait)');
    try {
      const deployedMetaCoin = await this.MetaCoin.deployed();
      const transaction = await deployedMetaCoin.sendCoin.sendTransaction(receiver, amount, {from: this.model.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error sending coin; see log.');
    }
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      const deployedMetaCoin = await this.MetaCoin.deployed();
      console.log(deployedMetaCoin);
      console.log('Account', this.model.account);
      const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.model.account);
      console.log('Found balance: ' + metaCoinBalance);
      this.model.balance = metaCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    console.log('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }

}
