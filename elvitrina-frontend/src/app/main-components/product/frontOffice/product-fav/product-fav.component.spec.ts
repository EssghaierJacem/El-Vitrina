import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { ProductFavComponent } from './product-fav.component';

describe('ProductFavComponent', () => {
  let component: ProductFavComponent;
  let fixture: ComponentFixture<ProductFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [ProductFavComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(ProductFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
