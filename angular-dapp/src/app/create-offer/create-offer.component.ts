import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { StringHelperService } from '../util/string-helper.service';
import { Web3Service } from '../util/web3.service';
import tikTokOffer_artifacts from '../../../build/contracts/TikTokOffer.json';
import offerFactory_artifacts from '../../../build/contracts/OfferFactory.json';
import offer_artifacts from '../../../build/contracts/Offer.json';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {
  accounts: string[];
  song: string;
  limitDays: number;
  minLikes: number;
  value: number;
  contractAddress: string;
  isLoading: boolean = false;

  constructor(
    private web3Service: Web3Service,
    private matSnackBar: MatSnackBar,
    private stringHelperService: StringHelperService,
  ) {}

  ngOnInit() {
    this.watchAccount();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  async createContract() {
    this.isLoading = true;
    await this.checkAccounts();
    const songId = this.stringHelperService.getSongId(this.song);
    try {
      const offerAbstraction = await this.web3Service.artifactsToContract(offer_artifacts);
      console.log('Creating Contract with arguments: ', this.song, songId, this.limitDays, this.minLikes);
      const offerInstance =
        await offerAbstraction.new(this.song, songId, this.limitDays, this.minLikes, { // BigNumber error => pass it as string
          from: this.accounts[0],
          value: this.stringHelperService.convertEthToWei(this.value.toString()),
        });
      console.log('Contract created successfully at address: ', offerInstance.address);
      this.isLoading = false;
      this.contractAddress = offerInstance.address;
      this.setStatus(`Contract created successfully at address: ${offerInstance.address}`);
    } catch (error) {
      console.log('Error on creating contract: ', error);
    }
  }

  async checkAccounts() {
    if (this.accounts === undefined) {
      this.accounts = await this.web3Service.getAccounts();
    }
  }

  async withdrawEth() {
    try {
      const tikTokAbstraction = await this.web3Service.artifactsToContract(tikTokOffer_artifacts);
      const tiktokInstance = await tikTokAbstraction.at('0x3e9Ba1C4C356B7C0733309aaaD159eEBDFD9f95a');
      await tiktokInstance.withdrawEth({ from: this.accounts[0] });
    } catch (e) {
      console.log(e);
      // this.setStatus('Error sending coin; see log.');
    }
  }

  // goBack(): void {
  //   if (this.navigated) {
  //     window.history.back();
  //   }
  // }

  setStatus(status) {
    this.matSnackBar.open(status, 'Close', {duration: 3000});
  }
}
