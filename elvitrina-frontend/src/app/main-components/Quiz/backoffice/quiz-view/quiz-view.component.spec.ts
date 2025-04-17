import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizViewComponent } from './quiz-view.component';

describe('QuizViewComponent', () => {
  let component: QuizViewComponent;
  let fixture: ComponentFixture<QuizViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
