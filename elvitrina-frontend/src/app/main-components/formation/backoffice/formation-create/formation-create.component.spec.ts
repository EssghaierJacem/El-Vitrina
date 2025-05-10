import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { FormationCreateComponent } from './formation-create.component';

describe('FormationCreateComponent', () => {
  let component: FormationCreateComponent;
  let fixture: ComponentFixture<FormationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [FormationCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(FormationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
