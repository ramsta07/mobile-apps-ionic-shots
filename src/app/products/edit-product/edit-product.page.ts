import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from 'src/app/@core/model/category.model';
import { CategoryService } from 'src/app/@core/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { CommonUtils } from '../../@core/utils/common-utils';
import { Product } from '../../@core/model/product.model';
import { ProductService } from '../../@core/service/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
})
export class EditProductPage implements OnInit, OnDestroy {

  isLoading = false;
  form: FormGroup;
  productId: string;
  isProduct: boolean;
  loadedCategories: Category[];
  loadedCategory: Category;
  loadedProduct: Product;
  categorySub: Subscription;
  productSub: Subscription;
  categorySelected: string;
  sellUnitSelected: string;
  changeSegment = 'product';

  category: Category = {
    id: '',
    categoryName: '',
    categoryImageURL: ''
  };

  product: Product = {
    id: '',
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

  constructor(private categoryService: CategoryService,
              private productService: ProductService,
              private route: ActivatedRoute,
              private router: Router,
              private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private commUtil: CommonUtils,
              private loaderCtrl: LoadingController) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      if (this.router.getCurrentNavigation().extras.state) {
        
        this.productId = this.router.getCurrentNavigation().extras.state.productId;
        this.isProduct = this.router.getCurrentNavigation().extras.state.isProduct;
        this.loadedCategories = this.router.getCurrentNavigation().extras.state.categories;

        this.isLoading = true;
        
        if (this.isProduct) {

          //Fetch Product
          this.productSub = this.productService.getProduct(this.productId).subscribe (product => {
            this.loadedProduct = product;
          
          this.form = this.formBuilder.group({
              categoryname: [''],
              productname: [this.loadedProduct.productName],
              price:[this.loadedProduct.productPrice],
              category:[this.loadedProduct.productCategory],
              description:[this.loadedProduct.productDescription],
              code:[this.loadedProduct.productBarCode],
              cost:[this.loadedProduct.productCostPrice],
              sellUnit:[this.loadedProduct.productSellUnit]
        
            });

            this.categorySelected = this.loadedProduct.productCategory;
            this.sellUnitSelected = this.loadedProduct.productSellUnit;

            this.updateValidatorRule();
            this.isLoading = false;

          },error => {
            this.commUtil.showToast('Error fetching product. Please try again later')
          });

        } else {
          
          // Fetch Category
          this.categorySub = this.categoryService.getCategory(this.productId).subscribe(category => {
            this.loadedCategory = category;

            this.form = this.formBuilder.group({
              categoryname: [this.loadedCategory.categoryName],
              productname: [''],
              price:[''],
              category:[''],
              description:[''],
              code:[''],
              cost:[''],
              sellUnit:['']
            });
            
            this.updateValidatorRule();
            this.isLoading = false;

          },error => {
            this.navCtrl.navigateBack('/products');    
            this.commUtil.showToast('Error fetching category. Please try again later')
          });
        }

      } else {
       
        this.navCtrl.navigateBack('/products');
        return;
      }
  
    });
  }

  ngOnDestroy() {
    if (this.categorySub) {this.categorySub.unsubscribe();}
    if (this.productSub) { this.productSub.unsubscribe();}
  }

  updateValidatorRule() {
    if(this.isProduct) {
       // Set Values and Validators
       this.form.controls['productname'].setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(120)]));
       this.form.controls['price'].setValidators(Validators.compose([Validators.required,Validators.min(0)]));
      //  this.form.controls['category'].setValidators(Validators.compose([Validators.required]));
       this.form.controls['description'].setValidators(Validators.compose([Validators.maxLength(180)]));
       this.form.controls['cost'].setValidators(Validators.compose([Validators.min(0)]));
 
       // Apply Validators
       this.form.controls['productname'].updateValueAndValidity();
       this.form.controls['price'].updateValueAndValidity();
       this.form.controls['category'].updateValueAndValidity();
       this.form.controls['description'].updateValueAndValidity();
       this.form.controls['cost'].updateValueAndValidity();
    } else {
      //this.form.controls['categoryname'].setValue(this.loadedCategory.categoryName)
      this.form.controls['categoryname'].setValidators(Validators.compose([Validators.required,Validators.minLength(2),Validators.maxLength(120)]));
      //this.form.controls['categoryname'].setAsyncValidators(new CategoryValidator(this.categoryService).checkCategory);
      this.form.controls['categoryname'].updateValueAndValidity();
    }
    
  }

  onChangePhoto() {
    console.log('Change photos');
  }

  onChangeSelect(categoryselected) {
    this.categorySelected = categoryselected;
  }
  
  onchangeSellUnit(sellunitselected) {
    this.sellUnitSelected = sellunitselected;
  }

  onSegmentChange(event: CustomEvent<SegmentChangeEventDetail>) {
    this.changeSegment = event.detail.value;
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
      
    }

    if (this.isProduct) {
      
      this.product.id = this.productId;
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

      console.log(this.product);

      this.loaderCtrl.create({
        message: 'Updating Product'
      }).then(loadingEl => {
        loadingEl.present();
        this.productService.updateProduct(this.product).then(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.navCtrl.navigateBack('/products');
          this.commUtil.showToast('Product updated successfully');
        }, err => {
          loadingEl.dismiss();
          this.commUtil.showToast('Failed to update Product');
        });
      })

    } else {

      this.category.id = this.productId;
      this.category.categoryName = this.form.value.categoryname;
      this.category.categoryImageURL = 'assets/images/placeholder.jpg';

      this.loaderCtrl.create({
        message: 'Updating Category'
      }).then(loadingEl => {
        loadingEl.present();
        this.categoryService.updateCategory(this.category).then(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.navCtrl.navigateBack('/products');
          this.commUtil.showToast('Category updated successfully');
        }, err => {
          loadingEl.dismiss();
          this.commUtil.showToast('Failed to update category');
        });
      })
      
    }

  }

}
