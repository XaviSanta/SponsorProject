import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import offer_artifacts from '../../../build/contracts/Offer.json';
import { StringHelperService } from '../util/string-helper.service';
import { TiktokService } from '../util/tiktok.service';
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
  finishDate: string;
  finishDayDate: Date;
  todayDate = new Date();
  minLikes: number;
  videoUrl: string;
  value: string = 'NaN Refresh Value';
  offerAbstraction;
  offerInstance;
  subtitle: string = '';

  constructor(
    private web3Service: Web3Service,
    private route: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    public stringHelperService: StringHelperService,
    private tiktokService: TiktokService,
  ) {}

  async ngOnInit() {
    if (this.accounts !== null && this.accounts !== undefined) {
      this.setBalance();
    }

    this.route.params.forEach(async(params: Params) => {
      if (params['address'] !== undefined) {
        this.contractAddress = params['address'];
        console.log(this.contractAddress)
        this.offerAbstraction = await this.web3Service.artifactsToContract(offer_artifacts);
        this.offerInstance = await this.offerAbstraction.at(this.contractAddress);
        this.checkAccounts();
        this.setInfo();
      }
    });

    this.watchAccount();
  }

  setStatus(status) {
    this.matSnackBar.open(status, 'Close', {duration: 5000});
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
      this.offerInstance.ApplicationFulfillment().on('data', event => {
        if(event.args.isFulfilled) {
          this.setStatus('Video is applied correctly.');
        } else {
          this.setStatus('Video did not apply correctly, song used is not the same');
        }
      });
      await this.offerInstance.applyToOffer(this.videoUrl, {
        from: this.accounts[0] }).on('receipt',
          (receipt) => {
            this.setStatus('Transaction confirmed, checking song used in the video...');
          });
    } catch (e) {
      this.setStatus('Error on applying.');
    }
  }

  setInfo() {
    try {
      this.offerInstance.songUrl.call().then((value) => {
        this.song = value;
        this.songSimplified = this.stringHelperService.simplifySongUrl(value, false);
      });
      this.offerInstance.finishTime.call().then((value) => {
        this.finishDayDate = new Date(+`${value.toString()}000`);
        this.finishDate = this.stringHelperService.getDateFromEpoch(value);
      });
      this.offerInstance.minLikes.call().then((value) => this.minLikes = value);
      this.web3Service.getBalance(this.contractAddress).then((value) => this.value = value);
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

  checkVideoMusic() {
    this.tiktokService.getVideoMetadata(this.videoUrl).subscribe(
      (res) => {
        console.log(res);
        this.setStatus('');
      },
      (err) => {
        console.log(err);
        this.setStatus('Error');
      }
    );
  }

  async withdrawEth() {
    try {
      console.log(this.accounts[0])
      const offerAbstraction = await this.web3Service.artifactsToContract(offer_artifacts);
      const offerInstance = await offerAbstraction.at(this.contractAddress);
      await offerInstance.withdrawEth({ from: this.accounts[0] });
      this.setStatus('Eth claimed!');
    } catch(e) {
      this.setStatus('Error on claiming ETH');
      console.log(e);
    }
  }
}
