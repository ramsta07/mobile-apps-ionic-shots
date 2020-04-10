import { Injectable } from '@angular/core';

import { AngularFirestoreCollection, AngularFirestore, DocumentReference} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take, debounceTime } from 'rxjs/operators';

import { Product } from '../model/product.model';

@Injectable({
    providedIn:'root'
})
export class ProductService {

    private products: Observable<Product[]>;
    private productColref: AngularFirestoreCollection<Product>;

    constructor(private afs: AngularFirestore) { 
        this.productColref = this.afs.collection<Product>('product');
        this.products = this.productColref.snapshotChanges().pipe(
            map(actions => {
                return actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
                });
            })
            );
    }

    getProducts(): Observable<Product[]> {
        return this.products;
    }

    getProduct(id: string): Observable<Product> {
        return this.productColref.doc<Product>(id).valueChanges().pipe(
          take(1),
          map(product => {
            product.id = id;
            return product;
          })
        );
      }
    
      getProductsByCategory(category: string) {
        return this.products.pipe(map(product => {
            return product.filter((p) => {
                return p.productCategory.toLowerCase() === category.toLowerCase()
            })
        }))
      }

    addProduct(product: Product): Promise<DocumentReference> {
        return this.productColref.add(product);
    }

    updateProduct(product: Product): Promise<void> {
        return this.productColref.doc(product.id).update(
            {   productName: product.productName,
                productImageURL: product.productImageURL,
                productPrice: product.productPrice,
                productCategory: product.productCategory,
                productDescription: product.productDescription,
                productBarCode: product.productBarCode,
                productCostPrice: product.productCostPrice,
                productSellUnit: product.productSellUnit,
                modifiedBy: product.modifiedBy,
                modifiedAt: product.modifiedAt });
    }

    deleteProduct(id: string): Promise<void> {
        return this.productColref.doc(id).delete();
    }

    delectProductCategory(categoryname: string): Promise<void> {
        return this.afs.collection<Product>('product', ref => ref.where('productCategory', '==', categoryname))
                    .get()
                    .toPromise()
                    .then(querySnapshot => {
                        querySnapshot.forEach((doc) => {
                            doc.ref.delete().then(() => {
                                console.log('Document successfully deleted');
                            }).catch(function(error) {
                                console.log('Error removing deleted');
                            })
                        })
                    })
    }

    checkProductName(productname: string) {
    
    return this.afs.collection<Product>('product', ref => ref.where('productName', '==', productname))
            .valueChanges().pipe(
                debounceTime(500),
                take(1),
                map(arr =>
                arr.length > 0 ? {'Product name already exists' : true} : null
                ));

    }
}