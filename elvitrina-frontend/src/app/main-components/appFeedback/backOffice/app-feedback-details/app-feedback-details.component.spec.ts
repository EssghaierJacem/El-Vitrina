import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackDetailsComponent } from './app-feedback-details.component';

describe('AppFeedbackDetailsComponent', () => {
  let component: AppFeedbackDetailsComponent;
  let fixture: ComponentFixture<AppFeedbackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeedbackDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
