import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFeedbackCreateComponent } from './store-feedback-create.component';

describe('StoreFeedbackCreateComponent', () => {
  let component: StoreFeedbackCreateComponent;
  let fixture: ComponentFixture<StoreFeedbackCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreFeedbackCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
