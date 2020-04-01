import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NavtabsPage } from './navtabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: NavtabsPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
          }
        ]
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            loadChildren: () => import('./orders/orders.module').then(m => m.OrdersPageModule)
          },
          {
            path: ':tableId',
            loadChildren: () => import('./orders/order-details/order-details.module').then(m => m.OrderDetailsPageModule)
          }
        ]
      },
      {
        path: 'billiards',
        children: [
          {
            path: '',
            loadChildren: () => import('./billiards/billiards.module').then(m => m.BilliardsPageModule)
          }
        ]
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadChildren: () => import('./events/events.module').then(m => m.EventsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/navtabs/tabs/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/navtabs/tabs/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NavtabsPageRoutingModule {}
