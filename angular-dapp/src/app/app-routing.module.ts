import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplyOfferComponent } from './apply-offer/apply-offer.component';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { ListOffersComponent } from './list-offers/list-offers.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ListOffersComponent },
  { path: 'offers', component: ListOffersComponent },
  { path: 'create', component: CreateOfferComponent },
  { path: 'apply/:address', component: ApplyOfferComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
