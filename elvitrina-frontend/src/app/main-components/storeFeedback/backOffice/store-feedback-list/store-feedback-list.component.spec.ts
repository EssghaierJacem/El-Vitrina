import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreFeedbackListComponent } from './store-feedback-list.component';

describe('StoreFeedbackListComponent', () => {
  let component: StoreFeedbackListComponent;
  let fixture: ComponentFixture<StoreFeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreFeedbackListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
