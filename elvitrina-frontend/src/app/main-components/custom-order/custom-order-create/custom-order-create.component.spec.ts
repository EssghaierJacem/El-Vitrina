import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderCreateComponent } from './custom-order-create.component';

describe('CustomOrderCreateComponent', () => {
  let component: CustomOrderCreateComponent;
  let fixture: ComponentFixture<CustomOrderCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomOrderCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
