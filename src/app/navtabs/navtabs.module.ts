import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavtabsPageRoutingModule } from './navtabs-routing.module';

import { NavtabsPage } from './navtabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavtabsPageRoutingModule
  ],
  declarations: [NavtabsPage]
})
export class NavtabsPageModule {}
