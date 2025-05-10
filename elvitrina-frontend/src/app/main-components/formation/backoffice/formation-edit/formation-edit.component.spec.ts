import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { FormationEditComponent } from './formation-edit.component';

describe('FormationEditComponent', () => {
  let component: FormationEditComponent;
  let fixture: ComponentFixture<FormationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [FormationEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(FormationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
