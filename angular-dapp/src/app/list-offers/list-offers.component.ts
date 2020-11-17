import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StringHelperService } from '../util/string-helper.service';
import { MatSort } from '@angular/material/sort';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import offer_artifacts from '../../../build/contracts/Offer.json';
import offerList_artifacts from '../../../build/contracts/OfferList.json';
import { Web3Service } from '../util/web3.service';
@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  @Input() accounts: string[] = [];

  displayedColumns: string[] = ['address', 'song', 'minLikes', 'value', 'actions'];
  dataSource = new MatTableDataSource<Offer>([]);
  offerAdresses;

  listOfferAddresses: string[] = [];
  offerAbstraction;

  constructor(
    public stringHelperService: StringHelperService,
    private router: Router,
    private web3Service: Web3Service,
  ) { }

  async ngOnInit() {
    // For later usage on retrieving the offer informations from the addresses
    this.offerAbstraction = await this.web3Service.artifactsToContract(offer_artifacts);

    this.listOfferAddresses = await this.getOffers();
    this.listOfferAddresses.forEach(async (addr) => {
      const offer = await this.getOfferInfo(addr);
      this.dataSource.data = [...this.dataSource.data, offer];
    });
  }

  async getOffers() {
    const offerListAbstraction = await this.web3Service.artifactsToContract(offerList_artifacts);
    const instance = await offerListAbstraction.deployed();
    return await instance.getOffers.call();
  }

  async getOfferInfo(address: string) {
    const offerInstance = await this.offerAbstraction.at(address);
    const song = await offerInstance.getMusicUrl.call();
    const minLikes = await offerInstance.getMinLikes.call();
    const value = await offerInstance.getBalance.call();
    return {
      address,
      song,
      value: value.toString(),
      minLikes: minLikes.toString(),
    } as Offer;
  }

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
