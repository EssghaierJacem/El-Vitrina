import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFeedbackListComponent } from './app-feedback-list.component';

describe('AppFeedbackListComponent', () => {
  let component: AppFeedbackListComponent;
  let fixture: ComponentFixture<AppFeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFeedbackListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
