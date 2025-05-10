import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AppFeedbackEditComponent } from './app-feedback-edit.component';

describe('AppFeedbackEditComponent', () => {
  let component: AppFeedbackEditComponent;
  let fixture: ComponentFixture<AppFeedbackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AppFeedbackEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
