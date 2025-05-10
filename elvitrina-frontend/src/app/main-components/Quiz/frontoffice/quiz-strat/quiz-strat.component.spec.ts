import { ComponentFixture, TestBed } from '@angular/core/testing';
import {COMMON_TEST_CONFIG, ROUTE_PROVIDERS} from 'src/app/testing/test-utils';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { QuizStratComponent } from './quiz-strat.component';

describe('QuizStratComponent', () => {
  let component: QuizStratComponent;
  let fixture: ComponentFixture<QuizStratComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizStratComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({}))
          }
        }
      ]
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
