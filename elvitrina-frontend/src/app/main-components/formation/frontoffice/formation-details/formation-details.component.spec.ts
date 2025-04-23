import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationDetailsComponent } from './formation-details.component';

describe('FormationDetailsComponent', () => {
  let component: FormationDetailsComponent;
  let fixture: ComponentFixture<FormationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
