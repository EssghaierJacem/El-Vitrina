import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { StoreFeedbackDetailsComponent } from './store-feedback-details.component';

describe('StoreFeedbackDetailsComponent', () => {
  let component: StoreFeedbackDetailsComponent;
  let fixture: ComponentFixture<StoreFeedbackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [StoreFeedbackDetailsComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
