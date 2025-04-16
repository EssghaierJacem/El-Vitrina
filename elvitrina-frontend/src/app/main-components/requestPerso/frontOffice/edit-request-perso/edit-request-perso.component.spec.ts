import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequestPersoComponent } from './edit-request-perso.component';

describe('EditRequestPersoComponent', () => {
  let component: EditRequestPersoComponent;
  let fixture: ComponentFixture<EditRequestPersoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRequestPersoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRequestPersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
