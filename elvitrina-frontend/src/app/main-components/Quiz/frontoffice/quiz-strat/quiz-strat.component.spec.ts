import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizStratComponent } from './quiz-strat.component';

describe('QuizStratComponent', () => {
  let component: QuizStratComponent;
  let fixture: ComponentFixture<QuizStratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizStratComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizStratComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
