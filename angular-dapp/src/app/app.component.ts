import { Component, OnInit } from '@angular/core';
import { StringHelperService } from './util/string-helper.service';
import { Web3Service } from './util/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  accounts: string[] = [];
  simplifiedAcc: string = '';
  balance: string = '0';
  network: string = '';

  constructor(
    public stringHelperService: StringHelperService,
    private web3Service: Web3Service,
  ) {};

  ngOnInit():void {
    this.watchAccount();
  }

  connectWallet(): void {
    this.web3Service.bootstrapWeb3();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe(async (accounts) => {
      this.accounts = accounts;
      this.simplifiedAcc = this.stringHelperService.simplifyAddress(this.accounts[0]);
      this.web3Service.getBalance(this.accounts[0]).then(value =>
        this.balance = this.stringHelperService.convertWeiToEth(value));
      this.web3Service.getNetworkName().then(value => this.network = value);
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
