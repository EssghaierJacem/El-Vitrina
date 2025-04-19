import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProposalPersoListComponent } from './admin-proposal-perso-list.component';

describe('AdminProposalPersoListComponent', () => {
  let component: AdminProposalPersoListComponent;
  let fixture: ComponentFixture<AdminProposalPersoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProposalPersoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProposalPersoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
