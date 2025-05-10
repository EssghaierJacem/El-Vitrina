import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { PayementCreationComponent } from './payement-creation.component';

describe('PayementCreationComponent', () => {
  let component: PayementCreationComponent;
  let fixture: ComponentFixture<PayementCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [PayementCreationComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(PayementCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
