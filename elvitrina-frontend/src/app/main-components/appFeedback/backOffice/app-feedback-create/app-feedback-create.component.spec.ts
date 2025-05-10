import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AppFeedbackCreateComponent } from './app-feedback-create.component';

describe('AppFeedbackCreateComponent', () => {
  let component: AppFeedbackCreateComponent;
  let fixture: ComponentFixture<AppFeedbackCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AppFeedbackCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
