import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestModerationComponent } from './request-moderation.component';

describe('RequestModerationComponent', () => {
  let component: RequestModerationComponent;
  let fixture: ComponentFixture<RequestModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
