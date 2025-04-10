import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponseEditComponent } from './reponse-edit.component';

describe('ReponseEditComponent', () => {
  let component: ReponseEditComponent;
  let fixture: ComponentFixture<ReponseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReponseEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReponseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
