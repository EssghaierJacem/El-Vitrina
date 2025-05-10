import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// Mock for ToastrService
export const TOASTR_MOCK = {
  success: jasmine.createSpy('success'),
  error: jasmine.createSpy('error'),
  info: jasmine.createSpy('info'),
  warning: jasmine.createSpy('warning')
};

// Common imports for component tests that need HTTP
export const HTTP_IMPORTS = [HttpClientTestingModule];

// Create a more robust ActivatedRoute mock
export class MockActivatedRoute {
  private paramMapSubject = new BehaviorSubject(convertToParamMap({id: '1'}));
  private queryParamMapSubject = new BehaviorSubject(convertToParamMap({}));
  private paramsSubject = new BehaviorSubject({id: '1'});
  private queryParamsSubject = new BehaviorSubject({});

  paramMap: Observable<ParamMap> = this.paramMapSubject.asObservable();
  queryParamMap: Observable<ParamMap> = this.queryParamMapSubject.asObservable();
  params: Observable<any> = this.paramsSubject.asObservable();
  queryParams: Observable<any> = this.queryParamsSubject.asObservable();

  snapshot = {
    paramMap: convertToParamMap({id: '1'}),
    queryParamMap: convertToParamMap({}),
    params: {id: '1'},
    queryParams: {}
  };

  // Method to update params if needed in tests
  setParamMap(params: any) {
    this.paramMapSubject.next(convertToParamMap(params));
    this.paramsSubject.next(params);
    this.snapshot.paramMap = convertToParamMap(params);
    this.snapshot.params = params;
  }

  // Method to update query params if needed in tests
  setQueryParamMap(params: any) {
    this.queryParamMapSubject.next(convertToParamMap(params));
    this.queryParamsSubject.next(params);
    this.snapshot.queryParamMap = convertToParamMap(params);
    this.snapshot.queryParams = params;
  }
}

// Common providers for components that need ActivatedRoute
export const ROUTE_PROVIDERS = [
  {
    provide: ActivatedRoute,
    useClass: MockActivatedRoute
  }
];

// Common providers for components that need MatDialogRef
export const DIALOG_PROVIDERS = [
  {
    provide: MatDialogRef,
    useValue: {
      close: () => {}
    }
  },
  {
    provide: MAT_DIALOG_DATA,
    useValue: {}
  }
];

// Providers for components that need ToastrService
export const TOASTR_PROVIDERS = [
  {
    provide: 'ToastrService',
    useValue: TOASTR_MOCK
  }
];

// Combined providers for components that need HTTP and ActivatedRoute
export const COMMON_TEST_PROVIDERS = [
  ...ROUTE_PROVIDERS,
  ...TOASTR_PROVIDERS
];

// Combined imports and providers for most component tests
export const COMMON_TEST_CONFIG = {
  imports: HTTP_IMPORTS,
  providers: COMMON_TEST_PROVIDERS
}; 