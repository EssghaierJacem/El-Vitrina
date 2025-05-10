import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestViewDialogComponent } from './request-view-dialog.component';
import { COMMON_TEST_CONFIG, DIALOG_PROVIDERS } from 'src/app/testing/test-utils';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('RequestViewDialogComponent', () => {
  let component: RequestViewDialogComponent;
  let fixture: ComponentFixture<RequestViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestViewDialogComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [
        ...COMMON_TEST_CONFIG.providers, 
        ...DIALOG_PROVIDERS,
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            request: {
              id: 1,
              title: 'Test Request',
              description: 'Test Description',
              status: 'PENDING',
              minPrice: 10,
              maxPrice: 100,
              deliveryTime: new Date().toISOString()
            },
            proposals: []
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
