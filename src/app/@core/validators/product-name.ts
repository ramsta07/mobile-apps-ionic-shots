import { FormControl } from '@angular/forms';
import { ProductService } from '../service/product.service';


export class ProductValidator {
    static productService: ProductService;

    constructor(productService: ProductService) {
        ProductValidator.productService = productService;
    }

    checkProduct(control: FormControl): any {

        const productname = control.value;

        return new Promise(resolve => {

            ProductValidator.productService.checkProductName(productname).subscribe(data => {
                if (data) {
                    resolve({'Product exists': true});
                }
                else {
                    resolve(null);
                }
                console.log(data);
            });
        });
    }
}