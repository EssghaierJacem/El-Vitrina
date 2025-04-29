import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdApprovalListComponent } from './ad-approval-list.component';

describe('AdApprovalListComponent', () => {
  let component: AdApprovalListComponent;
  let fixture: ComponentFixture<AdApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdApprovalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
