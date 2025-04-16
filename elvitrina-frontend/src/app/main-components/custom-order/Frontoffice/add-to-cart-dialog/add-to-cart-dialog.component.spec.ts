import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartDialogComponent } from './add-to-cart-dialog.component';

describe('AddToCartDialogComponent', () => {
  let component: AddToCartDialogComponent;
  let fixture: ComponentFixture<AddToCartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCartDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToCartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
