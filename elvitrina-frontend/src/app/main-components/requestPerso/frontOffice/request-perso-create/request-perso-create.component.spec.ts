import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPersoCreateComponent } from './request-perso-create.component';

describe('RequestPersoCreateComponent', () => {
  let component: RequestPersoCreateComponent;
  let fixture: ComponentFixture<RequestPersoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPersoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPersoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
