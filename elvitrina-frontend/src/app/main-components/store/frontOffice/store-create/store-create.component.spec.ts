import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { StoreCreateComponent } from './store-create.component';

describe('StoreCreateComponent', () => {
  let component: StoreCreateComponent;
  let fixture: ComponentFixture<StoreCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [StoreCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(StoreCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
