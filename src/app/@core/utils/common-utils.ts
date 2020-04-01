import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
  })
export class CommonUtils {

    constructor(private toastCtrl: ToastController) {}
    groupByArray(xs, key, sortKey) {
        return xs.reduce((rv, x) => {
            const v = key instanceof Function ? key(x) : x[key];
            const el = rv.find(r => r && r.key === v);

            if (el) {
                el.values.push(x);
                el.values.sort((a, b) => {
                    return a[sortKey].toLowerCase().localeCompare(b[sortKey].toLowerCase());
                });
            } else {
                rv.push({ key: v, values: [x] });
            }

            return rv;
        }, []);
        }

    sortArray(array, property, direction) {
        direction = direction || 1;
        array.sort(function compare(a, b) {
            let comparison = 0;
            if (a[property] > b[property]) {
                comparison = 1 * direction;
            } else if (a[property] < b[property]) {
                comparison = -1 * direction;
            }
            return comparison;
        });
        return array;
    }

    showToast(msg: string) {
        this.toastCtrl.create({
        message: msg,
        duration: 2000
        }).then(toastEl => {
        toastEl.present();
        });
    }

}
