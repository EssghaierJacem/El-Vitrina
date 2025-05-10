import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { StoreFeedbackEditComponent } from './store-feedback-edit.component';

describe('StoreFeedbackEditComponent', () => {
  let component: StoreFeedbackEditComponent;
  let fixture: ComponentFixture<StoreFeedbackEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [StoreFeedbackEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
