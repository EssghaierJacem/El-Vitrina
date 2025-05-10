import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { StoreFeedbackCreateComponent } from './store-feedback-create.component';

describe('StoreFeedbackCreateComponent', () => {
  let component: StoreFeedbackCreateComponent;
  let fixture: ComponentFixture<StoreFeedbackCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [StoreFeedbackCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
