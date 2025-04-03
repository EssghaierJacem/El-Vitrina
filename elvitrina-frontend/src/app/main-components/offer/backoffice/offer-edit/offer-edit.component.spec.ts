import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferEditComponent } from './offer-edit.component';

describe('OfferEditComponent', () => {
  let component: OfferEditComponent;
  let fixture: ComponentFixture<OfferEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
