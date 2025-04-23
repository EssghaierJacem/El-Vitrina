import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFavComponent } from './product-fav.component';

describe('ProductFavComponent', () => {
  let component: ProductFavComponent;
  let fixture: ComponentFixture<ProductFavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
