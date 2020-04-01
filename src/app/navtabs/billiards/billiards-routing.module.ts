import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BilliardsPage } from './billiards.page';

const routes: Routes = [
  {
    path: '',
    component: BilliardsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BilliardsPageRoutingModule {}
