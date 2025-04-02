import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFeedbackTableComponent } from './store-feedback-table.component';

describe('StoreFeedbackTableComponent', () => {
  let component: StoreFeedbackTableComponent;
  let fixture: ComponentFixture<StoreFeedbackTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreFeedbackTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
