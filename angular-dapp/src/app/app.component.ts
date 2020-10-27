import { Component, OnInit } from '@angular/core';
import { Web3Service } from './util/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  accounts: string[] = [];

  constructor(
    private web3Service: Web3Service,
  ) {};

  ngOnInit():void {
    this.watchAccount();
  }

  connectWallet(): void {
    this.web3Service.bootstrapWeb3();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      // this.refreshBalance();
    });
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      // const deployedMetaCoin = await this.MetaCoin.deployed();
      // console.log(deployedMetaCoin);
      // console.log('Account', this.model.account);
      // const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.model.account);
      // console.log('Found balance: ' + metaCoinBalance);
      // this.model.balance = metaCoinBalance;
    } catch (e) {
      console.log(e);
      // this.setStatus('Error getting balance; see log.');
    }
  }
}
