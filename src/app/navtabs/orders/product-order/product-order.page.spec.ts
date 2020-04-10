import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductOrderPage } from './product-order.page';

describe('ProductOrderPage', () => {
  let component: ProductOrderPage;
  let fixture: ComponentFixture<ProductOrderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductOrderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
