import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackEditComponent } from './app-feedback-edit.component';

describe('AppFeedbackEditComponent', () => {
  let component: AppFeedbackEditComponent;
  let fixture: ComponentFixture<AppFeedbackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeedbackEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
