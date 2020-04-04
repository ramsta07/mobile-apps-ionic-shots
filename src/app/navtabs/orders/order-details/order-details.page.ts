import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Category } from '../../../@core/model/category.model';
import { Product } from '../../../@core/model/product.model';
import { CategoryService } from '../../../@core/service/category.service';
import { ProductService } from '../../../@core/service/product.service';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  
  slideNavOpt = {
    initialSlide: 0,
    loop: false,
    direction: 'vertical',
    speed: 400,
    slidesPerView: 3,
    spacebetween: 3,
  };

  slider: any;

  isLoading = false;
  loadedCategoriesProduct: Observable<{ categories: Category[], products: Product[] }>;

  constructor(private categoryService: CategoryService,
              private productService: ProductService) { }

  ngOnInit() {

    this.isLoading = true;
    this.loadedCategoriesProduct = combineLatest (
          this.categoryService.getCategories(),
          this.productService.getProducts()
        ).pipe(
          map(([categories, products]) => {
            return {categories, products};
          })
    );

    this.slider =
      {
        isBeginningSlide: true,
        isEndSlide: false
      };

  }

  onFilterProducts(category: string) {
    console.log(category);
  }

  // Slider stuff

  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    })
  }

  slideDidChange(e: any, object, slideView) {

    this.checkIfNavDisabled(object,slideView);
 
  }

  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView)
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }

  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
}