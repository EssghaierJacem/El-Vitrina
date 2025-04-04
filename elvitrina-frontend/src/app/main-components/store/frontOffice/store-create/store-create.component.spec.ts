import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCreateComponent } from './store-create.component';

describe('StoreCreateComponent', () => {
  let component: StoreCreateComponent;
  let fixture: ComponentFixture<StoreCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
