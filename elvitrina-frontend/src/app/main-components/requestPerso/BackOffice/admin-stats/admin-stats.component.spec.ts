import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdminStatsComponent } from './admin-stats.component';

describe('AdminStatsComponent', () => {
  let component: AdminStatsComponent;
  let fixture: ComponentFixture<AdminStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdminStatsComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
