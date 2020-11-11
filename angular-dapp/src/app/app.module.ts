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
  MatSortModule,
  MatChipsModule,
} from '@angular/material';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { ApplyOfferComponent } from './apply-offer/apply-offer.component';
import { ListOffersComponent } from './list-offers/list-offers.component';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';

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
    MatSortModule,
    MatChipsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ClipboardModule,
    MetaModule
  ],
  providers: [ClipboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
