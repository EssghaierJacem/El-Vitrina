import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdminProposalPersoEditComponent } from './admin-proposal-perso-edit.component';

describe('AdminProposalPersoEditComponent', () => {
  let component: AdminProposalPersoEditComponent;
  let fixture: ComponentFixture<AdminProposalPersoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdminProposalPersoEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdminProposalPersoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
