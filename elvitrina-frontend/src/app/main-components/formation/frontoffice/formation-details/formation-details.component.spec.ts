import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { FormationDetailsComponent } from './formation-details.component';

describe('FormationDetailsComponent', () => {
  let component: FormationDetailsComponent;
  let fixture: ComponentFixture<FormationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [FormationDetailsComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(FormationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
