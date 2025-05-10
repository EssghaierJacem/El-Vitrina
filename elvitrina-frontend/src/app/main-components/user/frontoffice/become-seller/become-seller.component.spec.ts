import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { BecomeSellerComponent } from './become-seller.component';

describe('BecomeSellerComponent', () => {
  let component: BecomeSellerComponent;
  let fixture: ComponentFixture<BecomeSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [BecomeSellerComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(BecomeSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
