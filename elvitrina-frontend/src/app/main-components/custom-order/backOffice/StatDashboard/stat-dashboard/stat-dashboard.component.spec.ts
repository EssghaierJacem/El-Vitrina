import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { StatDashboardComponent } from './stat-dashboard.component';

describe('StatDashboardComponent', () => {
  let component: StatDashboardComponent;
  let fixture: ComponentFixture<StatDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [StatDashboardComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(StatDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
