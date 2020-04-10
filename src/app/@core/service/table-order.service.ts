import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { TableOrder } from '../model/table-order.model';

export interface Order {
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class TableOrderService {

  tableOrders: Observable<TableOrder[]>;
  private productColref: AngularFirestoreCollection<TableOrder>;
  private orders = [];
  
  constructor(private afs: AngularFirestore) { 
    this.productColref = this.afs.collection<TableOrder>('table_order');
        this.tableOrders = this.productColref.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };        
                });
            })
            );
  }

  getTableOrders(tableid: string): Observable<TableOrder[]> {
    return this.tableOrders.pipe(map(table => {
      return table.filter((table) => {
          return table.id === tableid
      })
  }))
  }

  // deleteOrder(tableid: string, data): Promise<void> {
  //   return this.productColref.doc(tableid).update({
  //     "orders": firebase.firestore.FieldValue.arrayRemove(data)
  //   })
  // }

  // updateOrder(tableid: string, olddata, newdata): Promise<void>  {
  //   return this.productColref.doc(tableid).update({
  //     "orders": firebase.firestore.FieldValue.arrayRemove(olddata)
  //   }).then(() => {
  //     console.log('Removed old element from Host -> orders array successfully');
  //     this.productColref.doc(tableid).update({
  //       "orders": firebase.firestore.FieldValue.arrayUnion(newdata)
  //     })
  //   }).then(() => {console.log('Updated element from Host -> orders array successfully'); })
  // }

  getOrders() {
    return this.orders;
  }

  addProduct(order) {
    let added = false;
    for (let o of this.orders) {
      if (o.productname === order.productname) {
        o.quantity += 1;
        order.quantity +=1;
        added = true;
        break;
      }
    }
    if (!added) {
      order.quantity = 1;
      this.orders.push(order);
    }
  }
 
  decreaseProduct(order) {
    for (let [index, o] of this.orders.entries()) {
      if (o.productname === order.productname && order.quantity >= 1) {
        o.quantity -= 1;
        order.quantity -=1;
        if (o.quantity == 0) {
          this.orders.splice(index, 1);
        }
      }
    }
  }
 
  removeProduct(product) {
    for (let [index, p] of this.orders.entries()) {
      if (p.name === product.name) {
        this.orders.splice(index, 1);
      }
    }
  }
}
