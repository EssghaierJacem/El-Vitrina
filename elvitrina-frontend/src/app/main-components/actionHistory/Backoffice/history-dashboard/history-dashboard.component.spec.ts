import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { HistoryDashboardComponent } from './history-dashboard.component';

describe('HistoryDashboardComponent', () => {
  let component: HistoryDashboardComponent;
  let fixture: ComponentFixture<HistoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [HistoryDashboardComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(HistoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
