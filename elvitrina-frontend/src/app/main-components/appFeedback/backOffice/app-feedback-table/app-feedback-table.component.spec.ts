import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackTableComponent } from './app-feedback-table.component';

describe('AppFeedbackTableComponent', () => {
  let component: AppFeedbackTableComponent;
  let fixture: ComponentFixture<AppFeedbackTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeedbackTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
