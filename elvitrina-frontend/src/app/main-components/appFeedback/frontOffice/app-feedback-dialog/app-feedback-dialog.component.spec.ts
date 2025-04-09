import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackDialogComponent } from './app-feedback-dialog.component';

describe('AppFeedbackDialogComponent', () => {
  let component: AppFeedbackDialogComponent;
  let fixture: ComponentFixture<AppFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeedbackDialogComponent]
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
