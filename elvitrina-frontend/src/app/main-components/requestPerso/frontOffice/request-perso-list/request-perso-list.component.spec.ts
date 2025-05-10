import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestPersoListComponent } from './request-perso-list.component';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { provideLottieOptions } from 'ngx-lottie';

// Factory function for Lottie player
export function playerFactory() {
  return import('lottie-web');
}

describe('RequestPersoListComponent', () => {
  let component: RequestPersoListComponent;
  let fixture: ComponentFixture<RequestPersoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPersoListComponent, ...COMMON_TEST_CONFIG.imports, ToastrModule.forRoot()],
      providers: [
        ...COMMON_TEST_CONFIG.providers,
        provideLottieOptions({
          player: playerFactory
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPersoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
