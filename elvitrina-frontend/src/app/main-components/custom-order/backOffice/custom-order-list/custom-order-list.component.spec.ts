import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { CustomOrderListComponent } from './custom-order-list.component';

describe('CustomOrderListComponent', () => {
  let component: CustomOrderListComponent;
  let fixture: ComponentFixture<CustomOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [CustomOrderListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(CustomOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
