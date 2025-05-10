import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserImageUploadComponent } from './user-image-upload.component';

// Skip this test temporarily
xdescribe('UserImageUploadComponent', () => {
  let component: UserImageUploadComponent;
  let fixture: ComponentFixture<UserImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [UserImageUploadComponent,
        HttpClientTestingModule, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(UserImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
