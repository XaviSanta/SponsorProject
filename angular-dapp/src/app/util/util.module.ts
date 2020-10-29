import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './web3.service';
import { StringHelperService } from './string-helper.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    Web3Service,
    StringHelperService,
  ],
  declarations: []
})
export class UtilModule {
}
