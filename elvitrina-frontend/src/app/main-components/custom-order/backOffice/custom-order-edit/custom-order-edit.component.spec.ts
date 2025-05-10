import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { CustomOrderEditComponent } from './custom-order-edit.component';

describe('CustomOrderEditComponent', () => {
  let component: CustomOrderEditComponent;
  let fixture: ComponentFixture<CustomOrderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [CustomOrderEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(CustomOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
