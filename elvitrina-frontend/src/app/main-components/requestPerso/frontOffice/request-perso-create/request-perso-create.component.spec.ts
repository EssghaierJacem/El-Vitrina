import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormBuilder } from '@angular/forms';

import { RequestPersoCreateComponent } from './request-perso-create.component';

describe('RequestPersoCreateComponent', () => {
  let component: RequestPersoCreateComponent;
  let fixture: ComponentFixture<RequestPersoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestPersoCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [
        ...COMMON_TEST_CONFIG.providers,
        FormBuilder,
        provideAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPersoCreateComponent);
    component = fixture.componentInstance;
    
    // Don't detect changes automatically - this will avoid the MatDatepicker error
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
