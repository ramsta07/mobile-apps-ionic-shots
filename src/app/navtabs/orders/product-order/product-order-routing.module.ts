import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductOrderPage } from './product-order.page';

const routes: Routes = [
  {
    path: '',
    component: ProductOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductOrderPageRoutingModule {}
