import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseCreateComponent } from './reponse-create.component';

describe('ReponseCreateComponent', () => {
  let component: ReponseCreateComponent;
  let fixture: ComponentFixture<ReponseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReponseCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReponseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
