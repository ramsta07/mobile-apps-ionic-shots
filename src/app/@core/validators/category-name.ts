import { FormControl } from '@angular/forms';
import { CategoryService } from '../service/category.service';

export class CategoryValidator {
    static categoryService: CategoryService;

    constructor(categoryService: CategoryService) {
        CategoryValidator.categoryService = categoryService;
    }

    checkCategory(control: FormControl): any {

        const categoryname = control.value;

        return new Promise(resolve => {

            CategoryValidator.categoryService.checkCategoryName(categoryname).subscribe(data => {
                if (data) {
                    resolve({'Category exists': true});
                }
                else {
                    resolve(null);
                }
                console.log(data);
            });
        });
    }
}