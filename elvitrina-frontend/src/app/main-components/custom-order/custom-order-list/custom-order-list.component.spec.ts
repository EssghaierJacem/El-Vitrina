import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderListComponent } from './custom-order-list.component';

describe('CustomOrderListComponent', () => {
  let component: CustomOrderListComponent;
  let fixture: ComponentFixture<CustomOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
