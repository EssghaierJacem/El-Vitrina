import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPersoListComponent } from './request-perso-list.component';

describe('RequestPersoListComponent', () => {
  let component: RequestPersoListComponent;
  let fixture: ComponentFixture<RequestPersoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPersoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPersoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
