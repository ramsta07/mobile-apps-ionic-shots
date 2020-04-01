import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { DiningTablesService } from '../../@core/service/dining-tables.service';
import { CommonUtils } from '../../@core/utils/common-utils';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit, OnDestroy {

  loadedTables: any;
  private tableSub: Subscription;

  constructor(
    private dineTableService: DiningTablesService,
    private commonUtils: CommonUtils
  ) { }

  ngOnInit() {

    this.tableSub = this.dineTableService.getAllDiningTable().subscribe(data => {

      const sContacts = this.commonUtils.sortArray(data, 'tableName', -1);
      this.loadedTables = this.commonUtils.groupByArray(sContacts, 'tableCapacity', 'tableName');
      console.log(this.loadedTables);

    });

  }

  ngOnDestroy() {
    this.tableSub.unsubscribe();
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail.value);
    // if (event.detail.value === 'all') {
    //   this.relevantPlaces = this.loadedPlaces;
    //   this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    // } else {
    //   this.relevantPlaces = this.loadedPlaces.filter(
    //     place => place.userId !== this.authService.userId
    //   );
    //   this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    // }
  }

}
