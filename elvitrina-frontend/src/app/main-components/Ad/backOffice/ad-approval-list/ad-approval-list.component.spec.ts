import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { AdApprovalListComponent } from './ad-approval-list.component';

describe('AdApprovalListComponent', () => {
  let component: AdApprovalListComponent;
  let fixture: ComponentFixture<AdApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [AdApprovalListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(AdApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
