import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdminRequestPersoEditComponent } from './admin-request-perso-edit.component';

describe('AdminRequestPersoEditComponent', () => {
  let component: AdminRequestPersoEditComponent;
  let fixture: ComponentFixture<AdminRequestPersoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdminRequestPersoEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestPersoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
