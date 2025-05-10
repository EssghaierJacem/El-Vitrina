import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { FriendRequestComponent } from './friend-request.component';

describe('FriendRequestComponent', () => {
  let component: FriendRequestComponent;
  let fixture: ComponentFixture<FriendRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [FriendRequestComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(FriendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
