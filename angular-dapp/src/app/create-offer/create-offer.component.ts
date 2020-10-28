import { Component, Input, OnInit } from '@angular/core';
import tikTokOffer_artifacts from '../../../build/contracts/TikTokOffer.json';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.css']
})
export class CreateOfferComponent implements OnInit {
  @Input() accounts: string[];
  song: string;
  limitDays: number;
  minLikes: number;
  value: number;

  constructor(
    private web3Service: Web3Service,
  ) {}

  ngOnInit() {
    this.watchAccount();
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  async createContract(e) {
    console.log('Creating Contract', e);
    console.log('Creating Contract', this.song, this.limitDays, this.minLikes, this.value);
    try {
      const tikTokAbstraction = await this.web3Service.artifactsToContract(tikTokOffer_artifacts);
      const tiktokInstance =
        await tikTokAbstraction.new(this.song, this.limitDays, this.minLikes, {
          from: this.accounts[0],
          value: this.value,
        });
      console.log('Contract created successfully at address: ', tiktokInstance.address);
    } catch (error) {
      console.log('Error on creating contract: ', error);
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
}
