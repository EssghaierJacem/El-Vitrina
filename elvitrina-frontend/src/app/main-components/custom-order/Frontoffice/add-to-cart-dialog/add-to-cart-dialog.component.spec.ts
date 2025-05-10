import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG, ROUTE_PROVIDERS } from 'src/app/testing/test-utils';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TokenService } from 'src/app/core/services/user/TokenService';

import { AddToCartDialogComponent } from './add-to-cart-dialog.component';

describe('AddToCartDialogComponent', () => {
  let component: AddToCartDialogComponent;
  let fixture: ComponentFixture<AddToCartDialogComponent>;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;

  beforeEach(async () => {
    tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken', 'getDecodedToken']);
    tokenServiceSpy.getToken.and.returnValue('test-token');
    tokenServiceSpy.getDecodedToken.and.returnValue({
      id: 1,
      firstname: 'Test User',
      email: 'test@example.com'
    });

    await TestBed.configureTestingModule({
      imports: [AddToCartDialogComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [
        ...COMMON_TEST_CONFIG.providers,
        { provide: TokenService, useValue: tokenServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({productId: '1'})),
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'productId' ? '1' : null
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToCartDialogComponent);
    component = fixture.componentInstance;
    
    // Set properties needed for initialization
    component.product = {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      description: 'Test Description'
    };
    
    component.currentUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    };
    
    // Initialize manually
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
