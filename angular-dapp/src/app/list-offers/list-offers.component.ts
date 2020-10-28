import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements OnInit {
  @Input() accounts: string[] = [];

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  gotoOffer(offerAddress: string): void {
    console.log(offerAddress)
    const link = ['/apply', offerAddress];
    this.router.navigate(link);
  }
}
