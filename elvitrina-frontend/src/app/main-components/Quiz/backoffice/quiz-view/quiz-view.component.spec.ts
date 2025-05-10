import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { QuizViewComponent } from './quiz-view.component';

describe('QuizViewComponent', () => {
  let component: QuizViewComponent;
  let fixture: ComponentFixture<QuizViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [QuizViewComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(QuizViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
