import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestViewDialogComponent } from './request-view-dialog.component';

describe('RequestViewDialogComponent', () => {
  let component: RequestViewDialogComponent;
  let fixture: ComponentFixture<RequestViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
