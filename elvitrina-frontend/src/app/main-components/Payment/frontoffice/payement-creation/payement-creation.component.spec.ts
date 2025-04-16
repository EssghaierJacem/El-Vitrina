import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayementCreationComponent } from './payement-creation.component';

describe('PayementCreationComponent', () => {
  let component: PayementCreationComponent;
  let fixture: ComponentFixture<PayementCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayementCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayementCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
