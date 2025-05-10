import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { QuizCreateComponent } from './quiz-create.component';

describe('QuizCreateComponent', () => {
  let component: QuizCreateComponent;
  let fixture: ComponentFixture<QuizCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [QuizCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(QuizCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
