import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { ViewRequestPersoComponent } from './view-request-perso.component';

describe('ViewRequestPersoComponent', () => {
  let component: ViewRequestPersoComponent;
  let fixture: ComponentFixture<ViewRequestPersoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [ViewRequestPersoComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(ViewRequestPersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
