import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackCreateComponent } from './app-feedback-create.component';

describe('AppFeedbackCreateComponent', () => {
  let component: AppFeedbackCreateComponent;
  let fixture: ComponentFixture<AppFeedbackCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeedbackCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
