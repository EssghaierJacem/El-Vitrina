import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderEditComponent } from './custom-order-edit.component';

describe('CustomOrderEditComponent', () => {
  let component: CustomOrderEditComponent;
  let fixture: ComponentFixture<CustomOrderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomOrderEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
