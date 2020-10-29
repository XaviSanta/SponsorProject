import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable()
export class StringHelperService {

  constructor() { }

  public simplifyAddress(address: string) {
    try {
      if(address === null) {
        return;
      }
      const start = address.substring(0, 6);
      const end = address.substring(address.length-4);
      return `${start}...${end}`;
    } catch(e) {
      console.log('error on simplifying address');
    }
  }

  public simplifySongUrl(address: string) {
    const start = address.substring(0, 5);
    const end = address.substring(address.length-4);
    return `${start}......${end}`;
  }

  public convertWeiToEth(weis: string): string {
    return Web3.utils.fromWei(weis, 'ether').substring(0,6);
  }

  public convertEthToWei(ethers: string): string {
    return Web3.utils.toWei(ethers);
  }
}
