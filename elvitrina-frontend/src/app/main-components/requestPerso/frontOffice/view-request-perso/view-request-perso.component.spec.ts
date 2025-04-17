import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestPersoComponent } from './view-request-perso.component';

describe('ViewRequestPersoComponent', () => {
  let component: ViewRequestPersoComponent;
  let fixture: ComponentFixture<ViewRequestPersoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRequestPersoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequestPersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
