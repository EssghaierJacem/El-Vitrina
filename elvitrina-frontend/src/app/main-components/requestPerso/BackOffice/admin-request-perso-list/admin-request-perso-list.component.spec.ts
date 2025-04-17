import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestPersoListComponent } from './admin-request-perso-list.component';

describe('AdminRequestPersoListComponent', () => {
  let component: AdminRequestPersoListComponent;
  let fixture: ComponentFixture<AdminRequestPersoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRequestPersoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRequestPersoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
