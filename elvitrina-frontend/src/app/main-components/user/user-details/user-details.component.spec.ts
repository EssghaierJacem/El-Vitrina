import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG, ROUTE_PROVIDERS } from 'src/app/testing/test-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserDetailsComponent } from './user-details.component';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent, HttpClientTestingModule, ...COMMON_TEST_CONFIG.imports],
      providers: [...ROUTE_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
