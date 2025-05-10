import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { StoreFeedbackListComponent } from './store-feedback-list.component';

describe('StoreFeedbackListComponent', () => {
  let component: StoreFeedbackListComponent;
  let fixture: ComponentFixture<StoreFeedbackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [StoreFeedbackListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(StoreFeedbackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
