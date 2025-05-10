import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { OrderViewComponent } from './order-view.component';

describe('OrderViewComponent', () => {
  let component: OrderViewComponent;
  let fixture: ComponentFixture<OrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [OrderViewComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(OrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
