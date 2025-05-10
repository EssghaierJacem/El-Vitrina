import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestModerationComponent } from './request-moderation.component';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('RequestModerationComponent', () => {
  let component: RequestModerationComponent;
  let fixture: ComponentFixture<RequestModerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestModerationComponent, ...COMMON_TEST_CONFIG.imports, ToastrModule.forRoot()],
      providers: [...COMMON_TEST_CONFIG.providers]
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
