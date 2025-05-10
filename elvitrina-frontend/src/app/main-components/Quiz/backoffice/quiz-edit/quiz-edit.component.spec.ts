import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { QuizEditComponent } from './quiz-edit.component';

describe('QuizEditComponent', () => {
  let component: QuizEditComponent;
  let fixture: ComponentFixture<QuizEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [QuizEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(QuizEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
