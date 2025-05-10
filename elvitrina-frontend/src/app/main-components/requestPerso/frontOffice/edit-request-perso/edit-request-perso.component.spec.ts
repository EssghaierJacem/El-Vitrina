import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { EditRequestPersoComponent } from './edit-request-perso.component';

describe('EditRequestPersoComponent', () => {
  let component: EditRequestPersoComponent;
  let fixture: ComponentFixture<EditRequestPersoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [EditRequestPersoComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(EditRequestPersoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
