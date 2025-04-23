import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreedgenerationComponent } from './threedgeneration.component';

describe('ThreedgenerationComponent', () => {
  let component: ThreedgenerationComponent;
  let fixture: ComponentFixture<ThreedgenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreedgenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreedgenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
