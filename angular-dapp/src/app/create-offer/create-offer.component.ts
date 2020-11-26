import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { StringHelperService } from '../util/string-helper.service';
import { Web3Service } from '../util/web3.service';
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
    try {
      if (this.accounts === undefined) {
        this.accounts = await this.web3Service.getAccounts();
      }
    } catch(error) {
      this.setStatus('Connect your Wallet');
      return;
    }

    try {
      this.isLoading = true;
      const songId = this.stringHelperService.getSongId(this.song);
      const offerAbstraction = await this.web3Service.artifactsToContract(offer_artifacts);
      const offerInstance =
        await offerAbstraction.new(this.song, songId, this.limitDays, this.minLikes, {
          from: this.accounts[0],
          value: this.stringHelperService.convertEthToWei(this.value.toString()),
        });
      this.isLoading = false;
      this.contractAddress = offerInstance.address;
      this.setStatus(`Contract created successfully at address: ${offerInstance.address}`);
    } catch (error) {
      this.setStatus('Error on creating contract');
    }
  }

  // async withdrawEth() {
  //   try {
  //     const tikTokAbstraction = await this.web3Service.artifactsToContract(tikTokOffer_artifacts);
  //     const tiktokInstance = await tikTokAbstraction.at('0x3e9Ba1C4C356B7C0733309aaaD159eEBDFD9f95a');
  //     await tiktokInstance.withdrawEth({ from: this.accounts[0] });
  //   } catch (e) {
  //     console.log(e);
  //     // this.setStatus('Error sending coin; see log.');
  //   }
  // }

  setStatus(status) {
    this.matSnackBar.open(status, 'Close', {duration: 3000});
  }
}
