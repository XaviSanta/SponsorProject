import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StringHelperService } from '../util/string-helper.service';

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements AfterViewInit {
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
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795FcF', song: '6872036029340158726', minLikes: 1000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fca', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcb', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcc', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fcd', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fce', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fch', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
  {address: '0xB55C003647B5cE2982D38f04F28C61Cb5c795Fci', song: '6872036029340158726', minLikes: 2000000, value: '100000000000000000'},
];
