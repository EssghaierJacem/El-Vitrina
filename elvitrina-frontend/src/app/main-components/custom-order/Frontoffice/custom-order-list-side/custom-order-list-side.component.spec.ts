import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderListSideComponent } from './custom-order-list-side.component';

describe('CustomOrderListSideComponent', () => {
  let component: CustomOrderListSideComponent;
  let fixture: ComponentFixture<CustomOrderListSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomOrderListSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomOrderListSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
