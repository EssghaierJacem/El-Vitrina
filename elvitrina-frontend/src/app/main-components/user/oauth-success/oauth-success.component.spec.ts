import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthSuccessComponent } from './oauth-success.component';

describe('OauthSuccessComponent', () => {
  let component: OauthSuccessComponent;
  let fixture: ComponentFixture<OauthSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OauthSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
