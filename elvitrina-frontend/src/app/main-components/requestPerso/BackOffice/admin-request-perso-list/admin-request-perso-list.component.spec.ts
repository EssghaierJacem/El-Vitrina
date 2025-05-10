import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdminRequestPersoListComponent } from './admin-request-perso-list.component';

describe('AdminRequestPersoListComponent', () => {
  let component: AdminRequestPersoListComponent;
  let fixture: ComponentFixture<AdminRequestPersoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdminRequestPersoListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestPersoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
