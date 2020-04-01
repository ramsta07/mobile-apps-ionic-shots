import { Injectable } from '@angular/core';
import { DiningTables } from '../model/dining-tables.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DiningTablesService {

  private diningTables: Observable<DiningTables[]>;
  private diningTablesColRef: AngularFirestoreCollection<DiningTables>;

  constructor(private afs: AngularFirestore) {

    this.diningTablesColRef = this.afs.collection('dining_tables');

  }

  getAllDiningTable() {
     return this.diningTables = this.diningTablesColRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    );
  }

  // getAllDiningTables() {
  //   return [...this.diningTables.filter(tables => tables.tableType === 'Dining')];
  // }

  // getDiningTableCapacity() {
  //   return [...this.diningTables.filter((value, index, self) =>
  //     self.map(x => x.tableCapacity).indexOf(value.tableCapacity) === index).filter(tables => tables.tableType === 'Dining')
  //   ];
  // }

  // getDiningTables4x8() {
  //   return [...this.diningTables.filter(tables => tables.tableCapacity === '4-8' && tables.tableType === 'Dining')];
  // }

  // getDiningTables2x4() {
  //   return [...this.diningTables.filter(tables => tables.tableCapacity === '2-4' && tables.tableType === 'Dining')];
  // }

  // getDiningTables2() {
  //   return [...this.diningTables.filter(tables => tables.tableCapacity === '2' && tables.tableType === 'Dining')];
  // }

  // updateDiningStatus(tableId: string, status: string) {
  //   this.diningTables.map((table, i) => {
  //     if (table.id === tableId) {
  //       this.diningTables[i].tableStatus = status;
  //     }
  //   });
  //   this.diningTableChanged.next(this.diningTables);
  // }
}
