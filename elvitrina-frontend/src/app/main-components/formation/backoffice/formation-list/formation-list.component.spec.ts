import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { FormationListComponent } from './formation-list.component';

describe('FormationListComponent', () => {
  let component: FormationListComponent;
  let fixture: ComponentFixture<FormationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [FormationListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(FormationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
