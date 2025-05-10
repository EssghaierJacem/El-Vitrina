import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdminProposalPersoListComponent } from './admin-proposal-perso-list.component';

describe('AdminProposalPersoListComponent', () => {
  let component: AdminProposalPersoListComponent;
  let fixture: ComponentFixture<AdminProposalPersoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdminProposalPersoListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdminProposalPersoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
