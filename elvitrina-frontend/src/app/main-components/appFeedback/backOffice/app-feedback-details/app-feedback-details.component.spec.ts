import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AppFeedbackDetailsComponent } from './app-feedback-details.component';

describe('AppFeedbackDetailsComponent', () => {
  let component: AppFeedbackDetailsComponent;
  let fixture: ComponentFixture<AppFeedbackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AppFeedbackDetailsComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
