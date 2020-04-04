import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { IonItemSliding } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CategoryService } from '../@core/service/category.service';
import { Category } from '../@core/model/category.model';
import { CommonUtils } from '../@core/utils/common-utils';
import { Product } from '../@core/model/product.model';
import { ProductService } from '../@core/service/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {

  isLoading = false;
  changeSegment = 'product';
  loadedCategoriesProduct: { categories: Category[], products: Product[] };
  isProduct = true;

  private loadedSub: Subscription;

  constructor(private categoryService: CategoryService, 
              private productService: ProductService,
              private route: Router,
              private loaderCtrl: LoadingController,
              private alertCtrl: AlertController,
              private commUtil: CommonUtils) { }

  ngOnInit() {

    this.isLoading = true;
    this.loadedSub = combineLatest (
          this.categoryService.getCategories(),
          this.productService.getProducts()
        ).pipe(
          map(([categories, products]) => {
            return {categories, products};
          })
    ).subscribe(data => {
      this.loadedCategoriesProduct = data;
      this.isLoading = false;
    });

    console.log('Here at products')

  }

  onSegmentChange(event: CustomEvent<SegmentChangeEventDetail>) {
    this.changeSegment = event.detail.value;

    if (this.changeSegment == 'product'){
      this.isProduct = true;
    } else {
      this.isProduct = false;
    }
  }

  onCreateProduct() {

    if (this.changeSegment !== 'stock') {
      this.goToProductCreate(this.isProduct);
    }

  }

  async onDeleteSubmit(id: string, slidingItem: IonItemSliding) {
    
    const alert = await this.alertCtrl.create({
      header: 'Confirm Deletion',
      message: 'Do you want to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            slidingItem.close();
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteProduct(id);
            slidingItem.close();
          }
        }
      ]
    });

    await alert.present();

  }

  deleteProduct(id: string) {

    this.loaderCtrl.create({
      message: 'Deleting ' + this.changeSegment.toLocaleUpperCase()
    }).then(loadingEl => {
      loadingEl.present();

      if (this.changeSegment == 'product') {
          this.productService.deleteProduct(id).then(() => {
            loadingEl.dismiss();
            this.commUtil.showToast('Product deleted successfully');
          }, err => {
            loadingEl.dismiss();
            this.commUtil.showToast('Failed to delete Product');
          });
      } else if (this.changeSegment == 'category') {

          //Delete Category and from Product Collection

          this.categoryService.getCategory(id).subscribe(data => {
              let categoryname = data.categoryName;

              this.productService.delectProductCategory(categoryname).then(() => {
                console.log('Deleted category from Product');
              }, err => {
                loadingEl.dismiss();
                this.commUtil.showToast('Failed to delete Category');
                return;
              });
          });

          this.categoryService.deleteCategory(id).then(() => {
            loadingEl.dismiss();
            this.commUtil.showToast('Category deleted successfully');
          }, err => {
            loadingEl.dismiss();
            this.commUtil.showToast('Failed to delete Category');
          });

      } else {
          console.log('Delete stock item')
      }
      
    })

  }

  ngOnDestroy() {
    if (this.loadedSub) {this.loadedSub.unsubscribe();}
  }

  IonViewDidLeave() {
    if (this.loadedSub) {this.loadedSub.unsubscribe();}
  }

  goToProductCreate(product: boolean) {
    const navigationExtras: NavigationExtras = {
      state: {
        isProduct: product,
        categories: this.loadedCategoriesProduct.categories
      }
    };
    this.route.navigate(['/products/new-product'], navigationExtras);
  }

  navigateToEdit(id: string) {

    const navigationExtras: NavigationExtras = {
      state: {
        productId: id,
        isProduct: this.isProduct,
        categories: this.loadedCategoriesProduct.categories
      }
    };

    this.route.navigate(['/products/edit-product/{{id}}'], navigationExtras);
  }

}
