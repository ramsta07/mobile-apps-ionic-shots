import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, LoadingController } from '@ionic/angular';

import { Category } from '../../@core/model/category.model';
import { CategoryService } from '../../@core/service/category.service';
import { CategoryValidator } from '../../@core/validators/category-name';
import { CommonUtils } from '../../@core/utils/common-utils';
import { Product } from '../../@core/model/product.model';
import { ProductValidator } from '../../@core/validators/product-name';
import { ProductService } from '../../@core/service/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.page.html',
  styleUrls: ['./new-product.page.scss'],
})
export class NewProductPage implements OnInit {

  form: FormGroup;
  isProduct: boolean;
  loadedCategories: Category[];
  categorySelected: string;
  sellUnitSelected = 'Unit';
  
  category: Category = {
    categoryName: '',
    categoryImageURL: ''
  };

  product: Product = {
    productName: '',
    productImageURL: '',
    productPrice: 0,
    productCategory: '',
    productDescription: '',
    productBarCode: '',
    productCostPrice: 0,
    productSellUnit: '',
    modifiedBy: '',
    modifiedAt: new Date()
  };

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private commUtil: CommonUtils,
    private loaderCtrl: LoadingController,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.routeActive.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.isProduct = this.router.getCurrentNavigation().extras.state.isProduct;
        this.loadedCategories = this.router.getCurrentNavigation().extras.state.categories;
      }
    });

    this.form = this.formBuilder.group({
        categoryname: [''],
        productname: [''],
        price:[''],
        category:[''],
        description:[''],
        code:[''],
        cost:[''],
        sellUnit:['']
    });

    this.setValidatorRule();
  }

  setValidatorRule() {

    if (this.isProduct) {
      // Set Validators
      this.form.controls['productname'].setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(120)]));
      this.form.controls['productname'].setAsyncValidators(new ProductValidator(this.productService).checkProduct);
      this.form.controls['price'].setValidators(Validators.compose([Validators.required,Validators.min(0)]));
      this.form.controls['category'].setValidators(Validators.compose([Validators.required,Validators.min(0)]));
      this.form.controls['description'].setValidators(Validators.compose([Validators.maxLength(180)]));
      this.form.controls['cost'].setValidators(Validators.compose([Validators.min(0)]));

      // Apply Validators
      this.form.controls['productname'].updateValueAndValidity();
      this.form.controls['price'].updateValueAndValidity();
      this.form.controls['category'].updateValueAndValidity();
      this.form.controls['description'].updateValueAndValidity();
      this.form.controls['cost'].updateValueAndValidity();
    } else {
      this.form.controls['categoryname'].setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(120)]));
      this.form.controls['categoryname'].setAsyncValidators(new CategoryValidator(this.categoryService).checkCategory);
      this.form.controls['categoryname'].updateValueAndValidity();
    }
    
  }

  onChangePhoto() {
    console.log('change photo');
  }

  onChangeSelectCategory(selectedValue) {
    this.categorySelected = selectedValue;
  }

  onChangeSelectSellUnit(selectedValue) {
    this.sellUnitSelected = selectedValue;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    if (this.isProduct) {
      
      this.product.productName = this.form.value.productname;
      this.product.productImageURL = 'assets/images/placeholder.jpg';
      this.product.productPrice = this.form.value.price;
      this.product.productCategory = this.categorySelected;
      this.product.productDescription = this.form.value.description;
      this.product.productBarCode = this.form.value.code;
      this.product.productCostPrice = this.form.value.cost;
      this.product.productSellUnit = this.sellUnitSelected;
      this.product.modifiedBy = 'ram';
      this.product.modifiedAt = new Date();

      console.log('Create', this.product);

      this.loaderCtrl.create({
        message: 'Adding Product'
      }).then(loadingEl => {
        loadingEl.present();
        this.productService.addProduct(this.product).then(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.navCtrl.navigateBack('/products');
          this.commUtil.showToast('Product added successfully');
        }, err => {
          loadingEl.dismiss();
          this.commUtil.showToast('Failed to add Product');
        });
      })

    } else {

      this.category.categoryName = this.form.value.categoryname;
      this.category.categoryImageURL = 'assets/images/placeholder.jpg';

      this.loaderCtrl.create({
        message: 'Adding Category'
      }).then(loadingEl => {
        loadingEl.present();
        this.categoryService.addCategory(this.category).then(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.navCtrl.navigateBack('/products');
          this.commUtil.showToast('Category added successfully');
        }, err => {
          loadingEl.dismiss();
          this.commUtil.showToast('Failed to add Category');
        });
      })


    }
  }

  
  // asyncValidator(control: FormControl) {
  //   const categoryname = control.value;

  //   return new Promise(resolve => {
  //     this.categoryService.checkCategoryName(categoryname).subscribe(data => {
  //       console.log(data);
  //       if (data) {
  //         resolve({'Category already exists': true})
  //         console.log('Exists')
  //       } else {
  //         console.log('Not exists');
  //         resolve(null)
  //       }

  //     });
  //   });
  // }

}

