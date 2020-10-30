import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StringHelperService } from '../util/string-helper.service';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements AfterViewInit {
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @Input() accounts: string[] = [];

  displayedColumns: string[] = ['address', 'song', 'minLikes', 'value', 'actions'];
  dataSource = new MatTableDataSource<Offer>(ELEMENT_DATA);

  constructor(
    public stringHelperService: StringHelperService,
    private router: Router,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  gotoOffer(offerAddress: string): void {
    console.log(offerAddress)
    const link = ['/apply', offerAddress];
    this.router.navigate(link);
  }

  simplifyAddress(address: string) {
    const start = address.substring(0, 6);
    const end = address.substring(address.length-4);
    return `${start}......${end}`;
  }

  simplifySongUrl(address: string) {
    const start = address.substring(0, 5);
    const end = address.substring(address.length-4);
    return `${start}......${end}`;
  }
}

export interface Offer {
  address: string
  song: string;
  minLikes: number;
  value: string;
}

const ELEMENT_DATA: Offer[] = [
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795FcF', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 1000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fca', song: 'https://www.tiktok.com/music/sonido-original-6885705041103768321?lang=en', minLikes: 22000000, value: '2100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcb', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=es', minLikes: 200030, value: '1100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcc', song: 'https://www.tiktok.com/music/sonido-original-6885705041103768321', minLikes: 2300000, value: '21100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcd', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 3000, value: '1200000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fce', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 234400, value: '1010000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: 'https://www.tiktok.com/music/Kiss-6842566676811172614?lang=en', minLikes: 2000000, value: '12200000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 23000, value: '121100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 2000000, value: '210210000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fca', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 22000000, value: '1200000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcb', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 200030, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcc', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 2300000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcd', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 3000, value: '12000020000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fce', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 234400, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 2000000, value: '1200000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 23000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fci', song: 'https://www.tiktok.com/music/Space-Cadet-Metro-Boomin-6872036029340158726?lang=en', minLikes: 2000000, value: '100000000000000000'},
];
