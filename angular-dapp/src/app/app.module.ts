import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetaModule } from './meta/meta.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule,
  MatTableModule,
  MatPaginatorModule,
} from '@angular/material';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { ApplyOfferComponent } from './apply-offer/apply-offer.component';
import { ListOffersComponent } from './list-offers/list-offers.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateOfferComponent,
    ApplyOfferComponent,
    ListOffersComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MetaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
