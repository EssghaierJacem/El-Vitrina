import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdListComponent } from './ad-list.component';

describe('AdListComponent', () => {
  let component: AdListComponent;
  let fixture: ComponentFixture<AdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
