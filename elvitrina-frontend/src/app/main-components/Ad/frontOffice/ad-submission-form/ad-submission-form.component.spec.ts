import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdSubmissionFormComponent } from './ad-submission-form.component';

describe('AdSubmissionFormComponent', () => {
  let component: AdSubmissionFormComponent;
  let fixture: ComponentFixture<AdSubmissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdSubmissionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdSubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
