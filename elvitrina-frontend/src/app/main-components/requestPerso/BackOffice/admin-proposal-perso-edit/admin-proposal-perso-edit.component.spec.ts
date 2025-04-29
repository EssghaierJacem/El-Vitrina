import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProposalPersoEditComponent } from './admin-proposal-perso-edit.component';

describe('AdminProposalPersoEditComponent', () => {
  let component: AdminProposalPersoEditComponent;
  let fixture: ComponentFixture<AdminProposalPersoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProposalPersoEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProposalPersoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
