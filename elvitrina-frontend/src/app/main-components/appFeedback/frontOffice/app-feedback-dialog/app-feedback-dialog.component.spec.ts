import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG, DIALOG_PROVIDERS } from 'src/app/testing/test-utils';
import { MatDialogRef } from '@angular/material/dialog';

import { AppFeedbackDialogComponent } from './app-feedback-dialog.component';

describe('AppFeedbackDialogComponent', () => {
  let component: AppFeedbackDialogComponent;
  let fixture: ComponentFixture<AppFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeedbackDialogComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [
        ...COMMON_TEST_CONFIG.providers,
        ...DIALOG_PROVIDERS,
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
