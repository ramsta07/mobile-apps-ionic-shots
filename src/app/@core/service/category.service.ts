import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  DocumentReference
  } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { map, take, debounceTime } from 'rxjs/operators';

import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: Observable<Category[]>;
  private categoriesColRef: AngularFirestoreCollection<Category>;

  constructor(private afs: AngularFirestore) {
    this.categoriesColRef = this.afs.collection<Category>('category');
    this.categories = this.categoriesColRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this.categories;
  }

  getCategory(id: string): Observable<Category> {
    return this.categoriesColRef.doc<Category>(id).valueChanges().pipe(
      take(1),
      map(category => {
        category.id = id;
        return category;
      })
    );
  }

  addCategory(category: Category): Promise<DocumentReference> {
    return this.categoriesColRef.add(category);
  }

  updateCategory(category: Category): Promise<void> {
    return this.categoriesColRef.doc(category.id).update(
      { categoryName: category.categoryName,
        categoryImageURL: category.categoryImageURL });
  }

  deleteCategory(id: string): Promise<void> {
    return this.categoriesColRef.doc(id).delete();
  }

  checkCategoryName(categoryname: string) {
    
    return this.afs.collection<Category>('category', ref => ref.where('categoryName', '==', categoryname))
            .valueChanges().pipe(
              debounceTime(500),
              take(1),
              map(arr =>
                arr.length > 0 ? {'Category name already exists' : true} : null
              ));

  }
}
