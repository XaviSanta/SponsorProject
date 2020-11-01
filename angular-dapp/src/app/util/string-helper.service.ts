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

  public simplifySongUrl(songUrl: string, slice: boolean = true) {
    const searchString = 'https://www.tiktok.com/music/';
    if (songUrl.indexOf(searchString) === 0) {
      let name = songUrl.substring(searchString.length);
      name = name.replace(/\?.*/,''); // Removes after query '?'
      return slice ? `${name.slice(0, 20)}...` : name;
    }

    const end = songUrl.substring(songUrl.length-8);
    return `...${end}`;
  }

  public getSongId(url: string): string {
    // (\d+)(?!.*\d) // Matches the last number in a string
    var regex = /(\d+)(?!.*\d)/;
    var res = regex.exec(url);
    return res === null ? null : res[0];
  }

  public simplifyLikes(numLikes: number) {
    const numString = numLikes.toString();
    const len = numString.length;
    if (len > 6 ) {
      const start = numString.substring(0, len-6);
      const i = numString[len-6];
      return `${start}.${i}M`;
    }
    if (len > 3 ) {
      const start = numString.substring(0, len-3);
      const i = numString[len-3];
      return `${start}.${i}K`;
    }

    return numString;
  }

  public convertWeiToEth(weis: string): string {
    return Web3.utils.fromWei(weis, 'ether').substring(0,6);
  }

  public convertEthToWei(ethers: string): string {
    return Web3.utils.toWei(ethers);
  }
}
