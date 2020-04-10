import { Component, OnInit, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { Category } from '../../../@core/model/category.model';
import { CategoryService } from '../../../@core/service/category.service';
import { ProductService } from '../../../@core/service/product.service';
import { NavController } from '@ionic/angular';
import { Order, TableOrderService } from '../../../@core/service/table-order.service';
import { TableOrder } from '../../../@core/model/table-order.model';
import { Product } from '../../../@core/model/product.model';


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
  tableid: string;
  loadedTableOrders: Observable<{ categories: Category[], products: Product[], tableorder: TableOrder[] }>;
  filteredProducts: any;

  oldOrderData = {
    productname: '',
    quantity: 0,
    price: 1
  }

  newOrderData = {
    productname: '',
    quantity: 0,
    price: 1
  }

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private categoryService: CategoryService,
              private productService: ProductService,
              private tableOrderService: TableOrderService,
              private navCtrl: NavController) { }

  ngOnInit() {

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('tableId')) {
        this.navCtrl.navigateBack('/navtabs/tabs/offers');
        return;
      }

      this.tableid = paramMap.get('tableId');
      console.log(this.tableid);

      this.isLoading = true;
      this.loadedTableOrders = combineLatest (
            this.categoryService.getCategories(),
            this.productService.getProducts(),
            this.tableOrderService.getTableOrders(this.tableid)
          ).pipe(
            map(([categories, products, tableorder]) => {
              return {categories, products, tableorder};
            })
      );
      
      this.slider =
      {
        isBeginningSlide: true,
        isEndSlide: false
      };
     
    });

  
  }

  onFilterProducts(category: string) {
    
    this.filteredProducts = this.productService.getProductsByCategory(category);

  }

  onAddOrder(order) {
    this.tableOrderService.addProduct(order);
    console.log('Orders','=>',this.tableOrderService.getOrders());
  }

  onRemoveOrder(order) {
    this.tableOrderService.decreaseProduct(order);
    console.log('Orders','=>',this.tableOrderService.getOrders());
  }

  onUpdateOrder(order, updatemode: string) {

    const oldQuantity = order.quantity;

    if (updatemode === 'remove' && order.quantity == 1){
      return;
    } else if (updatemode === 'remove' && order.quantity >= 1) {
      order.quantity = order.quantity - 1;
    } else {
      order.quantity = order.quantity + 1;
    }

    this.oldOrderData.productname = order.productname;
    this.oldOrderData.quantity = oldQuantity;
    this.oldOrderData.price = order.price;

    this.newOrderData.productname = order.productname;
    this.newOrderData.quantity = order.quantity;
    this.newOrderData.price = order.quantity * order.price;
    
    console.log(this.oldOrderData, '=>', this.newOrderData)

    // this.tableOrderService.updateOrder(this.tableid, this.oldOrderData, this.newOrderData);

  }

  onPlaceOrder() {

  }

  onNavigateProductOrder(tableid: string, productid: string) {

    const navigationExtras: NavigationExtras = {
      state: {
        tableId: tableid,
        productId: productid,
      }
    };

    this.router.navigate(['/','navtabs','tabs','orders','product-order',productid], navigationExtras);

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