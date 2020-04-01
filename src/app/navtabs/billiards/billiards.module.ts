import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BilliardsPageRoutingModule } from './billiards-routing.module';

import { BilliardsPage } from './billiards.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BilliardsPageRoutingModule
  ],
  declarations: [BilliardsPage]
})
export class BilliardsPageModule {}
