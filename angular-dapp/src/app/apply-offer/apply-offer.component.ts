import { Component, Input, OnInit } from '@angular/core';
import tikTokOffer_artifacts from '../../../build/contracts/TikTokOffer.json';
import { Web3Service } from '../util/web3.service';

@Component({
  selector: 'app-apply-offer',
  templateUrl: './apply-offer.component.html',
  styleUrls: ['./apply-offer.component.css']
})
export class ApplyOfferComponent implements OnInit {
  @Input() accounts: string[];
  @Input() song: string;
  @Input() limitDays: number;
  @Input() minLikes: number;
  @Input() contractAddress: string;
  videoUrl: string;
  value: string = 'NaN Refresh Value';

  constructor(
    private web3Service: Web3Service,
  ) {}

  ngOnInit() {
    if (this.accounts !== null && this.accounts !== undefined) {
      console.log('aaaa', this.accounts)
      this.setBalance();
    }
  }

  async applyOffer() {
    console.log('VideoUrl: ', this.videoUrl);
    console.log('acc: ', this.accounts);
    try {
      const tikTokAbstraction = await this.web3Service.artifactsToContract(tikTokOffer_artifacts);
      const tiktokInstance = await tikTokAbstraction.at(this.contractAddress);
      await tiktokInstance.applyToOffer(this.videoUrl, { from: this.accounts[0] });
    } catch (e) {
      console.log(e);
      // this.setStatus('Error sending coin; see log.');
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
