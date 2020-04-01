import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BilliardsPage } from './billiards.page';

describe('BilliardsPage', () => {
  let component: BilliardsPage;
  let fixture: ComponentFixture<BilliardsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BilliardsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BilliardsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
