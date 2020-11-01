import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import tikTokOffer_artifacts from '../../../build/contracts/TikTokOffer.json';
import { StringHelperService } from '../util/string-helper.service';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: 'app-apply-offer',
  templateUrl: './apply-offer.component.html',
  styleUrls: ['./apply-offer.component.css']
})
export class ApplyOfferComponent implements OnInit {
  contractAddress: string;
  accounts: string[];
  song: string;
  songSimplified: string;
  limitDays: number;
  minLikes: number;
  videoUrl: string;
  value: string = 'NaN Refresh Value';
  tikTokAbstraction;
  tiktokInstance;
  subtitle: string = '';
  constructor(
    private web3Service: Web3Service,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    public stringHelperService: StringHelperService,
  ) {}

  async ngOnInit() {
    if (this.accounts !== null && this.accounts !== undefined) {
      console.log('aaaa', this.accounts)
      this.setBalance();
    }

    this.route.params.forEach(async(params: Params) => {
      if (params['address'] !== undefined) {
        this.contractAddress = params['address'];
        console.log(this.contractAddress)
        this.tikTokAbstraction = await this.web3Service.artifactsToContract(tikTokOffer_artifacts);
        this.tiktokInstance = await this.tikTokAbstraction.at(this.contractAddress);
        // TODO: Get data
        this.checkAccounts();
        this.setInfo();
      }
    });

    this.watchAccount();
  }

  setStatus(status) {
    this.matSnackBar.open(status, 'Close', {duration: 3000});
  }

  async checkAccounts() {
    if (this.accounts === undefined) {
      this.accounts = await this.web3Service.getAccounts();
    }
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      this.setInfo();
    });
  }

  async applyOffer() {
    try {
      await this.tiktokInstance.applyToOffer(this.videoUrl, { from: this.accounts[0] });
    } catch (e) {
      console.log(e);
      this.setStatus('Error on applying.');
    }
  }

  setInfo() {
    try {
      this.tiktokInstance.getMusicUrl.call().then((value) => {
        this.song = value;
        this.songSimplified = this.stringHelperService.simplifySongUrl(value, false);
      });
      this.tiktokInstance.getLimitDays.call().then((value) => this.limitDays = value);
      this.tiktokInstance.getMinLikes.call().then((value) => this.minLikes = value);
      this.tiktokInstance.getBalance.call().then((value) => this.value = value);
    } catch(e) {
      console.log(e);
    }
  }

  async setBalance() {
    try {
      this.value = await this.web3Service.getBalance(this.contractAddress);
    } catch(e) {
      console.log(e);
    }
  }

  async w() {
    try {
      console.log(this.accounts[0])
      const tikTokAbstraction = await this.web3Service.artifactsToContract(tikTokOffer_artifacts);
      const tiktokInstance = await tikTokAbstraction.at('0x3e9Ba1C4C356B7C0733309aaaD159eEBDFD9f95a');
      await tiktokInstance.withdrawEth({ from: this.accounts[0] });
    } catch(e) {
      console.log(e);
    }
  }
}
