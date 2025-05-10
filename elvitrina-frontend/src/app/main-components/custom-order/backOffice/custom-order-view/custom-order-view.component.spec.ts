import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { CustomOrderViewComponent } from './custom-order-view.component';

describe('CustomOrderViewComponent', () => {
  let component: CustomOrderViewComponent;
  let fixture: ComponentFixture<CustomOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [CustomOrderViewComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(CustomOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
