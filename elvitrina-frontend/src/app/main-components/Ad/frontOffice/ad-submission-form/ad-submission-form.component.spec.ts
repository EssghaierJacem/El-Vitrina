import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdSubmissionFormComponent } from './ad-submission-form.component';

describe('AdSubmissionFormComponent', () => {
  let component: AdSubmissionFormComponent;
  let fixture: ComponentFixture<AdSubmissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdSubmissionFormComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdSubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
