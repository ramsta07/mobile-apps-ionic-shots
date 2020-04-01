import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NavtabsPage } from './navtabs.page';

describe('NavtabsPage', () => {
  let component: NavtabsPage;
  let fixture: ComponentFixture<NavtabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavtabsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NavtabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
