import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFeedbackDetailsComponent } from './store-feedback-details.component';

describe('StoreFeedbackDetailsComponent', () => {
  let component: StoreFeedbackDetailsComponent;
  let fixture: ComponentFixture<StoreFeedbackDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreFeedbackDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
