import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { StoreDetailsComponent } from './store-details.component';

describe('StoreDetailsComponent', () => {
  let component: StoreDetailsComponent;
  let fixture: ComponentFixture<StoreDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [StoreDetailsComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(StoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
