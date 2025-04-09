import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseViewComponent } from './reponse-view.component';

describe('ReponseViewComponent', () => {
  let component: ReponseViewComponent;
  let fixture: ComponentFixture<ReponseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReponseViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReponseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
