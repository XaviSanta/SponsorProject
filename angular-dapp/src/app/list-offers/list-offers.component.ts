import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements OnInit {
  @Input() accounts: string[] = [];

  constructor() { }

  ngOnInit() {
  }

}
