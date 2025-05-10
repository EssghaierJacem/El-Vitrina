import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdDisplayComponent } from './ad-display.component';

describe('AdDisplayComponent', () => {
  let component: AdDisplayComponent;
  let fixture: ComponentFixture<AdDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdDisplayComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
