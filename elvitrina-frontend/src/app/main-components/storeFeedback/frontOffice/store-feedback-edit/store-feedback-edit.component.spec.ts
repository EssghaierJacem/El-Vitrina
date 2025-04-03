import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFeedbackEditComponent } from './store-feedback-edit.component';

describe('StoreFeedbackEditComponent', () => {
  let component: StoreFeedbackEditComponent;
  let fixture: ComponentFixture<StoreFeedbackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreFeedbackEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
