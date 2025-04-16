import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestPersoEditComponent } from './admin-request-perso-edit.component';

describe('AdminRequestPersoEditComponent', () => {
  let component: AdminRequestPersoEditComponent;
  let fixture: ComponentFixture<AdminRequestPersoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRequestPersoEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestPersoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
